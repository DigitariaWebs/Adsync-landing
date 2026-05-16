import { FormEvent, useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { supabase, WaitlistEntry, WaitlistRole, EffectivePermissions, ADMIN_EMAIL } from '../lib/supabase';
import { BrandBadge } from '../components/BrandedText';
import AdminMessages from './AdminMessages';
import AdminTeam from './AdminTeam';
import AdminAudit from './AdminAudit';
import AdminPartners from './AdminPartners';
import { logAction } from './audit';

type AdminView = 'waitlist' | 'partners' | 'messages' | 'team' | 'audit';

type RoleFilter = 'all' | WaitlistRole;

type ParsedPlatform = { name: string; handle: string; audience: string };

function parsePlatformEntries(raw: string | null | undefined): ParsedPlatform[] {
  if (!raw) return [];
  return raw
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => {
      // Format actuel : "• Instagram — @user (10 000 à 100 000)"
      const newFmt = line.match(/^•\s*(.+?)\s+—\s+(.+?)\s*\(([^)]+)\)\s*$/);
      if (newFmt) {
        return { name: newFmt[1].trim(), handle: newFmt[2].trim(), audience: newFmt[3].trim() };
      }
      // Ancien format : "Instagram : @user"
      const oldFmt = line.match(/^([A-Za-zÀ-ÿ()\s\-]+?)\s*[:：]\s*(.+)$/);
      if (oldFmt) {
        return { name: oldFmt[1].trim(), handle: oldFmt[2].trim(), audience: '—' };
      }
      // Format inconnu : on garde la ligne comme nom de plateforme
      return { name: line, handle: '', audience: '—' };
    });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function buildGmailBroadcastUrl(bcc: string[], subject: string, body: string) {
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    bcc: bcc.join(','),
    su: subject,
    body,
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

const DEFAULT_BROADCAST_SUBJECT = 'AdSync.io est disponible 🎉';
const DEFAULT_BROADCAST_BODY = `Bonjour,

Bonne nouvelle : AdSync.io est officiellement disponible !

Tu peux maintenant télécharger l'app et activer ton compte pour commencer à monétiser tes espaces ou lancer tes campagnes.

👉 Lien de téléchargement : https://adsync.io

Merci de faire partie de la première vague. On a hâte de te voir sur la plateforme.

— L'équipe AdSync.io`;

function downloadXlsx(rows: WaitlistEntry[]) {
  const header = ['created_at', 'role', 'name', 'email', 'platform', 'category', 'country', 'city', 'objective', 'audience_size', 'phone', 'referral_code'];
  const data = rows.map(r => {
    const obj: Record<string, unknown> = {};
    const src = r as unknown as Record<string, unknown>;
    for (const key of header) {
      obj[key] = src[key] ?? '';
    }
    return obj;
  });
  const worksheet = XLSX.utils.json_to_sheet(data, { header });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Waitlist');
  XLSX.writeFile(workbook, `waitlist-${new Date().toISOString().slice(0, 10)}.xlsx`);
  void logAction('waitlist.export', 'waitlist', null, { count: rows.length, format: 'xlsx' });
}

type Props = {
  adminEmail: string;
  permissions: EffectivePermissions;
  onSignOut: () => void;
};

export default function AdminDashboard({ adminEmail, permissions, onSignOut }: Props) {
  const initialView: AdminView = permissions.canViewWaitlist
    ? 'waitlist'
    : permissions.canViewMessages
      ? 'messages'
      : permissions.isAdmin
        ? 'team'
        : 'waitlist';
  const [view, setView] = useState<AdminView>(initialView);
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [referralWith, setReferralWith] = useState(true);
  const [referralWithout, setReferralWithout] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [pwdOpen, setPwdOpen] = useState(false);
  const [pwdNew, setPwdNew] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');
  const [pwdSubmitting, setPwdSubmitting] = useState(false);
  const [pwdMessage, setPwdMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPwdMessage(null);
    if (pwdNew.length < 8) {
      setPwdMessage({ type: 'error', text: 'Le mot de passe doit faire au moins 8 caractères.' });
      return;
    }
    if (pwdNew !== pwdConfirm) {
      setPwdMessage({ type: 'error', text: 'Les deux mots de passe ne correspondent pas.' });
      return;
    }
    setPwdSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password: pwdNew });
    setPwdSubmitting(false);
    if (error) {
      setPwdMessage({ type: 'error', text: error.message || 'Échec du changement de mot de passe.' });
      return;
    }
    setPwdMessage({ type: 'success', text: 'Mot de passe mis à jour avec succès.' });
    setPwdNew('');
    setPwdConfirm('');
    void logAction('account.password_changed', 'auth', null, undefined);
  };

  useEffect(() => {
    if (!permissions.canViewWaitlist) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false });

      if (cancelled) return;

      if (error) {
        setErrorMsg(error.message);
      } else if (data) {
        setEntries(data as WaitlistEntry[]);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [permissions.canViewWaitlist]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const e of entries) {
      if (e.category) set.add(e.category);
    }
    return Array.from(set).sort();
  }, [entries]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return entries.filter(e => {
      if (roleFilter !== 'all' && e.role !== roleFilter) return false;
      if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
      const hasReferral = !!e.referral_code;
      if (hasReferral && !referralWith) return false;
      if (!hasReferral && !referralWithout) return false;
      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        (e.platform ?? '').toLowerCase().includes(q) ||
        (e.category ?? '').toLowerCase().includes(q) ||
        (e.referral_code ?? '').toLowerCase().includes(q)
      );
    });
  }, [entries, roleFilter, categoryFilter, referralWith, referralWithout, search]);

  const stats = useMemo(() => {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    let createurs = 0;
    let marques = 0;
    let last24h = 0;
    let last7d = 0;
    let withReferral = 0;
    for (const e of entries) {
      if (e.role === 'createur') createurs++;
      else if (e.role === 'marque') marques++;
      const ts = new Date(e.created_at).getTime();
      if (now - ts < dayMs) last24h++;
      if (now - ts < 7 * dayMs) last7d++;
      if (e.referral_code) withReferral++;
    }
    return { total: entries.length, createurs, marques, last24h, last7d, withReferral };
  }, [entries]);

  const titleFor = (v: AdminView) => {
    if (v === 'waitlist') return 'Liste d’attente';
    if (v === 'partners') return 'Partenaires';
    if (v === 'messages') return 'Messages reçus';
    if (v === 'team') return 'Équipe';
    return 'Activité';
  };

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <a href="/" className="admin-back" aria-label="Retour au site">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <span className="admin-brand-mark">A</span>
          <div>
            <span className="admin-brand-kicker">
              <span className="brand-name">AdSync.io</span><BrandBadge /> admin {permissions.isAdmin ? '· Admin' : '· Manager'}
            </span>
            <h1>{titleFor(view)}</h1>
          </div>
        </div>
        <div className="admin-topbar-right">
          <span className="admin-user">{adminEmail}</span>
          <button
            type="button"
            className="admin-signout admin-pwd-btn"
            onClick={() => { setPwdOpen(true); setPwdMessage(null); }}
          >
            Changer mot de passe
          </button>
          <button type="button" className="admin-signout" onClick={onSignOut}>
            Déconnexion
          </button>
        </div>
      </header>

      {pwdOpen && (
        <div className="admin-modal-backdrop" onClick={() => setPwdOpen(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <header className="admin-modal-head">
              <h3>Changer mon mot de passe</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setPwdOpen(false)}
                aria-label="Fermer"
              >
                ×
              </button>
            </header>
            <form className="admin-pwd-form" onSubmit={handleChangePassword}>
              <label>
                <span>Nouveau mot de passe</span>
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={pwdNew}
                  onChange={e => setPwdNew(e.target.value)}
                  placeholder="8 caractères minimum"
                />
              </label>
              <label>
                <span>Confirmer le nouveau mot de passe</span>
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={pwdConfirm}
                  onChange={e => setPwdConfirm(e.target.value)}
                />
              </label>
              {pwdMessage && (
                <p className={`admin-pwd-feedback admin-pwd-feedback-${pwdMessage.type}`}>
                  {pwdMessage.text}
                </p>
              )}
              <div className="admin-pwd-actions">
                <button type="button" onClick={() => setPwdOpen(false)} className="admin-pwd-cancel">
                  Annuler
                </button>
                <button type="submit" disabled={pwdSubmitting}>
                  {pwdSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <nav className="admin-tabs" role="tablist" aria-label="Sections admin">
        {permissions.canViewWaitlist && (
          <button
            type="button"
            role="tab"
            aria-selected={view === 'waitlist'}
            className={`admin-tab ${view === 'waitlist' ? 'is-active' : ''}`}
            onClick={() => setView('waitlist')}
          >
            Inscriptions
          </button>
        )}
        {permissions.canViewWaitlist && (
          <button
            type="button"
            role="tab"
            aria-selected={view === 'partners'}
            className={`admin-tab ${view === 'partners' ? 'is-active' : ''}`}
            onClick={() => setView('partners')}
          >
            Partenaires
          </button>
        )}
        {permissions.canViewMessages && (
          <button
            type="button"
            role="tab"
            aria-selected={view === 'messages'}
            className={`admin-tab ${view === 'messages' ? 'is-active' : ''}`}
            onClick={() => setView('messages')}
          >
            Messages
          </button>
        )}
        {permissions.isAdmin && (
          <>
            <button
              type="button"
              role="tab"
              aria-selected={view === 'team'}
              className={`admin-tab ${view === 'team' ? 'is-active' : ''}`}
              onClick={() => setView('team')}
            >
              Équipe
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === 'audit'}
              className={`admin-tab ${view === 'audit' ? 'is-active' : ''}`}
              onClick={() => setView('audit')}
            >
              Activité
            </button>
          </>
        )}
      </nav>

      {view === 'partners' && permissions.canViewWaitlist && <AdminPartners />}

      {view === 'messages' && permissions.canViewMessages && (
        <AdminMessages canReply={permissions.canReplyMessages} />
      )}

      {view === 'team' && permissions.isAdmin && (
        <AdminTeam adminEmail={ADMIN_EMAIL || adminEmail} />
      )}

      {view === 'audit' && permissions.isAdmin && <AdminAudit />}

      {view === 'waitlist' && permissions.canViewWaitlist && (
        <WaitlistView
          entries={entries}
          loading={loading}
          errorMsg={errorMsg}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          referralWith={referralWith}
          setReferralWith={setReferralWith}
          referralWithout={referralWithout}
          setReferralWithout={setReferralWithout}
          search={search}
          setSearch={setSearch}
          categories={categories}
          stats={stats}
          filtered={filtered}
          canExport={permissions.canEditWaitlist}
          onDelete={async entry => {
            const confirmed = window.confirm(
              `Supprimer définitivement l'inscription de ${entry.name} (${entry.email}) ?\n\nCette action est irréversible.`,
            );
            if (!confirmed) return;
            const { error } = await supabase.from('waitlist').delete().eq('id', entry.id);
            if (error) {
              setErrorMsg(error.message);
              return;
            }
            setEntries(prev => prev.filter(e => e.id !== entry.id));
            void logAction('waitlist.delete', 'waitlist', entry.id, {
              email: entry.email,
              role: entry.role,
            });
          }}
        />
      )}
    </div>
  );
}

type WaitlistViewProps = {
  entries: WaitlistEntry[];
  loading: boolean;
  errorMsg: string;
  roleFilter: RoleFilter;
  setRoleFilter: (r: RoleFilter) => void;
  categoryFilter: string;
  setCategoryFilter: (c: string) => void;
  referralWith: boolean;
  setReferralWith: (v: boolean) => void;
  referralWithout: boolean;
  setReferralWithout: (v: boolean) => void;
  search: string;
  setSearch: (s: string) => void;
  categories: string[];
  stats: { total: number; createurs: number; marques: number; last24h: number; last7d: number; withReferral: number };
  filtered: WaitlistEntry[];
  canExport: boolean;
  onDelete: (entry: WaitlistEntry) => Promise<void>;
};

function WaitlistView({
  entries,
  loading,
  errorMsg,
  roleFilter,
  setRoleFilter,
  categoryFilter,
  setCategoryFilter,
  referralWith,
  setReferralWith,
  referralWithout,
  setReferralWithout,
  search,
  setSearch,
  categories,
  stats,
  filtered,
  canExport,
  onDelete,
}: WaitlistViewProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [broadcastSubject, setBroadcastSubject] = useState(DEFAULT_BROADCAST_SUBJECT);
  const [broadcastBody, setBroadcastBody] = useState(DEFAULT_BROADCAST_BODY);
  const [broadcastFeedback, setBroadcastFeedback] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredIds = useMemo(() => filtered.map(e => e.id), [filtered]);
  const allFilteredSelected =
    filtered.length > 0 && filtered.every(e => selectedIds.has(e.id));
  const someFilteredSelected =
    !allFilteredSelected && filtered.some(e => selectedIds.has(e.id));

  const toggleRow = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllFiltered = () => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (allFilteredSelected) {
        for (const id of filteredIds) next.delete(id);
      } else {
        for (const id of filteredIds) next.add(id);
      }
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const broadcastEmails = useMemo(
    () =>
      Array.from(
        new Set(
          entries
            .filter(e => selectedIds.has(e.id))
            .map(e => e.email?.trim().toLowerCase())
            .filter((e): e is string => !!e),
        ),
      ),
    [entries, selectedIds],
  );

  const openInGmailBroadcast = () => {
    if (broadcastEmails.length === 0) return;
    const url = buildGmailBroadcastUrl(broadcastEmails, broadcastSubject, broadcastBody);
    window.open(url, '_blank', 'noopener,noreferrer');
    void logAction('waitlist.broadcast', 'waitlist', null, {
      count: broadcastEmails.length,
      via: 'gmail',
    });
  };

  const copyBroadcastEmails = async () => {
    try {
      await navigator.clipboard.writeText(broadcastEmails.join(', '));
      setBroadcastFeedback(`${broadcastEmails.length} emails copiés dans le presse-papiers.`);
      void logAction('waitlist.broadcast', 'waitlist', null, {
        count: broadcastEmails.length,
        via: 'clipboard',
      });
      setTimeout(() => setBroadcastFeedback(''), 4000);
    } catch {
      setBroadcastFeedback("Impossible de copier — copie manuellement depuis l'aperçu.");
    }
  };

  return (
    <>
      {errorMsg && <div className="admin-error-banner">{errorMsg}</div>}

      <section className="admin-kpis">
        <article className="admin-kpi">
          <span className="admin-kpi-label">Total inscrits</span>
          <strong>{stats.total}</strong>
        </article>
        <article className="admin-kpi">
          <span className="admin-kpi-label">Créateurs</span>
          <strong>{stats.createurs}</strong>
        </article>
        <article className="admin-kpi">
          <span className="admin-kpi-label">Marques</span>
          <strong>{stats.marques}</strong>
        </article>
        <article className="admin-kpi">
          <span className="admin-kpi-label">Dernières 24h</span>
          <strong>{stats.last24h}</strong>
        </article>
        <article className="admin-kpi">
          <span className="admin-kpi-label">7 derniers jours</span>
          <strong>{stats.last7d}</strong>
        </article>
        <article className="admin-kpi">
          <span className="admin-kpi-label">Via code partenaire</span>
          <strong>{stats.withReferral}</strong>
        </article>
      </section>

      <section className="admin-toolbar">
        <div className="admin-toolbar-filters">
          <div className="admin-segment" role="tablist" aria-label="Filtrer par rôle">
            {(['all', 'createur', 'marque'] as RoleFilter[]).map(opt => (
              <button
                key={opt}
                type="button"
                className={`admin-segment-btn ${roleFilter === opt ? 'is-active' : ''}`}
                onClick={() => setRoleFilter(opt)}
              >
                {opt === 'all' ? 'Tous' : opt === 'createur' ? 'Créateurs' : 'Marques'}
              </button>
            ))}
          </div>

          <select
            className="admin-select"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            aria-label="Filtrer par catégorie"
          >
            <option value="all">Toutes catégories</option>
            {categories.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <div className="admin-referral-toggles" role="group" aria-label="Filtrer par code partenaire">
            <label className="admin-referral-toggle">
              <input
                type="checkbox"
                checked={referralWith}
                onChange={e => setReferralWith(e.target.checked)}
              />
              <span>Avec parrainage</span>
            </label>
            <label className="admin-referral-toggle">
              <input
                type="checkbox"
                checked={referralWithout}
                onChange={e => setReferralWithout(e.target.checked)}
              />
              <span>Sans parrainage</span>
            </label>
          </div>

          <input
            type="search"
            className="admin-search"
            placeholder="Rechercher nom, email, plateforme, code..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {canExport && (
          <div className="admin-toolbar-actions">
            <button
              type="button"
              className="admin-export admin-export-secondary"
              onClick={() => {
                setBroadcastOpen(true);
                setBroadcastFeedback('');
              }}
              disabled={broadcastEmails.length === 0}
            >
              Envoyer un email aux sélectionnés ({broadcastEmails.length})
            </button>
            {selectedIds.size > 0 && (
              <button
                type="button"
                className="admin-export admin-export-secondary"
                onClick={clearSelection}
              >
                Désélectionner
              </button>
            )}
            <button
              type="button"
              className="admin-export"
              onClick={() => downloadXlsx(filtered)}
              disabled={filtered.length === 0}
            >
              Exporter Excel ({filtered.length})
            </button>
          </div>
        )}
      </section>

      {broadcastOpen && (
        <div className="admin-modal-backdrop" onClick={() => setBroadcastOpen(false)}>
          <div className="admin-modal admin-modal-broadcast" onClick={e => e.stopPropagation()}>
            <header className="admin-modal-head">
              <h3>Email aux inscrits sélectionnés ({broadcastEmails.length})</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setBroadcastOpen(false)}
                aria-label="Fermer"
              >
                ×
              </button>
            </header>
            <div className="admin-broadcast-body">
              <label className="admin-broadcast-field">
                <span>Sujet</span>
                <input
                  type="text"
                  value={broadcastSubject}
                  onChange={e => setBroadcastSubject(e.target.value)}
                  placeholder="Sujet de l'email"
                />
              </label>
              <label className="admin-broadcast-field">
                <span>Message</span>
                <textarea
                  rows={10}
                  value={broadcastBody}
                  onChange={e => setBroadcastBody(e.target.value)}
                  placeholder="Contenu de l'email"
                />
              </label>
              <p className="admin-broadcast-hint">
                Les destinataires sont placés en <strong>BCC</strong> (cachés entre eux). Coche
                uniquement les inscrits à qui tu veux envoyer ce message — utilise les filtres puis
                « Tout cocher » pour cibler un sous-groupe rapidement.
              </p>
              {broadcastFeedback && (
                <p className="admin-broadcast-feedback">{broadcastFeedback}</p>
              )}
              <div className="admin-broadcast-actions">
                <button
                  type="button"
                  className="admin-pwd-cancel"
                  onClick={copyBroadcastEmails}
                  disabled={broadcastEmails.length === 0}
                >
                  Copier les emails
                </button>
                <button
                  type="button"
                  className="admin-pwd-submit"
                  onClick={openInGmailBroadcast}
                  disabled={broadcastEmails.length === 0 || !broadcastSubject.trim()}
                >
                  Ouvrir dans Gmail
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="admin-table-wrap">
        {loading ? (
          <div className="admin-empty">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">
            {entries.length === 0
              ? 'Aucune inscription pour le moment.'
              : 'Aucun résultat avec ces filtres.'}
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-cell-check">
                  <input
                    type="checkbox"
                    aria-label="Tout cocher / décocher"
                    checked={allFilteredSelected}
                    ref={el => {
                      if (el) el.indeterminate = someFilteredSelected;
                    }}
                    onChange={toggleAllFiltered}
                  />
                </th>
                <th>Date</th>
                <th>Rôle</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Plateforme / Site</th>
                <th>Catégorie / Secteur</th>
                <th>Audience / Budget</th>
                <th>Pays / Ville</th>
                <th>Objectif</th>
                <th>Code parrain</th>
                {canExport && <th></th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map(entry => (
                <tr key={entry.id} className={selectedIds.has(entry.id) ? 'is-selected' : ''}>
                  <td className="admin-cell-check">
                    <input
                      type="checkbox"
                      aria-label={`Sélectionner ${entry.name}`}
                      checked={selectedIds.has(entry.id)}
                      onChange={() => toggleRow(entry.id)}
                    />
                  </td>
                  <td className="admin-cell-date">{formatDate(entry.created_at)}</td>
                  <td>
                    <span className={`admin-role admin-role-${entry.role}`}>
                      {entry.role === 'createur' ? 'Créateur' : 'Marque'}
                    </span>
                  </td>
                  <td className="admin-cell-name">{entry.name}</td>
                  <td className="admin-cell-email">
                    <a href={`mailto:${entry.email}`}>{entry.email}</a>
                  </td>
                  <td className="admin-cell-platform-pills">
                    {entry.role === 'createur' ? (
                      (() => {
                        const pl = parsePlatformEntries(entry.platform);
                        if (pl.length === 0) return <span className="admin-pill-empty">—</span>;
                        return (
                          <ul className="admin-platform-list">
                            {pl.map((p, i) => (
                              <li key={`${p.name}-${i}`} className="admin-platform-item">
                                <span className="admin-pill" data-platform={p.name}>
                                  {p.name}
                                </span>
                                {p.handle && (
                                  <span className="admin-platform-handle">{p.handle}</span>
                                )}
                                {p.audience && p.audience !== '—' && (
                                  <span className="admin-platform-audience">· {p.audience}</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        );
                      })()
                    ) : (
                      <span className="admin-pill-site">{entry.platform ?? '—'}</span>
                    )}
                  </td>
                  <td>{entry.category ?? '—'}</td>
                  <td className="admin-cell-audience">
                    {entry.role === 'createur' ? (
                      <span className="admin-pill-empty" title={entry.audience_size ?? ''}>
                        {parsePlatformEntries(entry.platform).length} plateforme
                        {parsePlatformEntries(entry.platform).length > 1 ? 's' : ''}
                      </span>
                    ) : (
                      entry.audience_size ?? '—'
                    )}
                  </td>
                  <td>
                    <div>{entry.country ?? '—'}</div>
                    {entry.city && <div className="admin-cell-city">{entry.city}</div>}
                  </td>
                  <td>{entry.role === 'marque' ? (entry.objective ?? '—') : '—'}</td>
                  <td className="admin-cell-referral">
                    {entry.referral_code ? (
                      <span className="admin-referral-pill">{entry.referral_code}</span>
                    ) : (
                      <span className="admin-pill-empty">—</span>
                    )}
                  </td>
                  {canExport && (
                    <td>
                      <button
                        type="button"
                        className="admin-row-delete"
                        onClick={async () => {
                          setDeletingId(entry.id);
                          await onDelete(entry);
                          setDeletingId(null);
                        }}
                        disabled={deletingId === entry.id}
                        aria-label={`Supprimer ${entry.name}`}
                        title="Supprimer cette inscription"
                      >
                        {deletingId === entry.id ? '...' : '🗑'}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}

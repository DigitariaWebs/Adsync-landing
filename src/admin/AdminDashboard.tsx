import { useEffect, useMemo, useState } from 'react';
import { supabase, WaitlistEntry, WaitlistRole, EffectivePermissions, ADMIN_EMAIL } from '../lib/supabase';
import AdminMessages from './AdminMessages';
import AdminTeam from './AdminTeam';
import AdminAudit from './AdminAudit';
import { logAction } from './audit';

type AdminView = 'waitlist' | 'messages' | 'team' | 'audit';

type RoleFilter = 'all' | WaitlistRole;

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function downloadCsv(rows: WaitlistEntry[]) {
  const header = ['created_at', 'role', 'name', 'email', 'platform', 'category', 'country', 'audience_size', 'phone'];
  const lines = [header.join(',')];
  for (const r of rows) {
    lines.push(
      header
        .map(key => escapeCsv((r as unknown as Record<string, unknown>)[key]))
        .join(','),
    );
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  void logAction('waitlist.export', 'waitlist', null, { count: rows.length });
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
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

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
      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        (e.platform ?? '').toLowerCase().includes(q) ||
        (e.category ?? '').toLowerCase().includes(q)
      );
    });
  }, [entries, roleFilter, categoryFilter, search]);

  const stats = useMemo(() => {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    let createurs = 0;
    let marques = 0;
    let last24h = 0;
    let last7d = 0;
    for (const e of entries) {
      if (e.role === 'createur') createurs++;
      else if (e.role === 'marque') marques++;
      const ts = new Date(e.created_at).getTime();
      if (now - ts < dayMs) last24h++;
      if (now - ts < 7 * dayMs) last7d++;
    }
    return { total: entries.length, createurs, marques, last24h, last7d };
  }, [entries]);

  const titleFor = (v: AdminView) => {
    if (v === 'waitlist') return 'Liste d’attente';
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
              AdSync admin {permissions.isAdmin ? '· Admin' : '· Manager'}
            </span>
            <h1>{titleFor(view)}</h1>
          </div>
        </div>
        <div className="admin-topbar-right">
          <span className="admin-user">{adminEmail}</span>
          <button type="button" className="admin-signout" onClick={onSignOut}>
            Déconnexion
          </button>
        </div>
      </header>

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
          search={search}
          setSearch={setSearch}
          categories={categories}
          stats={stats}
          filtered={filtered}
          canExport={permissions.canEditWaitlist}
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
  search: string;
  setSearch: (s: string) => void;
  categories: string[];
  stats: { total: number; createurs: number; marques: number; last24h: number; last7d: number };
  filtered: WaitlistEntry[];
  canExport: boolean;
};

function WaitlistView({
  entries,
  loading,
  errorMsg,
  roleFilter,
  setRoleFilter,
  categoryFilter,
  setCategoryFilter,
  search,
  setSearch,
  categories,
  stats,
  filtered,
  canExport,
}: WaitlistViewProps) {
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

          <input
            type="search"
            className="admin-search"
            placeholder="Rechercher nom, email, plateforme..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {canExport && (
          <button
            type="button"
            className="admin-export"
            onClick={() => downloadCsv(filtered)}
            disabled={filtered.length === 0}
          >
            Exporter CSV ({filtered.length})
          </button>
        )}
      </section>

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
                <th>Date</th>
                <th>Rôle</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Plateforme / Site</th>
                <th>Catégorie / Secteur</th>
                <th>Audience / Budget</th>
                <th>Pays / Objectif</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(entry => (
                <tr key={entry.id}>
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
                  <td>{entry.platform ?? '.'}</td>
                  <td>{entry.category ?? '.'}</td>
                  <td>{entry.audience_size ?? '.'}</td>
                  <td>{entry.country ?? '.'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}

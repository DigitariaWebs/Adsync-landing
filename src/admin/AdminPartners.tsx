import { useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { supabase, Partner, PartnerStats, Referral } from '../lib/supabase';
import { logAction } from './audit';

type PartnerRow = Partner & {
  total_referrals: number;
  referrals_with_contract: number;
  referrals_paid: number;
  total_commission: number;
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  active: 'Actif',
  first_contract: '1er contrat',
  second_contract: '2ème contrat',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function downloadXlsx(rows: PartnerRow[]) {
  const header = [
    'created_at',
    'first_name',
    'last_name',
    'email',
    'referral_code',
    'main_network',
    'audience_size',
    'profile_url',
    'total_referrals',
    'referrals_with_contract',
    'referrals_paid',
    'total_commission',
  ];
  const data = rows.map(r => {
    const obj: Record<string, unknown> = {};
    const src = r as unknown as Record<string, unknown>;
    for (const key of header) obj[key] = src[key] ?? '';
    return obj;
  });
  const ws = XLSX.utils.json_to_sheet(data, { header });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Partners');
  XLSX.writeFile(wb, `partners-${new Date().toISOString().slice(0, 10)}.xlsx`);
  void logAction('partners.export', 'partners', null, { count: rows.length, format: 'xlsx' });
}

export default function AdminPartners() {
  const [partners, setPartners] = useState<PartnerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [search, setSearch] = useState('');
  const [networkFilter, setNetworkFilter] = useState<string>('all');
  const [selectedPartner, setSelectedPartner] = useState<PartnerRow | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [referralsLoading, setReferralsLoading] = useState(false);

  const openReferrals = async (p: PartnerRow) => {
    setSelectedPartner(p);
    setReferrals([]);
    setReferralsLoading(true);
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('partner_id', p.id)
      .order('created_at', { ascending: false });
    setReferralsLoading(false);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    setReferrals((data as Referral[]) ?? []);
  };

  const closeReferrals = () => {
    setSelectedPartner(null);
    setReferrals([]);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [partnersRes, statsRes] = await Promise.all([
        supabase.from('partners').select('*').order('created_at', { ascending: false }),
        supabase.from('partner_stats').select('*'),
      ]);

      if (cancelled) return;

      if (partnersRes.error) {
        setErrorMsg(partnersRes.error.message);
        setLoading(false);
        return;
      }

      const statsByPartner = new Map<string, PartnerStats>();
      if (statsRes.data) {
        for (const s of statsRes.data as PartnerStats[]) {
          statsByPartner.set(s.partner_id, s);
        }
      }

      const enriched: PartnerRow[] = (partnersRes.data as Partner[]).map(p => {
        const s = statsByPartner.get(p.id);
        return {
          ...p,
          total_referrals: Number(s?.total_referrals ?? 0),
          referrals_with_contract: Number(s?.referrals_with_contract ?? 0),
          referrals_paid: Number(s?.referrals_paid ?? 0),
          total_commission: Number(s?.total_commission ?? 0),
        };
      });

      setPartners(enriched);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const networks = useMemo(() => {
    const set = new Set<string>();
    for (const p of partners) {
      if (p.main_network) set.add(p.main_network);
    }
    return Array.from(set).sort();
  }, [partners]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return partners.filter(p => {
      if (networkFilter !== 'all' && p.main_network !== networkFilter) return false;
      if (!q) return true;
      return (
        p.first_name.toLowerCase().includes(q) ||
        p.last_name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.referral_code.toLowerCase().includes(q) ||
        (p.main_network ?? '').toLowerCase().includes(q)
      );
    });
  }, [partners, search, networkFilter]);

  const stats = useMemo(() => {
    let totalReferrals = 0;
    let totalWithContract = 0;
    let totalCommission = 0;
    for (const p of partners) {
      totalReferrals += p.total_referrals;
      totalWithContract += p.referrals_with_contract;
      totalCommission += p.total_commission;
    }
    return {
      total: partners.length,
      totalReferrals,
      totalWithContract,
      totalCommission,
    };
  }, [partners]);

  return (
    <>
      {errorMsg && <div className="admin-error-banner">{errorMsg}</div>}

      <section className="admin-kpis">
        <article className="admin-kpi">
          <span className="admin-kpi-label">Partenaires inscrits</span>
          <strong>{stats.total}</strong>
        </article>
        <article className="admin-kpi">
          <span className="admin-kpi-label">Total filleuls</span>
          <strong>{stats.totalReferrals}</strong>
        </article>
        <article className="admin-kpi">
          <span className="admin-kpi-label">Filleuls sous contrat</span>
          <strong>{stats.totalWithContract}</strong>
        </article>
        <article className="admin-kpi">
          <span className="admin-kpi-label">Commissions versées</span>
          <strong>{stats.totalCommission.toFixed(2)} €</strong>
        </article>
      </section>

      <section className="admin-toolbar">
        <div className="admin-toolbar-filters">
          <select
            className="admin-select"
            value={networkFilter}
            onChange={e => setNetworkFilter(e.target.value)}
            aria-label="Filtrer par réseau"
          >
            <option value="all">Tous réseaux</option>
            {networks.map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>

          <input
            type="search"
            className="admin-search"
            placeholder="Rechercher nom, email, code parrain..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-toolbar-actions">
          <button
            type="button"
            className="admin-export"
            onClick={() => downloadXlsx(filtered)}
            disabled={filtered.length === 0}
          >
            Exporter Excel ({filtered.length})
          </button>
        </div>
      </section>

      <section className="admin-table-wrap">
        {loading ? (
          <div className="admin-empty">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">
            {partners.length === 0
              ? 'Aucun partenaire inscrit pour le moment.'
              : 'Aucun résultat avec ces filtres.'}
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Code parrain</th>
                <th>Réseau · Audience</th>
                <th>Profil</th>
                <th>Filleuls</th>
                <th>Sous contrat</th>
                <th>Commission</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td className="admin-cell-date">{formatDate(p.created_at)}</td>
                  <td className="admin-cell-name">
                    {p.first_name} {p.last_name}
                  </td>
                  <td className="admin-cell-email">
                    <a href={`mailto:${p.email}`}>{p.email}</a>
                  </td>
                  <td>
                    <span className="admin-referral-pill">{p.referral_code}</span>
                  </td>
                  <td>
                    <div>{p.main_network ?? '—'}</div>
                    {p.audience_size && (
                      <div className="admin-cell-city">{p.audience_size}</div>
                    )}
                  </td>
                  <td>
                    {p.profile_url ? (
                      <a href={p.profile_url} target="_blank" rel="noopener noreferrer">
                        Voir
                      </a>
                    ) : (
                      <span className="admin-pill-empty">—</span>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="admin-link-btn"
                      onClick={() => openReferrals(p)}
                      disabled={p.total_referrals === 0}
                      title={p.total_referrals === 0 ? 'Aucun filleul' : 'Voir les filleuls'}
                    >
                      {p.total_referrals}
                      {p.total_referrals > 0 && <span className="admin-link-btn-arrow"> →</span>}
                    </button>
                  </td>
                  <td>{p.referrals_with_contract}</td>
                  <td>{p.total_commission.toFixed(2)} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {selectedPartner && (
        <div className="admin-modal-backdrop" onClick={closeReferrals}>
          <div
            className="admin-modal admin-modal-referrals"
            onClick={e => e.stopPropagation()}
          >
            <header className="admin-modal-head">
              <div>
                <h3>
                  Filleuls de {selectedPartner.first_name} {selectedPartner.last_name}
                </h3>
                <p className="admin-modal-sub">
                  Code <strong>{selectedPartner.referral_code}</strong> ·{' '}
                  {selectedPartner.total_referrals} filleul
                  {selectedPartner.total_referrals > 1 ? 's' : ''}
                </p>
              </div>
              <button
                type="button"
                className="admin-modal-close"
                onClick={closeReferrals}
                aria-label="Fermer"
              >
                ×
              </button>
            </header>

            <div className="admin-modal-body">
              {referralsLoading ? (
                <div className="admin-empty">Chargement...</div>
              ) : referrals.length === 0 ? (
                <div className="admin-empty">Aucun filleul pour ce partenaire.</div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Rôle</th>
                      <th>Statut</th>
                      <th>Commission</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrals.map(r => (
                      <tr key={r.id}>
                        <td className="admin-cell-date">{formatDate(r.created_at)}</td>
                        <td>{r.name ?? '—'}</td>
                        <td className="admin-cell-email">
                          <a href={`mailto:${r.email}`}>{r.email}</a>
                        </td>
                        <td>
                          {r.role === 'createur'
                            ? 'Créateur'
                            : r.role === 'marque'
                              ? 'Marque'
                              : r.role === 'autre'
                                ? 'Autre'
                                : '—'}
                        </td>
                        <td>
                          <span className={`admin-referral-status admin-referral-status-${r.status}`}>
                            {STATUS_LABELS[r.status] ?? r.status}
                          </span>
                        </td>
                        <td>
                          {r.commission_amount != null
                            ? `${Number(r.commission_amount).toFixed(2)} €`
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import { useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, Partner, Referral } from '../lib/supabase';
import logoImage from '../assets/logo.png';
import starIcon from '../assets/a_high_end_premium_3d_icon_of_a_minimalist_4_pointed_star._the_star_features-removebg-preview.png';

type Props = {
  session: Session;
  onSignOut: () => void;
};

export default function PartnerDashboard({ session, onSignOut }: Props) {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErrorMsg('');

      const { data: partnerRow, error: partnerErr } = await supabase
        .from('partners')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (cancelled) return;

      if (partnerErr) {
        setErrorMsg(partnerErr.message);
        setLoading(false);
        return;
      }

      if (!partnerRow) {
        setErrorMsg(
          "Aucun profil partenaire associé à ce compte. Si tu viens de t'inscrire, vérifie que l'email est confirmé.",
        );
        setLoading(false);
        return;
      }

      setPartner(partnerRow as Partner);

      const { data: refsRow, error: refsErr } = await supabase
        .from('referrals')
        .select('*')
        .eq('partner_id', (partnerRow as Partner).id)
        .order('created_at', { ascending: false });

      if (cancelled) return;

      if (refsErr) {
        setErrorMsg(refsErr.message);
        setReferrals([]);
      } else {
        setReferrals((refsRow as Referral[]) ?? []);
      }

      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [session.user.id]);

  const stats = useMemo(() => {
    const total = referrals.length;
    const withContract = referrals.filter(r => r.status === 'first_contract' || r.status === 'second_contract').length;
    const paid = referrals.filter(r => r.status === 'second_contract').length;
    const commission = referrals
      .filter(r => r.status === 'second_contract')
      .reduce((sum, r) => sum + (Number(r.commission_amount) || 0), 0);
    return { total, withContract, paid, commission };
  }, [referrals]);

  const shareUrl = partner ? `${window.location.origin}/?ref=${partner.referral_code}` : '';

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="partners-shell">
      <header className="partners-topbar">
        <a href="/" className="brand" aria-label="Retour à l'accueil AdSync.io">
          <span className="brand-row">
            <img className="brand-star" src={starIcon} alt="" aria-hidden="true" />
            <img className="brand-logo" src={logoImage} alt="AdSync.io logo" />
          </span>
          <span className="brand-tagline">DASHBOARD PARTENAIRE</span>
        </a>
        <div className="partners-topbar-actions">
          <span className="partners-topbar-user">{session.user.email}</span>
          <button type="button" className="partners-back" onClick={onSignOut}>
            Se déconnecter
          </button>
        </div>
      </header>

      <main className="partners-dashboard-main">
        {loading ? (
          <div className="partners-dashboard-loading">Chargement...</div>
        ) : errorMsg ? (
          <div className="partners-dashboard-error">
            <h2>Impossible de charger ton tableau de bord</h2>
            <p>{errorMsg}</p>
          </div>
        ) : partner ? (
          <>
            <section className="partners-dashboard-hero">
              <div>
                <span className="eyebrow">Bonjour {partner.first_name}</span>
                <h1>Ton tableau de bord</h1>
                <p>Suis en temps réel les filleuls qui s&apos;inscrivent via ton code.</p>
              </div>
              <div className="partners-dashboard-code-card">
                <span className="partners-code-label">Ton code parrain</span>
                <div className="partners-code">{partner.referral_code}</div>
                <div className="partners-share-link">
                  <code>{shareUrl}</code>
                  <button type="button" onClick={handleCopy}>
                    {copied ? 'Copié ✓' : 'Copier'}
                  </button>
                </div>
              </div>
            </section>

            <section className="partners-dashboard-stats">
              <div className="partners-stat-card">
                <span>Filleuls inscrits</span>
                <strong>{stats.total}</strong>
              </div>
              <div className="partners-stat-card">
                <span>Avec un contrat signé</span>
                <strong>{stats.withContract}</strong>
              </div>
              <div className="partners-stat-card">
                <span>2èmes contrats payés</span>
                <strong>{stats.paid}</strong>
              </div>
              <div className="partners-stat-card partners-stat-card-amount">
                <span>Commissions versées</span>
                <strong>
                  {stats.commission.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: 2,
                  })}
                </strong>
              </div>
            </section>

            <section className="partners-dashboard-table-section">
              <header>
                <h2>Tes filleuls</h2>
                <span className="partners-table-count">
                  {stats.total} {stats.total > 1 ? 'inscrits' : 'inscrit'}
                </span>
              </header>

              {referrals.length === 0 ? (
                <div className="partners-empty">
                  <h3>Pas encore de filleul</h3>
                  <p>
                    Partage ton lien avec ta communauté : chaque inscription via ton code
                    apparaîtra ici en temps réel.
                  </p>
                </div>
              ) : (
                <div className="partners-table-wrap">
                  <table className="partners-table">
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
                          <td>{new Date(r.created_at).toLocaleDateString('fr-FR')}</td>
                          <td>{r.name || '—'}</td>
                          <td>{r.email}</td>
                          <td>{r.role || '—'}</td>
                          <td>
                            <StatusBadge status={r.status} />
                          </td>
                          <td>
                            {r.commission_amount != null
                              ? Number(r.commission_amount).toLocaleString('fr-FR', {
                                  style: 'currency',
                                  currency: 'EUR',
                                })
                              : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        ) : null}
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: Referral['status'] }) {
  const map: Record<Referral['status'], { label: string; className: string }> = {
    pending: { label: 'Inscrit', className: 'partners-badge partners-badge-pending' },
    active: { label: 'Actif', className: 'partners-badge partners-badge-active' },
    first_contract: { label: '1er contrat', className: 'partners-badge partners-badge-first' },
    second_contract: { label: '2ème contrat ✓', className: 'partners-badge partners-badge-paid' },
  };
  const item = map[status];
  return <span className={item.className}>{item.label}</span>;
}

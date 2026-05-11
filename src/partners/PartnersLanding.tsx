import { FormEvent, useState } from 'react';
import { supabase } from '../lib/supabase';
import { buildReferralCode } from './codeUtils';
import PartnersFAQ from './PartnersFAQ';
import logoImage from '../assets/logo.png';
import starIcon from '../assets/a_high_end_premium_3d_icon_of_a_minimalist_4_pointed_star._the_star_features-removebg-preview.png';

const NETWORKS = [
  'Instagram',
  'TikTok',
  'YouTube',
  'X (Twitter)',
  'LinkedIn',
  'Facebook',
  'Twitch',
  'Snapchat',
  'WhatsApp / Newsletter',
  'Autre',
];

const AUDIENCES = [
  'Moins de 1 000',
  '1 000 – 10 000',
  '10 000 – 50 000',
  '50 000 – 250 000',
  '250 000 – 1 M',
  'Plus de 1 M',
];

type Status = 'idle' | 'submitting' | 'success' | 'error';

type SuccessPayload = {
  email: string;
  referralCode: string;
  shareUrl: string;
};

const detailSteps = [
  {
    n: '01',
    title: 'Tu génères ton lien',
    text: 'En 60 secondes, depuis le formulaire ci-dessus. Code unique au format AS-PRENOM1234.',
  },
  {
    n: '02',
    title: 'Tu le partages avant le 21.06.2026',
    text: 'Sur tes réseaux, dans tes DMs, groupes WhatsApp, newsletters. Partout où tu as une audience.',
  },
  {
    n: '03',
    title: 'Chaque inscrit via ton lien devient ton filleul',
    text: "À condition qu'il s'inscrive avant le 21 juin 2026. Les inscriptions via d'autres canaux ne comptent pas.",
  },
  {
    n: '04',
    title: 'Son 1er contrat est offert',
    text: 'AdSync ne prend aucune commission sur le premier contrat de tes filleuls (offre de lancement).',
  },
  {
    n: '05',
    title: 'Tu touches 25 % sur son 2ème contrat',
    text: 'Une seule fois par filleul, versés automatiquement via Stripe, PayPal ou Mobile Money. AdSync te cède sa propre commission.',
  },
];

const projections = [
  { label: '10 filleuls', amount: '62,50 €' },
  { label: '100 filleuls', amount: '625 €' },
  { label: '500 filleuls', amount: '3 125 €' },
  { label: '1 000 filleuls', amount: '6 250 €' },
];

export default function PartnersLanding({ onLoginClick }: { onLoginClick: () => void }) {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState<SuccessPayload | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const fd = new FormData(event.currentTarget);
    const firstName = String(fd.get('first_name') ?? '').trim();
    const lastName = String(fd.get('last_name') ?? '').trim();
    const email = String(fd.get('email') ?? '').trim().toLowerCase();
    const password = String(fd.get('password') ?? '');
    const mainNetwork = String(fd.get('main_network') ?? '').trim() || null;
    const audienceSize = String(fd.get('audience_size') ?? '').trim() || null;
    const profileUrl = String(fd.get('profile_url') ?? '').trim() || null;

    if (!firstName || !lastName || !email || password.length < 6) {
      setStatus('error');
      setErrorMsg('Renseigne ton prénom, ton nom, ton email et un mot de passe de 6 caractères minimum.');
      return;
    }

    const { data: signUp, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setStatus('error');
      setErrorMsg(signUpError.message || 'Impossible de créer le compte.');
      return;
    }

    const userId = signUp.user?.id ?? null;
    const referralCode = buildReferralCode(firstName);

    const { error: insertError } = await supabase.from('partners').insert({
      user_id: userId,
      first_name: firstName,
      last_name: lastName,
      email,
      main_network: mainNetwork,
      audience_size: audienceSize,
      profile_url: profileUrl,
      referral_code: referralCode,
    });

    if (insertError) {
      setStatus('error');
      if (insertError.code === '23505') {
        setErrorMsg('Cet email est déjà inscrit comme partenaire. Connecte-toi.');
      } else {
        setErrorMsg(insertError.message || 'Une erreur est survenue. Réessaie.');
      }
      return;
    }

    const shareUrl = `${window.location.origin}/?ref=${referralCode}`;
    setSuccess({ email, referralCode, shareUrl });
    setStatus('success');
    (event.target as HTMLFormElement).reset();
  };

  const submitting = status === 'submitting';

  return (
    <div className="partners-shell">
      <header className="partners-topbar">
        <a href="/" className="brand" aria-label="Retour à l'accueil AdSync.io">
          <span className="brand-row">
            <img className="brand-star" src={starIcon} alt="" aria-hidden="true" />
            <img className="brand-logo" src={logoImage} alt="AdSync.io logo" />
          </span>
          <span className="brand-tagline">HUMAN ADTECH</span>
        </a>
        <div className="partners-topbar-actions">
          <a className="partners-back" href="/">
            ← Retour au site
          </a>
          <button type="button" className="partners-login-btn" onClick={onLoginClick}>
            Déjà partenaire ? Se connecter
          </button>
        </div>
      </header>

      <main className="partners-main">
        <section className="partners-hero">
          <span className="eyebrow">Programme Partenaires AdSync</span>
          <h1>
            Invite ta communauté
            <br />
            <em>avant le 21 juin 2026.</em>
            <br />
            <strong>Touche 25 % à la place d&apos;AdSync.</strong>
          </h1>
          <p className="partners-hero-lead">
            Reçois ton code parrain en 60 secondes. Chaque filleul inscrit via ton lien avant le
            21 juin 2026 te rapporte 25 % de la commission AdSync sur son 2ème contrat, une
            seule fois, versés via Stripe, PayPal ou Mobile Money. AdSync renonce à sa part : elle
            te revient intégralement.
          </p>
          <p className="partners-hero-note">
            Programme de pré-lancement · réservé aux inscriptions avant le 21.06.2026
          </p>

          <div className="partners-hero-stats">
            <div className="partners-stat">
              <strong>25 %</strong>
              <span>De la commission AdSync, à toi · 2ème contrat du filleul</span>
            </div>
            <div className="partners-stat">
              <strong>Illimité</strong>
              <span>Aucun plafond de filleuls</span>
            </div>
            <div className="partners-stat">
              <strong>21.06.26</strong>
              <span>Date limite d&apos;inscription des filleuls</span>
            </div>
          </div>
        </section>

        <section className="partners-form-section" id="inscription-partenaire">
          <div className="partners-form-card">
            <header>
              <h2>
                Génère ton code en 60 secondes.
              </h2>
              <p>Aucun engagement. Tu reçois ton code immédiatement.</p>
            </header>

            {success ? (
              <div className="partners-success">
                <span className="partners-success-tag">✦ Bienvenue dans le programme</span>
                <h3>Ton code parrain est prêt</h3>
                <div className="partners-code">{success.referralCode}</div>
                <p>Partage ce lien partout :</p>
                <div className="partners-share-link">
                  <code>{success.shareUrl}</code>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(success.shareUrl)}
                  >
                    Copier
                  </button>
                </div>
                <p className="partners-success-note">
                  Un email de confirmation vient d&apos;être envoyé à <strong>{success.email}</strong>.
                  Une fois ton compte confirmé, accède à ton dashboard pour suivre tes filleuls.
                </p>
                <div className="partners-success-actions">
                  <button type="button" className="btn btn-primary" onClick={onLoginClick}>
                    Accéder à mon dashboard
                  </button>
                </div>
              </div>
            ) : (
              <form className="partners-form" onSubmit={handleSubmit}>
                <div className="partners-form-grid">
                  <label className="smart-field">
                    <span>Prénom</span>
                    <input type="text" name="first_name" required placeholder="Aïcha" />
                  </label>
                  <label className="smart-field">
                    <span>Nom</span>
                    <input type="text" name="last_name" required placeholder="Diallo" />
                  </label>
                  <label className="smart-field smart-field-full">
                    <span>Email</span>
                    <input type="email" name="email" required placeholder="contact@email.com" />
                  </label>
                  <label className="smart-field smart-field-full">
                    <span>Mot de passe (min. 6 caractères) — pour ton dashboard</span>
                    <input type="password" name="password" required minLength={6} />
                  </label>
                  <label className="smart-field">
                    <span>Réseau principal</span>
                    <select name="main_network" defaultValue="">
                      <option value="" disabled>Sélectionne</option>
                      {NETWORKS.map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </label>
                  <label className="smart-field">
                    <span>Taille de communauté</span>
                    <select name="audience_size" defaultValue="">
                      <option value="" disabled>Sélectionne</option>
                      {AUDIENCES.map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </label>
                  <label className="smart-field smart-field-full">
                    <span>Lien de ton profil principal</span>
                    <input
                      type="url"
                      name="profile_url"
                      placeholder="https://instagram.com/ton_pseudo"
                    />
                  </label>
                </div>

                <button type="submit" className="btn btn-primary partners-submit" disabled={submitting}>
                  {submitting ? 'Création...' : 'Créer mon compte & générer mon code'}
                </button>
                <p className="partners-form-fineprint">
                  En t&apos;inscrivant, tu acceptes les conditions du programme partenaires
                  AdSync.io.{' '}
                  <button type="button" className="partners-inline-link" onClick={onLoginClick}>
                    Déjà partenaire ? Connecte-toi
                  </button>
                </p>

                {status === 'error' && (
                  <p className="smart-signup-feedback smart-signup-feedback-error">{errorMsg}</p>
                )}
              </form>
            )}
          </div>
        </section>

        <section className="partners-detail">
          <header>
            <span className="eyebrow">Comment ça marche · en détail</span>
            <h2>Le principe en 5 étapes</h2>
          </header>
          <div className="partners-detail-grid">
            {detailSteps.map(s => (
              <article key={s.n} className="partners-detail-card">
                <div className="partners-detail-num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="partners-example">
          <header>
            <h2>Exemple chiffré</h2>
            <p>Ton filleul signe son 2ème contrat à 100 € sur AdSync :</p>
          </header>
          <ul className="partners-example-list">
            <li>→ Le filleul reçoit <strong>75 €</strong> (sa part créateur de 75 %)</li>
            <li>→ La commission AdSync est de <strong>25 €</strong></li>
            <li>→ Tu reçois 25 % de cette commission, soit <strong>6,25 €</strong>, à la place d&apos;AdSync</li>
          </ul>

          <div className="partners-projection-grid">
            {projections.map(p => (
              <div key={p.label} className="partners-projection">
                <span className="partners-projection-label">{p.label}</span>
                <strong>{p.amount}</strong>
              </div>
            ))}
          </div>
          <p className="partners-example-fineprint">
            * Estimation basée sur un 2ème contrat moyen de 100 € par filleul. Rémunération
            versée une seule fois par filleul.
          </p>

          <div className="partners-rules">
            <div className="partners-rule">
              <span className="partners-rule-tag">⚠️ Règle critique</span>
              <p>
                Seules les personnes inscrites via ton lien et avant le 21 juin 2026 sont
                comptabilisées comme tes filleuls. Après cette date, le programme de
                pré-lancement se ferme. Tes filleuls déjà inscrits restent rattachés à toi
                pour leur 2ème contrat.
              </p>
            </div>
            <div className="partners-rule">
              <span className="partners-rule-tag">💸 Une seule fois par filleul</span>
              <p>
                Tu touches 25 % uniquement sur le 2ème contrat de chaque filleul. Les contrats
                suivants ne génèrent plus de commission partenaire, mais tu peux parrainer un
                nombre illimité de personnes.
              </p>
            </div>
          </div>
        </section>

        <PartnersFAQ />
      </main>
    </div>
  );
}

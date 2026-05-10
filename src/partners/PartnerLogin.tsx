import { FormEvent, useState } from 'react';
import { supabase } from '../lib/supabase';
import logoImage from '../assets/logo.png';
import starIcon from '../assets/a_high_end_premium_3d_icon_of_a_minimalist_4_pointed_star._the_star_features-removebg-preview.png';

export default function PartnerLogin({ onBackToLanding }: { onBackToLanding: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMsg(error.message || 'Identifiants invalides.');
      setSubmitting(false);
    }
  };

  return (
    <div className="partners-shell partners-shell-login">
      <header className="partners-topbar">
        <a href="/" className="brand" aria-label="Retour à l'accueil AdSync.io">
          <span className="brand-row">
            <img className="brand-star" src={starIcon} alt="" aria-hidden="true" />
            <img className="brand-logo" src={logoImage} alt="AdSync.io logo" />
          </span>
          <span className="brand-tagline">HUMAN ADTECH</span>
        </a>
        <div className="partners-topbar-actions">
          <button type="button" className="partners-back" onClick={onBackToLanding}>
            ← Retour au programme
          </button>
        </div>
      </header>

      <main className="partners-login-main">
        <div className="partners-login-card">
          <span className="eyebrow">Espace partenaire</span>
          <h1>Connexion</h1>
          <p>Suis tes filleuls et tes commissions en temps réel.</p>

          <form className="partners-login-form" onSubmit={handleSubmit}>
            <label className="smart-field">
              <span>Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="contact@email.com"
              />
            </label>
            <label className="smart-field">
              <span>Mot de passe</span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </label>
            {errorMsg && <p className="smart-signup-feedback smart-signup-feedback-error">{errorMsg}</p>}
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="partners-login-switch">
            Pas encore de code parrain ?{' '}
            <button type="button" onClick={onBackToLanding}>
              Rejoindre le programme
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

import { FormEvent, useState } from 'react';
import { supabase } from '../lib/supabase';

type Mode = 'signin' | 'signup';

export default function AdminLogin() {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [infoMsg, setInfoMsg] = useState<string>('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setInfoMsg('');

    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrorMsg(error.message || 'Identifiants invalides.');
        setSubmitting(false);
      }
      return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setErrorMsg(error.message || 'Impossible de créer le compte.');
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
    if (!data.session) {
      setInfoMsg('Compte créé. Vérifie ton email pour confirmer, puis reviens te connecter.');
      setMode('signin');
    }
  };

  return (
    <div className="admin-login-shell">
      <a href="/" className="admin-back admin-back-floating" aria-label="Retour au site">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Retour au site</span>
      </a>
      <div className="admin-login-card">
        <div className="admin-login-head">
          <span className="admin-login-kicker">AdSync admin</span>
          <h1>{mode === 'signin' ? 'Connexion' : 'Créer un compte'}</h1>
          <p>
            {mode === 'signin'
              ? 'Accès réservé. Connecte-toi avec ton compte.'
              : 'Crée ton compte. L’admin principal devra activer tes permissions.'}
          </p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@adsync.io"
            />
          </label>
          <label>
            <span>Mot de passe</span>
            <input
              type="password"
              required
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              minLength={8}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </label>
          {errorMsg && <p className="admin-login-error">{errorMsg}</p>}
          {infoMsg && <p className="admin-login-info">{infoMsg}</p>}
          <button type="submit" disabled={submitting}>
            {submitting
              ? mode === 'signin'
                ? 'Connexion...'
                : 'Création...'
              : mode === 'signin'
                ? 'Se connecter'
                : 'Créer mon compte'}
          </button>
        </form>

        <div className="admin-login-switch">
          {mode === 'signin' ? (
            <>
              Pas encore de compte ?{' '}
              <button type="button" onClick={() => { setMode('signup'); setErrorMsg(''); setInfoMsg(''); }}>
                Créer un compte
              </button>
            </>
          ) : (
            <>
              Déjà un compte ?{' '}
              <button type="button" onClick={() => { setMode('signin'); setErrorMsg(''); setInfoMsg(''); }}>
                Se connecter
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

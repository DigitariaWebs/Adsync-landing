import { FormEvent, useState } from 'react';
import { supabase } from '../lib/supabase';

type RoleTab = 'createur' | 'marque';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function SmartSignupSection() {
  const [role, setRole] = useState<RoleTab>('marque');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim().toLowerCase();
    const platform = String(formData.get('platform') ?? '').trim() || null;
    const category = String(formData.get('category') ?? '').trim() || null;

    if (!name || !email) {
      setStatus('error');
      setErrorMsg('Nom et email sont requis.');
      return;
    }

    const { error } = await supabase.from('waitlist').insert({
      role,
      name,
      email,
      platform,
      category,
    });

    if (error) {
      setStatus('error');
      if (error.code === '23505') {
        setErrorMsg('Cet email est déjà inscrit sur la liste d\'attente.');
      } else {
        setErrorMsg(error.message || 'Une erreur est survenue. Réessaie.');
      }
      return;
    }

    setStatus('success');
    (event.target as HTMLFormElement).reset();
  };

  const submitting = status === 'submitting';

  return (
    <section className="smart-signup-section" id="inscription">
      <div className="smart-signup-shell">
        <header className="smart-signup-head">
          <span className="smart-signup-kicker">Acces beta limite</span>
          <h2>
            Choisis ton role.
            <br />
            <strong>L&apos;IA fait le reste.</strong>
          </h2>
        </header>

        <div className="smart-signup-panel">
          <div className="smart-signup-tabs" role="tablist" aria-label="Choix du role">
            <button
              type="button"
              role="tab"
              aria-selected={role === 'createur'}
              className={`smart-signup-tab ${role === 'createur' ? 'is-active' : ''}`}
              onClick={() => setRole('createur')}
            >
              Je suis createur
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={role === 'marque'}
              className={`smart-signup-tab ${role === 'marque' ? 'is-active' : ''}`}
              onClick={() => setRole('marque')}
            >
              Je suis une marque
            </button>
          </div>

          <form className="smart-signup-form" onSubmit={handleSubmit}>
            <div className="smart-signup-grid">
              <label className="smart-field">
                <span>{role === 'marque' ? 'Nom de la marque' : 'Nom du createur'}</span>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder={role === 'marque' ? 'Ex: Nova Labs' : 'Ex: Aicha Studio'}
                />
              </label>
              <label className="smart-field">
                <span>Email professionnel</span>
                <input type="email" name="email" required placeholder="contact@email.com" />
              </label>
              <label className="smart-field">
                <span>{role === 'marque' ? 'Site web de la marque' : 'Plateforme principale'}</span>
                <input
                  type="text"
                  name="platform"
                  placeholder={role === 'marque' ? 'https://marque.com' : 'Instagram, TikTok, YouTube...'}
                />
              </label>
              <label className="smart-field">
                <span>{role === 'marque' ? 'Secteur d activite' : 'Niche de contenu'}</span>
                <input
                  type="text"
                  name="category"
                  required
                  placeholder={role === 'marque' ? 'Mode, Tech, Finance...' : 'Lifestyle, Business, Gaming...'}
                />
              </label>
            </div>

            <div className="smart-signup-note">
              L&apos;IA analysera ton profil pour te connecter aux bonnes opportunites des
              l&apos;ouverture de la beta.
            </div>

            <div className="smart-signup-actions">
              <p>Paiements securises via Stripe. Zero spam.</p>
              <button type="submit" disabled={submitting}>
                {submitting
                  ? 'Envoi...'
                  : role === 'marque'
                    ? 'Lancer ma marque'
                    : 'Rejoindre comme createur'}
              </button>
            </div>

            {status === 'success' && (
              <p className="smart-signup-feedback">
                Inscription confirmée. On te recontacte avant le lancement du 21 juin 2026.
              </p>
            )}
            {status === 'error' && (
              <p className="smart-signup-feedback smart-signup-feedback-error">{errorMsg}</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

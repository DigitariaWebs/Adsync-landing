import { FormEvent, useState } from 'react';

type RoleTab = 'createur' | 'marque';

export default function SmartSignupSection() {
  const [role, setRole] = useState<RoleTab>('marque');
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

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
                <input type="text" required placeholder={role === 'marque' ? 'Ex: Nova Labs' : 'Ex: Aicha Studio'} />
              </label>
              <label className="smart-field">
                <span>Email professionnel</span>
                <input type="email" required placeholder="contact@email.com" />
              </label>
              <label className="smart-field">
                <span>{role === 'marque' ? 'Site web de la marque' : 'Plateforme principale'}</span>
                <input type="text" placeholder={role === 'marque' ? 'https://marque.com' : 'Instagram, TikTok, YouTube...'} />
              </label>
              <label className="smart-field">
                <span>{role === 'marque' ? 'Secteur d activite' : 'Niche de contenu'}</span>
                <input type="text" required placeholder={role === 'marque' ? 'Mode, Tech, Finance...' : 'Lifestyle, Business, Gaming...'} />
              </label>
            </div>

            <div className="smart-signup-note">
              L&apos;IA analysera ton profil pour te connecter aux bonnes opportunites des
              l&apos;ouverture de la beta.
            </div>

            <div className="smart-signup-actions">
              <p>Paiements securises via Stripe. Zero spam.</p>
              <button type="submit">{role === 'marque' ? 'Lancer ma marque' : 'Rejoindre comme createur'}</button>
            </div>

            {sent && (
              <p className="smart-signup-feedback">
                Demande envoyee. Merci, on te recontacte rapidement.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

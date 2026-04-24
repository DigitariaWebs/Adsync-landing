import { FormEvent, useState } from 'react';
import emailjs from '@emailjs/browser';
import logoImage from '../assets/logo.png';

const footerLinks = {
  Produit: [
    { label: 'Fonctionnalites', href: '#fonctionnalites' },
    { label: 'PrecisionPay', href: '#' },
    { label: 'Co-Create', href: '#' },
    { label: 'Agents IA', href: '#' },
    { label: 'Tarifs', href: '#' },
  ],
  Ressources: [
    { label: 'Blog', href: '#' },
    { label: 'Guide createurs', href: '#' },
    { label: 'API docs', href: '#' },
    { label: 'Statut', href: '#' },
    { label: 'Changelog', href: '#' },
  ],
  Entreprise: [
    { label: 'A propos', href: '#' },
    { label: 'Carrieres', href: '#' },
    { label: 'Presse', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  Legal: [
    { label: 'CGU', href: '#' },
    { label: 'Confidentialite', href: '#' },
    { label: 'Cookies', href: '#' },
  ],
};

const footerStats = [
  { value: '12k+', label: 'Createurs actifs' },
  { value: '850+', label: 'Marques partenaires' },
  { value: 'EUR 4.2M', label: 'Verses aux createurs' },
  { value: '98%', label: 'Paiements garantis' },
];

const betaStats = [
  { value: '500+', label: 'Deja inscrits' },
  { value: '30', label: 'Marques en attente' },
  { value: '38', label: 'Pays representes' },
];

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="6" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 4l16 16M20 4L4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 12a4 4 0 104 4V4a5 5 0 005 5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 20a7 7 0 0 1 14 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RoleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 5h12M6 12h12M6 19h8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setFormMessage({
        type: 'error',
        text: 'Configuration email manquante. Ajoute les cles EmailJS dans les variables Vite.',
      });
      return;
    }

    setIsSubmitting(true);
    setFormMessage(null);

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          prenom: String(formData.get('prenom') ?? ''),
          nom: String(formData.get('nom') ?? ''),
          email: String(formData.get('email') ?? ''),
          from_name: `${String(formData.get('prenom') ?? '')} ${String(formData.get('nom') ?? '')}`.trim(),
          reply_to: String(formData.get('email') ?? ''),
          pays: String(formData.get('pays') ?? ''),
          ville: String(formData.get('ville') ?? ''),
          role: String(formData.get('role') ?? ''),
          to_email: 'yedidiambengalikita13@gmail.com',
        },
        { publicKey },
      );

      setFormMessage({
        type: 'success',
        text: 'Inscription envoyee avec succes. Nous te contacterons tres vite.',
      });
      form.reset();
    } catch (error) {
      console.error('EmailJS error:', error);

      const status = typeof error === 'object' && error !== null && 'status' in error ? String(error.status) : '';
      const details = typeof error === 'object' && error !== null && 'text' in error ? String(error.text) : '';

      setFormMessage({
        type: 'error',
        text: details
          ? `Envoi impossible (${status || 'erreur'}): ${details}`
          : "L'envoi a echoue. Verifie la configuration EmailJS ou reessaie dans un instant.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="site-footer">
      <section className="beta-signup-section" id="inscription-beta">
        <div className="beta-signup-shell">
          <div className="beta-signup-copy">
            <span className="beta-kicker">Acces beta limite</span>
            <h2 className="beta-heading">
              INSCRIS-TOI
              <br />
              AVANT LE 21 JUIN
            </h2>
            <p className="beta-lead">
              La beta d&apos;AdSync.io ouvre le 21 juin 2026. Complete le formulaire:
              plus on en sait sur toi, mieux on pourra te connecter aux bonnes marques
              ou aux bons createurs des le premier jour.
            </p>

            <div className="beta-stat-row">
              {betaStats.map(stat => (
                <article key={stat.label} className="beta-stat-card">
                  <span className="beta-stat-value">{stat.value}</span>
                  <span className="beta-stat-text">{stat.label}</span>
                </article>
              ))}
            </div>
          </div>

          <form className="beta-form-panel" onSubmit={handleSubmit}>
            <div className="beta-form-glow beta-form-glow-left" aria-hidden="true" />
            <div className="beta-form-glow beta-form-glow-right" aria-hidden="true" />

           
            <div className="beta-form-section">
              <div className="beta-form-title">
                <PersonIcon />
                <span>Informations personnelles</span>
              </div>

              <div className="beta-form-grid beta-form-grid-two">
                <label className="beta-field">
                  <span>Prenom *</span>
                  <input type="text" name="prenom" placeholder="Ex : Yedidia" required />
                </label>

                <label className="beta-field">
                  <span>Nom *</span>
                  <input type="text" name="nom" placeholder="Ex : Lisaka" required />
                </label>

                <label className="beta-field beta-field-full">
                  <span>Adresse email *</span>
                  <input type="email" name="email" placeholder="ton@email.com" required />
                </label>

                <label className="beta-field">
                  <span>Pays *</span>
                  <select name="pays" defaultValue="canada" required>
                    <option value="france">France</option>
                    <option value="rdc">Republique Democratique du Congo</option>
                    <option value="belgique">Belgique</option>
                    <option value="canada">Canada</option>
                    <option value="senegal">Senegal</option>
                    <option value="cote-divoire">Cote d&apos;Ivoire</option>
                    <option value="cameroun">Cameroun</option>
                    <option value="nigeria">Nigeria</option>
                  </select>
                </label>

                <label className="beta-field">
                  <span>Ville (optionnel)</span>
                  <input type="text" name="ville" placeholder="Ex : Paris, Lagos, Kinshasa..." />
                </label>
              </div>
            </div>

            <div className="beta-form-section">
              <div className="beta-form-title">
                <RoleIcon />
                <span>Tu es plutot...</span>
              </div>

              <div className="beta-form-grid">
                <label className="beta-field beta-field-full">
                  <span>Ton role principal sur AdSync *</span>
                  <select name="role" defaultValue="" required>
                    <option value="" disabled>
                      Selectionne ton role
                    </option>
                    <option value="createur">Createur / Influenceur</option>
                    <option value="marque">Marque / Annonceur</option>
                    <option value="agence">Agence</option>
                    <option value="media">Media / Communaute</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="beta-form-actions">
              <button type="submit" className="beta-submit-button" disabled={isSubmitting}>
                <span>{isSubmitting ? 'Envoi en cours...' : 'Valider mon inscription'}</span>
                <small>Acces beta le 21 Juin 2026</small>
              </button>

              {formMessage && (
                <p
                  className={
                    formMessage.type === 'success'
                      ? 'beta-form-feedback beta-form-feedback-success'
                      : 'beta-form-feedback beta-form-feedback-error'
                  }
                >
                  {formMessage.text}
                </p>
              )}

              <div className="beta-trust-row">
                <span>Donnees 100% privees</span>
                <span>Zero spam</span>
              </div>

              <p className="beta-form-contact">
                Questions ?{' '}
                <a href="mailto:yedidiambengalikita13@gmail.com">
                  yedidiambengalikita13@gmail.com
                </a>
              </p>
            </div>
          </form>
        </div>
      </section>

      <div className="footer-cta-band">
        <div className="footer-cta-inner">
          <div className="footer-cta-copy">
            <span className="footer-cta-eyebrow">Start Your AdSync Journey</span>
            <h2 className="footer-cta-heading">
              Pret a monetiser
              <br />
              <strong>ton audience ?</strong>
            </h2>
          </div>
          <div className="footer-cta-actions">
            <a href="#inscription-beta" className="footer-cta-btn-primary">
              Creer mon compte gratuit
              <span aria-hidden="true">-&gt;</span>
            </a>
            <a href="#comment-ca-marche" className="footer-cta-btn-ghost">
              Voir une demo
            </a>
          </div>
        </div>
      </div>

      <div className="footer-stats-band">
        {footerStats.map(stat => (
          <div key={stat.label} className="footer-stat">
            <span className="footer-stat-val">{stat.value}</span>
            <span className="footer-stat-label">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="footer-body">
        <div className="footer-brand-col">
          <a href="#home" className="footer-logo">
            ADSYNC.
          </a>
          <p className="footer-tagline">
            La plateforme qui connecte createurs et marques avec des paiements garantis,
            des agents IA et des campagnes qui convertissent vraiment.
          </p>

          

          <div className="footer-socials">
            <a href="#" className="footer-social-btn" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="#" className="footer-social-btn" aria-label="X / Twitter">
              <XIcon />
            </a>
            <a href="#" className="footer-social-btn" aria-label="TikTok">
              <TikTokIcon />
            </a>
          </div>
        </div>

        {Object.entries(footerLinks).map(([column, links]) => (
          <div key={column} className="footer-link-col">
            <h4 className="footer-col-heading">{column}</h4>
            <ul className="footer-link-list">
              {links.map(link => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer-bottom-bar">
        <p className="footer-copy">Copyright {year} AdSync.io - Tous droits reserves.</p>
        <div className="footer-bottom-links">
          <a href="#">CGU</a>
          <span aria-hidden="true">.</span>
          <a href="#">Confidentialite</a>
          <span aria-hidden="true">.</span>
          <a href="#">Cookies</a>
        </div>
      </div>
    </footer>
  );
}

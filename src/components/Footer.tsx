import { FormEvent, useState } from 'react';
import emailjs from '@emailjs/browser';
import starIcon from '../assets/a_high_end_premium_3d_icon_of_a_minimalist_4_pointed_star._the_star_features-removebg-preview.png';

const footerLinks = {
  Produit: [
    { label: 'Fonctionnalites', href: '#comment-ca-marche' },
    { label: 'PrecisionPay', href: '#monde' },
    { label: 'Co-Create', href: '#pour-qui' },
    { label: 'Agents IA', href: '#comment-ca-marche' },
    { label: 'Tarifs', href: '#inscription' },
  ],
  Ressources: [
    { label: 'Blog', href: '#home' },
    { label: 'Guide createurs', href: '#pour-qui' },
    { label: 'API docs', href: '#comment-ca-marche' },
    { label: 'Statut', href: '#monde' },
    { label: 'Changelog', href: '#faq' },
  ],
  Entreprise: [
    { label: 'A propos', href: '#home' },
    { label: 'Carrieres', href: '#inscription' },
    { label: 'Presse', href: '#monde' },
    { label: 'Contact', href: '#inscription-beta' },
  ],
  Legal: [
    { label: 'CGU', href: '#faq' },
    { label: 'Confidentialite', href: '#faq' },
    { label: 'Cookies', href: '#faq' },
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
  

    

      

      <div className="footer-body">
        <div className="footer-brand-col">
          <a href="#home" className="footer-logo">
            <img src={starIcon} alt="" aria-hidden="true" className="footer-logo-star" />
            ADSYNC.
          </a>
          <p className="footer-tagline">
            La plateforme qui connecte createurs et marques avec des paiements garantis,
            des agents IA et des campagnes qui convertissent vraiment.
          </p>

          <div className="footer-socials">
            <a href="#home" className="footer-social-btn" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="#home" className="footer-social-btn" aria-label="X / Twitter">
              <XIcon />
            </a>
            <a href="#home" className="footer-social-btn" aria-label="TikTok">
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
          <a href="#faq">CGU</a>
          <span aria-hidden="true">.</span>
          <a href="#faq">Confidentialite</a>
          <span aria-hidden="true">.</span>
          <a href="#faq">Cookies</a>
        </div>
      </div>
    </footer>
  );
}

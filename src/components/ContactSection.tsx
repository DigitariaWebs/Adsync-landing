import { FormEvent, useState } from 'react';
import { supabase } from '../lib/supabase';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactSection() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim().toLowerCase();
    const subject = String(formData.get('subject') ?? '').trim() || null;
    const message = String(formData.get('message') ?? '').trim();

    if (!name || !email || !message) {
      setStatus('error');
      setErrorMsg('Nom, email et message sont requis.');
      return;
    }

    const { error } = await supabase.from('messages').insert({
      name,
      email,
      subject,
      message,
    });

    if (error) {
      setStatus('error');
      setErrorMsg(error.message || 'Une erreur est survenue. Réessaie.');
      return;
    }

    setStatus('success');
    (event.target as HTMLFormElement).reset();
  };

  const submitting = status === 'submitting';

  return (
    <section className="contact-section" id="contact">
      <div className="contact-shell">
        <header className="contact-head">
          <span className="contact-kicker">Une question ?</span>
          <h2>
            Parle-nous <strong>directement.</strong>
          </h2>
          <p>
            Une demande, un partenariat, un retour ? Envoie-nous un message, l&apos;équipe AdSync.io te
            répond personnellement par email sous 48h.
          </p>
        </header>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-grid">
            <label className="contact-field">
              <span>Ton nom</span>
              <input type="text" name="name" required placeholder="Ex : Jean Dupont" />
            </label>
            <label className="contact-field">
              <span>Email</span>
              <input type="email" name="email" required placeholder="contact@email.com" />
            </label>
            <label className="contact-field contact-field-full">
              <span>Sujet</span>
              <input type="text" name="subject" placeholder="Partenariat, support, presse..." />
            </label>
            <label className="contact-field contact-field-full">
              <span>Ton message</span>
              <textarea
                name="message"
                required
                rows={6}
                placeholder="Dis-nous tout, on lit chaque message."
              />
            </label>
          </div>

          <div className="contact-actions">
            <p>Tes données restent confidentielles. On ne partage rien.</p>
            <button type="submit" disabled={submitting}>
              {submitting ? 'Envoi...' : 'Envoyer le message'}
            </button>
          </div>

          {status === 'success' && (
            <p className="contact-feedback">
              Message reçu. On te répond très vite par email.
            </p>
          )}
          {status === 'error' && (
            <p className="contact-feedback contact-feedback-error">{errorMsg}</p>
          )}
        </form>

        <div className="contact-socials">
          <span className="contact-socials-label">Suis-nous aussi sur&nbsp;:</span>
          <div className="contact-socials-row">
            <a
              href="https://www.instagram.com/adsync.io_?igsh=c3owbXB0OXhzZmt4&utm_source=qr"
              className="contact-social-btn"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="6" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
              </svg>
              <span>Instagram</span>
            </a>
            <a
              href="https://www.tiktok.com/@adsync.io?_r=1&_t=ZN-9684QypXnP8"
              className="contact-social-btn"
              aria-label="TikTok"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M9 12a4 4 0 104 4V4a5 5 0 005 5"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>TikTok</span>
            </a>
            <a
              href="https://www.facebook.com/share/1DqtsogvrJ/?mibextid=wwXIfr"
              className="contact-social-btn"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M14 8h2V5h-2c-1.7 0-3 1.3-3 3v2H9v3h2v8h3v-8h2.4l.6-3H14V8.5c0-.3.2-.5.5-.5z"
                  fill="currentColor"
                />
              </svg>
              <span>Facebook</span>
            </a>
            <a
              href="https://x.com/Adsync14769"
              className="contact-social-btn"
              aria-label="X / Twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 4l16 16M20 4L4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>X</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

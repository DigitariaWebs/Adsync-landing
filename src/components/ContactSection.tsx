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
            Une demande, un partenariat, un retour ? Envoie-nous un message, l&apos;équipe AdSync te
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
      </div>
    </section>
  );
}

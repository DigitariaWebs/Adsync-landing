import { useState } from 'react';

type FaqItem = { question: string; answer: string };

const faqs: FaqItem[] = [
  {
    question: "Qu'est-ce que AdSync et comment ca marche ?",
    answer:
      "AdSync connecte tes espaces digitaux a des campagnes publicitaires compatibles avec ton audience. Tu actives tes surfaces, l'IA trouve les marques adaptees, le contrat est securise et la remuneration est automatisee.",
  },
  {
    question: 'Qui peut rejoindre AdSync ?',
    answer:
      'Les createurs, influenceurs, medias, community managers et proprietaires de pages ou sites avec une audience engagee peuvent rejoindre la plateforme.',
  },
  {
    question: 'Comment je suis paye pour une collaboration ?',
    answer:
      'La marque depose le budget dans un systeme securise avant validation. Une fois la campagne active et geree par AdSync, 75% de la remuneration te sont reverses automatiquement.',
  },
  {
    question: 'Quels sont les avantages concrets ?',
    answer:
      'Tu gagnes du temps, tu evites les negociations longues, tu recois des offres plus qualifiees et tu monetises tes espaces avec un cadre plus professionnel.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section className="section faq-section" id="inscription">
      <div className="faq-panel">
        <div className="faq-copy">
          <span className="eyebrow ">Reponses aux questions frequentes</span>
          <h2>
            Questions
            <br />
            frequentes
          </h2>
          <a className="faq-contact-button" href="mailto:hello@adsync.io">
            Contactez-nous
            <span className="faq-contact-arrow" aria-hidden="true">
              →
            </span>
          </a>
        </div>

        <div className="faq-list">
          {faqs.map((item, idx) => (
            <article
              key={item.question}
              className={`faq-item${openIndex === idx ? ' faq-item-open' : ''}`}
              onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
              style={{ cursor: 'pointer' }}
            >
              <div className="faq-question-row">
                <h3>{item.question}</h3>
                <span className="faq-plus" aria-hidden="true">
                  {openIndex === idx ? '−' : '+'}
                </span>
              </div>
              {openIndex === idx && <p>{item.answer}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

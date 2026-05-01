import { useState } from 'react';

type FaqItem = { question: string; answer: string };

const faqs: FaqItem[] = [
  {
    question: "Quand AdSync ouvre vraiment ?",
    answer:
      "AdSync ouvre le 21 juin 2026 à 9h UTC. Les inscrits de la vague de lancement reçoivent un accès prioritaire 72h avant l’ouverture publique, ainsi que 0 % de commission sur leurs 3 premiers contrats.",
  },
  {
    question: "Combien je gagne en tant que créateur ?",
    answer:
      "Tu touches 75 % du montant de chaque contrat signé. AdSync prend 25 % pour couvrir l’infrastructure, le matching IA, la sécurisation Stripe et la protection juridique des contrats.",
  },
  {
    question: "Quels formats de publicité je peux uploader en tant que marque ?",
    answer:
      "Tu peux uploader des vidéos (MP4/MOV), des affiches statiques (JPG/PNG), des carrousels multi-images, des GIF animés, ou des liens vers des publicités existantes (TikTok, YouTube, Meta, site web). L’IA Advisor recommande le format le plus performant selon la cible.",
  },
  {
    question: "Comment je suis payé ? Quels moyens sont supportés ?",
    answer:
      "Les paiements sont supportés via Stripe (carte, SEPA, ACH), Apple Pay, Google Pay, PayPal, virement bancaire, et Mobile Money (Orange Money, MTN MoMo, Wave, M-Pesa). La crypto USDT/USDC est disponible sur demande pour les gros montants.",
  },
  {
    question: "Comment AdSync garantit qu’il n’y a pas de bots ?",
    answer:
      "Un Quality Score ≥ 94/100 est obligatoire. L’IA analyse le comportement, l’historique, la géolocalisation et les patterns d’engagement. Les faux abonnés et trafics synthétiques sont filtrés avant activation des campagnes.",
  },
  {
    question: "Mon argent est-il sécurisé ?",
    answer:
      "Oui. Le budget de la marque est bloqué via Stripe Connect avant le lancement. Le créateur est payé uniquement après diffusion vérifiée. En cas de non-respect des performances (PrecisionPay), le surplus est automatiquement remboursé.",
  },
  
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section className="section faq-section" id="faq">
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

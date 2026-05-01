import { useState } from 'react';

type CardType = 'creator' | 'brand';

const creatorCards = [
  {
    number: '01',
    title: 'Tu crées ton compte',
    description: 'Une seule fois. Tu connectes tes réseaux et tu choisis les surfaces que tu veux monétiser.',
    image: 'ai-core.png',
  },
  {
    number: '02',
    title: "L'IA cherche les marques pour toi",
    description: 'Pendant que tu dors, notre moteur analyse ton audience et te matche avec les bonnes campagnes.',
    image: 'dashboard.png',
  },
  {
    number: '03',
    title: 'Tu reçois un contrat sécurisé',
    description: 'Rémunération bloquée d\'avance. Tu signes en un clic, ou tu refuses sans pression.',
    image: 'contrat.png',
  },
  {
    number: '04',
    title: 'La pub se publie. Tu encaisses.',
    description: 'Diffusion automatisée, paiement via Stripe, virement, PayPal ou Mobile Money selon ton pays.',
    image: 'payout.png',
  },
];

const brandCards = [
  {
    number: '01',
    title: "Tu uploades ta pub. L'IA l'oriente.",
    description: 'Vidéo, affiche, carrousel. L\'IA Advisor analyse ton contenu et suggère le format, l\'audience et le budget optimal.',
    image: 'upload.png',
  },
  {
    number: '02',
    title: "L'IA filtre les vraies audiences",
    description: 'Quality Score 94/100 minimum. Les bots et faux abonnés sont écartés avant diffusion.',
    image: 'ai-core.png',
  },
  {
    number: '03',
    title: 'Le budget est sécurisé',
    description: 'Versement bloqué via Stripe. Les créateurs reçoivent leur contrat. La campagne se lance.',
    image: 'contrat.png',
  },
  {
    number: '04',
    title: 'Tu paies la performance réelle',
    description: 'PrecisionPay : vues, clics, achats. Le surplus est remboursé automatiquement.',
    image: 'payout.png',
  },
];

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState<CardType>('creator');

  const cards = activeTab === 'creator' ? creatorCards : brandCards;

  return (
    <section className="section" id="comment-ca-marche">
      <div className="how-it-works-panel">
        <div className="how-it-works-glow" />

        <div className="how-it-works-intro">
          <span className="eyebrow">Comment ca marche</span>
          <h2>Le processus est simple et sécurisé pour tous</h2>
        </div>

        {/* Toggle Switch */}
        <div style={{ textAlign: 'center' }}>
        <div className="toggle-wrapper">
          <button
            className={`toggle-btn ${activeTab === 'creator' ? 'active' : 'inactive'}`}
            onClick={() => setActiveTab('creator')}
          >
            Créateur
          </button>
          <button
            className={`toggle-btn ${activeTab === 'brand' ? 'active' : 'inactive'}`}
            onClick={() => setActiveTab('brand')}
          >
            Marque
          </button>
        </div>
        </div>

        {/* Steps Grid */}
        <div className="steps-grid">
          {cards.map(card => (
            <article className="step-card" key={card.number}>
              <div className="step-image">
                <img src={`/src/assets/${card.image}`} alt={card.title} />
                <div className="step-number">{card.number}</div>
              </div>
              <div className="step-body">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

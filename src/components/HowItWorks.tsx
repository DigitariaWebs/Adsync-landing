import { useState } from 'react';
import aiCoreImage from '../assets/ai-core.png';
import dashboardImage from '../assets/dashboard.png';
import contratImage from '../assets/contrat.png';
import payoutImage from '../assets/payout.png';
import uploadImage from '../assets/upload.png';

type CardType = 'creator' | 'brand';

const creatorCards = [
  {
    number: '01',
    title: 'Tu crees ton compte',
    description: 'Une seule fois. Tu connectes tes reseaux et tu choisis les surfaces a monetiser.',
    image: aiCoreImage,
  },
  {
    number: '02',
    title: "L'IA cherche les marques pour toi",
    description: 'Pendant que tu dors, notre moteur analyse ton audience et te connecte aux campagnes utiles.',
    image: dashboardImage,
  },
  {
    number: '03',
    title: 'Tu recois un contrat securise',
    description: "Remuneration bloquee d'avance. Tu signes en un clic, ou tu refuses sans pression.",
    image: contratImage,
  },
  {
    number: '04',
    title: 'La pub se publie. Tu encaisses.',
    description: 'Diffusion automatisee et paiement via Stripe, virement, PayPal ou Mobile Money.',
    image: payoutImage,
  },
];

const brandCards = [
  {
    number: '01',
    title: "Tu uploades ta pub. L'IA l'oriente.",
    description: 'Video, affiche, carrousel: IA Advisor recommande format, audience et budget.',
    image: uploadImage,
  },
  {
    number: '02',
    title: "L'IA filtre les vraies audiences",
    description: 'Quality Score minimum et exclusion des bots avant diffusion.',
    image: aiCoreImage,
  },
  {
    number: '03',
    title: 'Le budget est securise',
    description: 'Versement bloque via Stripe puis campagne activee avec suivi clair.',
    image: contratImage,
  },
  {
    number: '04',
    title: 'Tu paies la performance reelle',
    description: 'PrecisionPay sur vues, clics et achats. Surplus rembourse automatiquement.',
    image: payoutImage,
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
          <h2>Le processus est simple et securise pour tous</h2>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div className="toggle-wrapper">
            <button
              className={`toggle-btn ${activeTab === 'creator' ? 'active' : 'inactive'}`}
              onClick={() => setActiveTab('creator')}
            >
              Createur
            </button>
            <button
              className={`toggle-btn ${activeTab === 'brand' ? 'active' : 'inactive'}`}
              onClick={() => setActiveTab('brand')}
            >
              Marque
            </button>
          </div>
        </div>

        <div className="steps-grid">
          {cards.map(card => (
            <article className="step-card" key={card.number}>
              <div className="step-image">
                <img src={card.image} alt={card.title} />
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

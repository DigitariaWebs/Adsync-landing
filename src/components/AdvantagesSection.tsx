import shieldImage from '../assets/shield.png';
import payoutImage from '../assets/payout.png';
import stripeImage from '../assets/stripe.png';

type StatCard = {
  number: string;
  title: string;
  description: string;
};

type HighlightCard = {
  title: string;
  description: string;
  image: string;
};

type StripeFeature = {
  icon: 'secure' | 'instant' | 'global';
  title: string;
  description: string;
};

const statCards: StatCard[] = [
  {
    number: '0EUR',
    title: 'Aucun abonnement, jamais',
    description:
      'Tu rejoins gratuitement. Une commission de 25% uniquement sur les contrats conclus.',
  },
  {
    number: '75%',
    title: 'Du contrat reverse au createur',
    description: 'Sur chaque contrat signe, 75% reviennent au createur automatiquement.',
  },
  {
    number: '0',
    title: 'Tolerance pour les faux abonnes',
    description: 'Notre IA bloque les comptes gonfles avant chaque campagne.',
  },
  {
    number: '100%',
    title: 'Paiement a la performance reelle',
    description: "Tu paies uniquement ce qui s'est vraiment passe.",
  },
];

const highlightCards: HighlightCard[] = [
  {
    title: 'Anti bots, par defaut.',
    description: 'Audience Quality Engine analyse chaque campagne en temps reel.',
    image: shieldImage,
  },
  {
    title: 'Paiement securise par Stripe.',
    description: "Encaissement direct via Stripe avec versement automatique en fin de contrat.",
    image: payoutImage,
  },
];

const stripeFeatures: StripeFeature[] = [
  {
    icon: 'secure',
    title: 'SECURISE',
    description: '3D Secure, conformite PCI niveau 1.',
  },
  {
    icon: 'instant',
    title: 'INSTANTANE',
    description: 'Versement sous 24h en moyenne.',
  },
  {
    icon: 'global',
    title: 'MONDIAL',
    description: '135 devises, 47 pays supportes.',
  },
];

const stripePills = ['VISA', 'MASTERCARD', 'AMEX', 'SEPA', 'APPLE PAY', 'GOOGLE PAY'];

function StripeFeatureIcon({ type }: { type: StripeFeature['icon'] }) {
  if (type === 'secure') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="6.5" y="10" width="11" height="9" rx="2.2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 10V8.2A3 3 0 0 1 12 5a3 3 0 0 1 3 3.2V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'instant') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="m13.7 3.8-6 8h4l-1.3 8.4 6.8-9h-4.1l.6-7.4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4.7 12h14.6M12 4.5c2.1 2 3.3 4.6 3.3 7.5s-1.2 5.5-3.3 7.5c-2.1-2-3.3-4.6-3.3-7.5S9.9 6.5 12 4.5Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function AdvantagesSection() {
  return (
    <section className="section" id="nos-avantages">
      <div className="advantages-panel">
        <header className="advantages-header">
          <p className="advantages-label">NOS AVANTAGES</p>
          <h2 className="advantages-title">
            <span className="advantages-title-main">Ce qu&apos;aucune autre plateforme </span>
            <span className="advantages-title-accent">ne fait.</span>
          </h2>
          <p className="advantages-subtitle">
            Une infrastructure IA pour proteger les budgets des marques et maximiser la remuneration des createurs.
          </p>
        </header>

        <div className="advantages-stats-grid">
          {statCards.map(card => (
            <article className="stat-card" key={card.title}>
              <div className="stat-number">{card.number}</div>
              <h3 className="stat-title">{card.title}</h3>
              <p className="stat-desc">{card.description}</p>
            </article>
          ))}
        </div>

        <div className="advantages-highlight-grid">
          {highlightCards.map(card => (
            <article className="adv-image-card" key={card.title}>
              <div className="adv-image-wrap">
                <img src={card.image} alt={card.title} />
                <div className="adv-image-overlay" />
                <div className="adv-image-content">
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="stripe-section">
          <div className="stripe-image">
            <img src={stripeImage} alt="Paiement Stripe securise" />
          </div>

          <div className="stripe-content">
            <p className="stripe-label">PAIEMENTS</p>
            <h2 className="stripe-title">
              Encaisse via <span>Stripe.</span>
            </h2>
            <p className="stripe-desc">
              Chaque contrat passe par un sequestre Stripe: depots, verification et versement automatique.
            </p>

            <div className="stripe-features">
              {stripeFeatures.map(f => (
                <div className="stripe-feature" key={f.title}>
                  <div className="stripe-feature-icon">
                    <StripeFeatureIcon type={f.icon} />
                  </div>
                  <p className="stripe-feature-title">{f.title}</p>
                  <p className="stripe-feature-desc">{f.description}</p>
                </div>
              ))}
            </div>

            <div className="stripe-pills">
              {stripePills.map(pill => (
                <span className="stripe-pill" key={pill}>{pill}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

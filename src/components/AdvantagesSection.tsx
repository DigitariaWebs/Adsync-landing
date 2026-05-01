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
  icon: string;
  title: string;
  description: string;
};

const statCards: StatCard[] = [
  {
    number: '0€',
    title: 'Aucun abonnement, jamais',
    description:
      'Tu rejoins gratuitement. Une commission de 25% uniquement sur les contrats conclus. Pas de contrat, pas de frais.',
  },
  {
    number: '75%',
    title: 'Du contrat reversé au créateur',
    description:
      'Sur chaque contrat signé, 75% reviennent au créateur, partout dans le monde, automatiquement.',
  },
  {
    number: '0',
    title: 'Tolérance pour les faux abonnés',
    description:
      'Notre IA bloque les comptes gonflés avant chaque campagne. Les marques paient pour de vraies personnes.',
  },
  {
    number: '100%',
    title: 'Paiement à la performance réelle',
    description:
      "1 vraie vue à 0,001€. 1 vrai clic à 0,10€. 1 vrai achat à 10€. Tu paies ce qui s'est vraiment passé.",
  },
];

const highlightCards: HighlightCard[] = [
  {
    title: 'Anti bots, par défaut.',
    description:
      'Audience Quality Engine analyse chaque campagne en temps réel. Bots filtrés, paiement protégé.',
    image: 'shield.png',
  },
  {
    title: 'Paiement sécurisé par Stripe.',
    description:
      "Encaissement direct via Stripe : carte bancaire, virement SEPA, Apple Pay, Google Pay. Versement automatique dès qu'un contrat se termine.",
    image: 'payout.png',
  },
];

const stripeFeatures: StripeFeature[] = [
  {
    icon: '🔒',
    title: 'SÉCURISÉ',
    description: '3D Secure, conformité PCI niveau 1.',
  },
  {
    icon: '⚡',
    title: 'INSTANTANÉ',
    description: 'Versement sous 24h en moyenne.',
  },
  {
    icon: '🌍',
    title: 'MONDIAL',
    description: '135 devises, 47 pays supportés.',
  },
];

const stripePills = ['VISA', 'MASTERCARD', 'AMEX', 'SEPA', 'APPLE PAY', 'GOOGLE PAY'];

export default function AdvantagesSection() {
  return (
    <section className="section" id="nos-avantages">
      <div className="advantages-panel">

        {/* Header */}
        <header className="advantages-header">
          <p className="advantages-label">NOS AVANTAGES</p>
          <h2 className="advantages-title">
            <span className="advantages-title-main">Ce qu'aucune autre plateforme </span>
            <span className="advantages-title-accent">ne fait.</span>
          </h2>
          <p className="advantages-subtitle">
            Une infrastructure IA pensée pour protéger le budget des marques et maximiser la rémunération des créateurs.
          </p>
        </header>

        {/* 4 stat cards */}
        <div className="advantages-stats-grid">
          {statCards.map(card => (
            <article className="stat-card" key={card.title}>
              <div className="stat-number">{card.number}</div>
              <h3 className="stat-title">{card.title}</h3>
              <p className="stat-desc">{card.description}</p>
            </article>
          ))}
        </div>

        {/* 2 image cards */}
        <div className="advantages-highlight-grid">
          {highlightCards.map(card => (
            <article className="adv-image-card" key={card.title}>
              <div className="adv-image-wrap">
                <img src={`/src/assets/${card.image}`} alt={card.title} />
                <div className="adv-image-overlay" />
                <div className="adv-image-content">
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Stripe section */}
        <div className="stripe-section">

          {/* LEFT — image */}
          <div className="stripe-image">
            <img src="/src/assets/stripe.png" alt="Paiement Stripe sécurisé" />
          </div>

          {/* RIGHT — contenu */}
          <div className="stripe-content">
            <p className="stripe-label">PAIEMENTS</p>
            <h2 className="stripe-title">
              Encaissé via <span>Stripe.</span>
            </h2>
            <p className="stripe-desc">
              Chaque contrat passe par un séquestre Stripe. La marque dépose les fonds,
              AdSync vérifie la performance, tu reçois ta part dès la fin de la campagne,
              sur ton IBAN ou ta carte.
            </p>

            {/* 3 features */}
            <div className="stripe-features">
              {stripeFeatures.map(f => (
                <div className="stripe-feature" key={f.title}>
                  <div className="stripe-feature-icon">{f.icon}</div>
                  <p className="stripe-feature-title">{f.title}</p>
                  <p className="stripe-feature-desc">{f.description}</p>
                </div>
              ))}
            </div>

            {/* Pills */}
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
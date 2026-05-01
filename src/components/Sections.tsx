import pourquiPhoto1 from '../assets/photo-pourqui1.png';
import pourquiPhoto2 from '../assets/photo-pourqui2.png';

type AudienceCard = {
  title: string;
  badge: string;
  image: string;
  items: string[];
};

const audienceCards: AudienceCard[] = [
  {
    title: 'Tu crées. Tu encaisses.',
    badge: 'CRÉATEUR',
    image: pourquiPhoto1,
    items: [
      'Tu as une audience, même petite',
      'Tu publies des stories, reels ou lives',
      'Tu veux monetiser sans poster en plus',
      "Tu recois l'argent automatiquement",
    ],
  },
  {
    title: 'Tu paies ce qui marche.',
    badge: 'MARQUE',
    image: pourquiPhoto2,
    items: [
      'Tu veux toucher de vraies personnes',
      'Tu en as assez des bots et faux clics',
      'Tu paies seulement les vrais resultats',
      'Tu lances une campagne en 60 secondes',
    ],
  },
];

export function AudienceSection() {
  return (
    <section className="section section-solution" id="pour-qui">
      <div className="audience-header">
        <span className="eyebrow">POUR QUI</span>
        <h2>
        Une plateforme.
        <br />
            <strong> Deux mondes.</strong>
          </h2>
        <p >
          Que tu sois createur ou marque, AdSync t'ouvre une nouvelle economie : celle des espaces
          numeriques qui se louent comme des appartements.
        </p>
      </div>

      <div className="audience-cards-grid">
        {audienceCards.map((card) => (
          <article className="audience-card-full" key={card.badge}>
            <div className="audience-card-image">
              <img src={card.image} alt={card.title} />
            </div>
            <div className="audience-card-overlay"></div>
            <span className="audience-card-badge">{card.badge}</span>
            <div className="audience-card-body">
              <h3>{card.title}</h3>
              <ul className="audience-checks">
                {card.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

type Feature = {
  title: string;
  description: string;
  meta: string;
  icon: 'automation' | 'security' | 'matching';
};

const features: Feature[] = [
  {
    title: 'Agents IA operationnels',
    description:
      'Negociation, planning, relances, suivi de publication et reporting sont geres automatiquement.',
    meta: 'Automatisation',
    icon: 'automation',
  },
  {
    title: 'Paiements garantis',
    description:
      'Chaque campagne est encadree par contrat pour te donner une visibilite claire sur ta remuneration.',
    meta: 'Securite',
    icon: 'security',
  },
  {
    title: 'Marques vraiment compatibles',
    description:
      "Tu restes aligne avec ton image en ne recevant que des activations coherentes avec ton audience.",
    meta: 'Matching',
    icon: 'matching',
  },
];

function FeatureMetaIcon({ type }: { type: Feature['icon'] }) {
  if (type === 'automation') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3v3M12 18v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M3 12h3M18 12h3M4.9 19.1 7 17M17 7l2.1-2.1"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (type === 'security') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="m9 12 2 2 4-4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 12a5 5 0 0 1 5-5c1.7 0 3.1.8 4 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M17 12a5 5 0 0 1-5 5c-1.7 0-3.1-.8-4-2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="m14.8 7.6 1.9 1.4 1.8-1.7M9.2 16.4 7.3 15 5.5 16.7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FeaturesSection() {
  return (
    <section className="section" id="fonctionnalites">
      <div className="section-intro">
        <span className="eyebrow">Fonctionnalites</span>
        <h2>Tout ce qu'il faut pour transformer une audience sociale en actif media.</h2>
      </div>
      <div className="feature-grid">
        {features.map((feature, index) => (
          <article className={`feature-card feature-card-${index + 1}`} key={feature.title}>
            <div className="feature-card-top">
              <span className="feature-meta-icon" aria-hidden="true">
                <FeatureMetaIcon type={feature.icon} />
              </span>
              <span className="feature-meta-label">{feature.meta}</span>
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

const comparisons = [
  {
    label: 'Paiements',
    ours: 'Garantis par contrat',
    theirs: 'Souvent variables',
    leftHint: 'Securises',
    rightHint: 'Variables',
    progress: 0.24,
  },
  {
    label: 'Gestion campagne',
    ours: 'IA + automatisation',
    theirs: '100% manuelle',
    leftHint: 'Auto',
    rightHint: 'Manuel',
    progress: 0.46,
  },
  {
    label: 'Formats',
    ours: 'Reels, Stories, Statuts, Lives',
    theirs: 'Formats limites',
    leftHint: 'Multi-format',
    rightHint: 'Limite',
    progress: 0.7,
  },
  {
    label: 'Part createur',
    ours: '75% de la remuneration',
    theirs: 'Commission opaque',
    leftHint: '75%',
    rightHint: 'Opaque',
    progress: 0.36,
  },
];

export function ComparisonSection() {
  return (
    <section className="section" id="comparaison">
      <div className="comparison-card">
        <div className="section-intro comparison-intro">
          <span className="eyebrow">Comparaison</span>
          <h2>Plus de controle, plus de confiance, plus de revenu pour le createur.</h2>
        </div>

        <div className="comparison-shell">
          <div className="comparison-shell-head">
            <span>Critere</span>
            <span>AdSync.io</span>
            <span>Approche classique</span>
          </div>

          <div className="comparison-stack" aria-label="Comparaison AdSync.io">
            {comparisons.map(item => (
              <article className="comparison-metric" key={item.label}>
                <div className="comparison-metric-top">
                  <h3>{item.label}</h3>
                  <div className="comparison-metric-values">
                    <span className="comparison-value comparison-value-ours">{item.ours}</span>
                    <span className="comparison-value comparison-value-theirs">{item.theirs}</span>
                  </div>
                </div>

                <div className="comparison-rail" aria-hidden="true">
                  <span
                    className="comparison-rail-fill"
                    style={{ width: `${item.progress * 100}%` }}
                  />
                  <span
                    className="comparison-rail-dot comparison-rail-dot-ours"
                    style={{ left: `${item.progress * 100}%` }}
                  />
                  <span className="comparison-rail-dot comparison-rail-dot-theirs" />
                </div>

                <div className="comparison-scale">
                  <span>{item.leftHint}</span>
                  <span>{item.rightHint}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="comparison-cta-wrap">
            <a className="comparison-cta" href="#inscription">
              Voir pourquoi AdSync fait mieux
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

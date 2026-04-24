type Step = {
  icon: 'connect' | 'choose' | 'post' | 'claim';
  title: string;
  description: string;
  meta: string;
};

const steps: Step[] = [
  {
    icon: 'connect',
    title: 'Tu actives tes espaces',
    description:
      'Connecte tes plateformes en 1 clic. Tes contenus deviennent des espaces publicitaires actifs.',
    meta: '~5 min · Une seule fois',
  },
  {
    icon: 'choose',
    title: "L’IA trouve des marques",
    description:
      "L’IA analyse ton profil et te propose automatiquement des campagnes adaptées.",
    meta: 'Automatique · 0 effort',
  },
  {
    icon: 'post',
    title: 'Tu signes le contrat',
    description:
      "Le paiement est sécurisé en escrow avant réception. Tu acceptes ou refuses librement.",
    meta: 'Contrat · Accepter / Refuser',
  },
  {
    icon: 'claim',
    title: 'Tu es remunere',
    description:
      'AdSync gère tout et verse automatiquement 75% sur ton compte.',
    meta: '75% automatiques',
  },
];

function StepIcon({ type }: { type: Step['icon'] }) {
  if (type === 'connect') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M10 7.5 8.5 6A4 4 0 0 0 2.8 11.7l1.5 1.5A4 4 0 0 0 10 13"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="m14 16.5 1.5 1.5a4 4 0 0 0 5.7-5.7l-1.5-1.5A4 4 0 0 0 14 11"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="m8.5 15.5 7-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === 'choose') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect
          x="4"
          y="4"
          width="14"
          height="14"
          rx="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M8 11.5 10.5 14 15 9.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 20h11"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === 'post') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect
          x="4"
          y="4"
          width="16"
          height="16"
          rx="5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M12 8v8M8 12h8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M8 6h8a3 3 0 0 1 3 3v9l-3-2.2L13 18H8a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m9.2 11 1.8 1.8 4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HowItWorks() {
  return (
    <section className="section" id="comment-ca-marche">
      <div className="how-it-works-panel">
        <div className="how-it-works-glow" />

        <div className="how-it-works-intro">
          <span className="eyebrow ">Comment ca marche</span>
          <h2>Tu fais 3 actions. AdSync fait le reste automatiquement 24h/24.</h2>
        </div>

        <div className="steps-grid">
          {steps.map(step => (
            <article className="step-card" key={step.title}>
              <div className="step-icon-wrap">
                <StepIcon type={step.icon} />
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              <span className="step-meta">{step.meta}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

type PillarKey = 'shield' | 'zero' | 'check' | 'lock' | 'bolt' | 'globe' | 'wallet' | 'sparkle' | 'pen';

type Pillar = {
  label: string;
  icon: PillarKey;
};

const pillars: Pillar[] = [
  { label: 'Paiement garanti par contrat', icon: 'shield' },
  { label: '0 % commission au lancement', icon: 'zero' },
  { label: '75 % reversé au créateur', icon: 'wallet' },
  { label: 'Stripe sécurisé · 3D Secure', icon: 'lock' },
  { label: 'IA anti-bots intégrée', icon: 'bolt' },
  { label: 'Mobile Money supporté', icon: 'globe' },
  { label: 'Versement sous 24h', icon: 'check' },
  { label: 'Contrats officiels signés', icon: 'pen' },
  { label: '47 pays · 135 devises', icon: 'sparkle' },
];

const marqueeLoop = [...pillars, ...pillars];

function PillarIcon({ icon }: { icon: PillarKey }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  switch (icon) {
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case 'zero':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M5.5 5.5l13 13" />
        </svg>
      );
    case 'wallet':
      return (
        <svg {...common}>
          <rect x="3" y="6" width="18" height="13" rx="2.5" />
          <path d="M3 10h18M16 14.5h2" />
        </svg>
      );
    case 'lock':
      return (
        <svg {...common}>
          <rect x="4" y="10" width="16" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      );
    case 'bolt':
      return (
        <svg {...common}>
          <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
        </svg>
      );
    case 'globe':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
      );
    case 'check':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12 3 3 5-6" />
        </svg>
      );
    case 'sparkle':
      return (
        <svg {...common}>
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.5 5.5l3 3M15.5 15.5l3 3M5.5 18.5l3-3M15.5 8.5l3-3" />
        </svg>
      );
    case 'pen':
      return (
        <svg {...common}>
          <path d="M15 4l5 5L9 20H4v-5z" />
          <path d="M13 6l5 5" />
        </svg>
      );
  }
}

export default function FormatsMarquee() {
  return (
    <section className="formats-marquee-section" aria-label="Garanties AdSync">
      <div className="formats-marquee-shell">
        <div className="formats-marquee-track">
          {marqueeLoop.map((item, index) => (
            <div className="formats-marquee-item" key={`${item.label}-${index}`}>
              <span className="formats-marquee-icon">
                <PillarIcon icon={item.icon} />
              </span>
              <span>{item.label}</span>
              <i className="formats-marquee-dot" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

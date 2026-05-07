type PlatformKey =
  | 'instagram-stories'
  | 'reels'
  | 'youtube'
  | 'whatsapp'
  | 'facebook'
  | 'tiktok'
  | 'website';

type Platform = {
  label: string;
  icon: PlatformKey;
};

const platforms: Platform[] = [
  { label: 'Stories Instagram', icon: 'instagram-stories' },
  { label: 'Reels', icon: 'reels' },
  { label: 'Lives YouTube', icon: 'youtube' },
  { label: 'Statuts WhatsApp', icon: 'whatsapp' },
  { label: 'Posts Facebook', icon: 'facebook' },
  { label: 'TikTok', icon: 'tiktok' },
  { label: 'Sites web', icon: 'website' },
];

const marqueeLoop = [...platforms, ...platforms];

function PlatformIcon({ icon }: { icon: PlatformKey }) {
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
    case 'instagram-stories':
      return (
        <svg {...common}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5.5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'reels':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="3" />
          <path d="M3 9h18M8 4l3 5M14 4l3 5" />
          <path d="M10.5 12.5v4l3.5-2z" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'youtube':
      return (
        <svg {...common}>
          <rect x="2.5" y="6" width="19" height="12" rx="3" />
          <path d="M10.5 9.5v5l4.5-2.5z" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg {...common}>
          <path d="M3.5 20.5l1.4-4.5a8 8 0 1 1 3.1 3.1z" />
          <path d="M9 10.5c.5 2 2 3.5 4 4l1.5-1.2 2.5 1-.6 2.4c-3.4.6-7.4-3-8-6.4l2-.7z" />
        </svg>
      );
    case 'facebook':
      return (
        <svg {...common}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" />
          <path d="M14 8.5h2V6h-2c-1.7 0-2.8 1.1-2.8 2.8V11H9.5v2.5h1.7v6h2.5v-6H16l.4-2.5h-2.7V9c0-.3.1-.5.3-.5z" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg {...common}>
          <path d="M14 3v11.5a3 3 0 1 1-3-3" />
          <path d="M14 3c.4 2 1.7 3.5 4 4" />
        </svg>
      );
    case 'website':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 9h18M7 6.5h0.01M10 6.5h0.01" />
        </svg>
      );
  }
}

export default function FormatsMarquee() {
  return (
    <section className="formats-marquee-section" aria-label="Plateformes supportées par AdSync.io">
      <div className="formats-marquee-shell">
        <div className="formats-marquee-track">
          {marqueeLoop.map((item, index) => (
            <div className="formats-marquee-item" key={`${item.label}-${index}`}>
              <span className="formats-marquee-icon">
                <PlatformIcon icon={item.icon} />
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

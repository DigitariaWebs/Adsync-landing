import { useEffect, useState } from 'react';
import liveGlobeImage from '../assets/live-globe.png';
import starIcon from '../assets/a_high_end_premium_3d_icon_of_a_minimalist_4_pointed_star._the_star_features-removebg-preview.png';

type ActivityEntry = {
  id: number;
  name: string;
  city: string;
  role: 'Createur' | 'Marque';
};

const worldDots = [
  { top: '22%', left: '20%', ping: false },
  { top: '34%', left: '31%', ping: true },
  { top: '48%', left: '27%', ping: false },
  { top: '30%', left: '50%', ping: true },
  { top: '43%', left: '58%', ping: false },
  { top: '55%', left: '52%', ping: true },
  { top: '29%', left: '72%', ping: false },
  { top: '44%', left: '76%', ping: true },
  { top: '62%', left: '68%', ping: false },
  { top: '68%', left: '39%', ping: true },
];

const cityDotMap: Record<string, { top: string; left: string }> = {
  Pekin: { top: '33%', left: '74%' },
  Londres: { top: '30%', left: '47%' },
  Mexico: { top: '46%', left: '23%' },
  Mumbai: { top: '43%', left: '66%' },
  'New York': { top: '38%', left: '31%' },
};

const activityPool: Omit<ActivityEntry, 'id'>[] = [
  { name: 'Diego', city: 'Pekin', role: 'Marque' },
  { name: 'Sarah', city: 'Londres', role: 'Marque' },
  { name: 'Fatou', city: 'Mexico', role: 'Createur' },
  { name: 'Priya', city: 'Mumbai', role: 'Createur' },
  { name: 'Aicha', city: 'New York', role: 'Marque' },
];

function LiveBadge({ role }: { role: ActivityEntry['role'] }) {
  return (
    <span className={`live-signups-role live-signups-role-${role.toLowerCase()}`}>
      {role === 'Createur' ? 'Createur' : 'Marque'}
    </span>
  );
}

export default function LiveWorldSection() {
  const [count, setCount] = useState(12867);
  const [activity, setActivity] = useState<ActivityEntry[]>(() =>
    activityPool.slice(0, 4).map((item, index) => ({ ...item, id: index + 1 })),
  );

  useEffect(() => {
    const counterInterval = window.setInterval(() => {
      setCount(current => current + Math.floor(Math.random() * 5) + 1);
    }, 2400);

    const activityInterval = window.setInterval(() => {
      const next = activityPool[Math.floor(Math.random() * activityPool.length)];

      setActivity(current => [
        { ...next, id: Date.now() + Math.floor(Math.random() * 1000) },
        ...current,
      ].slice(0, 4));
    }, 1800);

    return () => {
      window.clearInterval(counterInterval);
      window.clearInterval(activityInterval);
    };
  }, []);

  return (
    <section className="live-signups-section" id="monde">
       <div className="solution-intro">
          <img src={starIcon} alt="" aria-hidden="true" className="section-star" />
          <span className="eyebrow">En direct, partout dans le monde</span>
         <h2>
           Pendant que tu lis ceci,<br />
           <em>le monde s&rsquo;inscrit.</em>
         </h2>
          <p>
           Créateurs et marques rejoignent AdSync depuis plus de 80 pays. Chaque point lumineux est une nouvelle inscription en temps réel.
          </p>
        </div>
      <div className="live-signups-shell">
        <div className="live-signups-grid">
          <article className="live-signups-map-card">
            <div className="live-signups-map-widget">
              <span>Inscrits en direct</span>
              <strong>{count.toLocaleString('fr-FR')}</strong>
            </div>

            <div className="live-signups-map-visual" aria-hidden="true">
              <img src={liveGlobeImage} alt="" className="live-signups-map-image" />

              {worldDots.map((dot, index) => (
                <span
                  key={`${dot.top}-${dot.left}-${index}`}
                  className={`live-signups-map-dot ${dot.ping ? 'is-ping' : ''}`}
                  style={{ top: dot.top, left: dot.left }}
                />
              ))}
              {activity.map(item => {
                const cityDot = cityDotMap[item.city];
                if (!cityDot) return null;

                return (
                  <span
                    key={`city-dot-${item.id}`}
                    className="live-signups-map-dot is-ping live-signups-map-dot-user"
                    style={{ top: cityDot.top, left: cityDot.left }}
                  />
                );
              })}

              <div className="live-signups-map-overlay" />
            </div>
          </article>

          <aside className="live-signups-feed-card">
            <header className="live-signups-feed-head">
              <h3>Activite recente</h3>
              <span className="live-signups-live-badge">LIVE</span>
            </header>

            <div className="live-signups-list" aria-live="polite">
              {activity.map(item => (
                <article className="live-signups-item" key={item.id}>
                  <div className="live-signups-avatar">{item.name.charAt(0)}</div>
                  <div className="live-signups-item-copy">
                    <p>
                      <strong>{item.name}</strong> vient de rejoindre depuis <strong>{item.city}</strong>
                    </p>
                    <LiveBadge role={item.role} />
                  </div>
                </article>
              ))}
            </div>

            <div className="live-signups-stats">
              <article className="live-signups-stat">
                <span>Pays</span>
                <strong>82</strong>
              </article>
              <article className="live-signups-stat">
                <span>Marques</span>
                <strong>2314</strong>
              </article>
              <article className="live-signups-stat">
                <span>Createurs</span>
                <strong>10533</strong>
              </article>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

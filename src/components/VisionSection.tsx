import starIcon from '../assets/a_high_end_premium_3d_icon_of_a_minimalist_4_pointed_star._the_star_features-removebg-preview.png';
import { BrandBadge } from './BrandedText';

const visionPillars = [
  'Permettre à chaque créateur de vivre de son influence',
  'Réinventer la publicité autour de la recommandation humaine',
  'Construire le standard de demain',
];

const visionStats = [
  { value: '1,14 T$', label: 'Marché pub global' },
  { value: '5×', label: 'ROI vs pub classique' },
  { value: '75 %', label: 'Réservé au créateur' },
  { value: '200 M+', label: 'Créateurs adressables' },
];

const visionFooter = [
  { label: 'Fondateur & CEO', value: 'Yedidia Mbengalikita Lisaka' },
  { label: 'Contact', value: 'contact@adsynchro.com', href: 'mailto:contact@adsynchro.com' },
  { label: 'Lancement bêta', value: '21 juin 2026' },
];

export default function VisionSection() {
  return (
    <section className="section vision-section" id="vision">
      <div className="vision-panel">
        <div className="vision-intro">
          <img src={starIcon} alt="" aria-hidden="true" className="section-star" />
          <span className="eyebrow">La vision</span>
          <h2>
            Créer le plus grand réseau mondial
            <br />
            <em>d&apos;immobilier numérique.</em>
          </h2>
        </div>

        <ul className="vision-pillars">
          {visionPillars.map(item => (
            <li key={item}>
              <span className="vision-pillar-bullet" aria-hidden="true">→</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="vision-stats">
          {visionStats.map(stat => (
            <article className="vision-stat" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </article>
          ))}
        </div>

        <p className="vision-positioning">
          Comme Stripe est l&apos;infrastructure du paiement,&nbsp;
          <span className="brand-name">AdSync.io</span><BrandBadge /> est l&apos;infrastructure de
          la recommandation humaine.
        </p>

        <div className="vision-footer">
          {visionFooter.map(item => (
            <article className="vision-footer-card" key={item.label}>
              <span className="vision-footer-label">{item.label}</span>
              {item.href ? (
                <a href={item.href} className="vision-footer-value">
                  {item.value}
                </a>
              ) : (
                <span className="vision-footer-value">{item.value}</span>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

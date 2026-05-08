import starIcon from '../assets/a_high_end_premium_3d_icon_of_a_minimalist_4_pointed_star._the_star_features-removebg-preview.png';

const visionPillars = [
  'Permettre à chaque créateur de vivre de son influence',
  'Réinventer la publicité autour de la recommandation humaine',
  'Construire le standard de demain',
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
      </div>
    </section>
  );
}

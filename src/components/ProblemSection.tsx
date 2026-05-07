import starIcon from '../assets/a_high_end_premium_3d_icon_of_a_minimalist_4_pointed_star._the_star_features-removebg-preview.png';

type Pain = {
  number: string;
  title: string;
  description: string;
};

const pains: Pain[] = [
  {
    number: '01',
    title: 'Les pubs sont devenues invisibles',
    description: 'Les utilisateurs scrollent, ferment, bloquent. Le message ne passe plus.',
  },
  {
    number: '02',
    title: 'Les marques brûlent leur budget',
    description: 'Des milliards dépensés chaque année pour des clics fantômes et des bots.',
  },
  {
    number: '03',
    title: 'Les créateurs ne sont pas payés',
    description: '200 millions de créateurs dans le monde gagnent à peine de quoi vivre.',
  },
  {
    number: '04',
    title: 'La vraie recommandation est ignorée',
    description:
      "Ce qui marche vraiment, c'est le bouche à oreille. Personne ne l'a industrialisé.",
  },
];

export default function ProblemSection() {
  return (
    <section className="section section-problem" id="probleme">
      <div className="problem-panel">
        <header className="problem-intro">
          <img src={starIcon} alt="" aria-hidden="true" className="section-star" />
          <span className="eyebrow">Le problème</span>
          <h2>
            Le système
            <br />
            <em>est cassé.</em>
          </h2>
          <p>
            Tout le monde perd. Les marques payent sans résultats, les créateurs travaillent sans
            rémunération, les utilisateurs ignorent les pubs.
          </p>
        </header>

        <div className="problem-grid">
          {pains.map(pain => (
            <article className="problem-card" key={pain.number}>
              <span className="problem-card-number">{pain.number}</span>
              <h3>{pain.title}</h3>
              <p>{pain.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

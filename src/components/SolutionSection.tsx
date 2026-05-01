import solutionPhoto1 from '../assets/photo-solution1.png';
import solutionPhoto2 from '../assets/photo-solution2.png';

export default function SolutionSection() {
  return (
    <section className="section section-solution" id="solution">
      <div className="solution-panel">
        <div className="solution-intro">
          <span className="eyebrow">La solution</span>
          <h2>
            Le pont manquant
          </h2>
          <p>
            AdSync connecte createurs et marques via des contrats publicitaires directs. Pense a Airbnb: un
            appartement vide devient une chambre d'hotes qui genere des revenus.
          </p>
        </div>
         

        <div className="solution-grid">
          <article className="solution-card">
            <img src={solutionPhoto1} alt="Un pont direct - connexion directe entre createurs et marques" />
            <div className="solution-card-overlay"></div>
            <div className="solution-card-content">
              <h3>Un pont direct.</h3>
              <p>
                Plus d'intermediaires. Toi et directement avec les marques qui veulent vraiment collaborer avec toi.
              </p>
            </div>
          </article>

          <article className="solution-card">
            <img src={solutionPhoto2} alt="Tes espaces valorisés - tes plateformes deviennent des espaces monetisables" />
            <div className="solution-card-overlay"></div>
            <div className="solution-card-content">
              <h3>Tes espaces, valorisés.</h3>
              <p>
                Feeds, Reels, Stories, Lives - chaque espace devient une source de revenus stable et cadree.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

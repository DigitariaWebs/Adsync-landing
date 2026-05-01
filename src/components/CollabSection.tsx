import photo1 from '../assets/photo1.png';
import photo2 from '../assets/photo2.png';
import photo3 from '../assets/photo3.png';
import heroImage from '../assets/hero.png';

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.4" cy="6.7" r="1.1" fill="currentColor" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 12s0-3-1-4.3c-.5-.7-1.2-1.1-2-1.2C15.9 6.2 12 6.2 12 6.2h0s-3.9 0-6 .3c-.8.1-1.5.5-2 1.2C3 9 3 12 3 12s0 3 1 4.3c.5.7 1.2 1.1 2 1.2 2.1.3 6 .3 6 .3s3.9 0 6-.3c.8-.1 1.5-.5 2-1.2 1-1.3 1-4.3 1-4.3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="m10 9.4 4.5 2.6-4.5 2.6V9.4Z" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10 10.8V17a3.4 3.4 0 1 1-3.4-3.4c.5 0 1 .1 1.4.3"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.2 4.5c.4 2 1.8 3.8 4.3 4.4v2.6a7.3 7.3 0 0 1-4.3-1.4V4.5Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CollabSection() {
  return (
    <section className="section section-dark-feature" id="collaboration">
      <div className="collab-panel">
        <div className="collab-gallery">
          <span className="collab-float collab-float-instagram" aria-hidden="true">
            <InstagramIcon />
          </span>
          <span className="collab-float collab-float-youtube" aria-hidden="true">
            <YouTubeIcon />
          </span>
          <span className="collab-float collab-float-tiktok" aria-hidden="true">
            <TikTokIcon />
          </span>

          <div className="collab-grid">
            <article className="collab-card collab-card-large">
              <img src={photo1} alt="Createur utilisant ses reseaux sociaux comme espace media" />
            </article>
            <article className="collab-card collab-card-small">
              <img src={photo2} alt="Createur lifestyle avec audience engagee" />
            </article>
            <article className="collab-card collab-card-small">
              <img src={photo3} alt="Formats courts monetisables sur les reseaux sociaux" />
            </article>
            <article className="collab-card collab-card-large">
              <img src={heroImage} alt="Immobilier numerique pour createurs et marques" />
            </article>
          </div>
        </div>

        <div className="collab-copy">
           <span className="eyebrow">Le concept fondateur de l'immobilier numerique</span>
          <h2>
            Comme Airbnb,
            <br />
            mais pour tes
            <br />
            <strong>plateformes.</strong>
          </h2>
          <p>
            Un appartement vide devient une chambre d'hotes qui genere des revenus.
            De la meme maniere, tes contenus deviennent des espaces monetisables ou
            les marques peuvent diffuser leurs publicites.
          </p>
          <ul className="collab-checks">
            <li>Tes contenus Feed, Reels, Stories et Lives deviennent des espaces publicitaires.</li>
            <li>Les marques y diffusent leurs annonces de maniere simple et cadre.</li>
            <li>Tu es remunere sur chaque diffusion, jusqu'a 75% de la valeur generee.</li>
          </ul>
          <a className="collab-button" href="#inscription">
            Commencer maintenant
          </a>
        </div>
      </div>
    </section>
  );
}

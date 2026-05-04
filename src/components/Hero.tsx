import heroImage from '../assets/hero.png';
import starIcon from '../assets/a_high_end_premium_3d_icon_of_a_minimalist_4_pointed_star._the_star_features-removebg-preview.png';

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.4" cy="6.7" r="1.1" fill="currentColor" />
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

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M13.2 20v-6.1h2.5l.4-2.9h-2.9V9.2c0-.9.3-1.5 1.6-1.5H16V5.1c-.4-.1-1.2-.1-2-.1-2 0-3.4 1.2-3.4 3.5v2.5H8.4v2.9h2.2V20"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="hero-stage" id="home">
      <div className="hero-panel-shell">
        <section className="hero hero-photo">
          <div className="hero-copy">
          

            <h1>
              Tes plateformes
              <br />
              ton immobilier
              <br />
              <em className="hero-title-gold">numérique louable.</em>
            </h1>

            <p className="hero-lead">
             AdSync.io transforme chaque story, reel, live et page web d'un créateur de contenus en surface publicitaire active. Les marques louent tes espaces via des contrats officiels. Tu encaisses, automatiquement.
            </p>

            <div className="hero-actions">
              <a className="primary-button hero-primary" href="#inscription">
                Commencer
              </a>
              <a className="secondary-button hero-secondary-button" href="#comment-ca-marche">
                Comment ca marche ?
              </a>
            </div>
          </div>

          <div className="hero-visual hero-visual-photo">
            <div className="visual-card photo-card">
              <div className="hero-visual-glow hero-visual-glow-top" aria-hidden="true" />
              <div className="hero-visual-glow hero-visual-glow-bottom" aria-hidden="true" />
              <img
                src={heroImage}
                alt="Createurs souriants representant une audience engagee"
              />
              <div className="photo-overlay" />

       

             
            </div>
          </div>
        </section>

      </div>
    </section>
  );
}

import { useState } from 'react';
import logoImage from '../assets/logo.png';
import starIcon from '../assets/a_high_end_premium_3d_icon_of_a_minimalist_4_pointed_star._the_star_features-removebg-preview.png';

const STATION_F_LOGO = '/stationf/logo.png';
const STATION_F_COVER = '/stationf/compus.webp';
const STATION_F_FIGHTERS = '/stationf/fight.png';

type AssetImgProps = {
  src: string;
  alt: string;
  fallbackLabel: string;
  className?: string;
};

function AssetImg({ src, alt, fallbackLabel, className }: AssetImgProps) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`stationf-image-fallback ${className ?? ''}`} role="img" aria-label={alt}>
        <span className="stationf-image-fallback-tag">Image à fournir</span>
        <strong>{fallbackLabel}</strong>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}

export default function StationFPage() {
  return (
    <div className="stationf-shell">
      <header className="stationf-topbar">
        <a href="/" className="brand" aria-label="Retour à l'accueil AdSync.io">
          <span className="brand-row">
            <img className="brand-star" src={starIcon} alt="" aria-hidden="true" />
            <img className="brand-logo" src={logoImage} alt="AdSync.io logo" />
          </span>
          <span className="brand-tagline">HUMAN ADTECH</span>
        </a>
        <a href="/" className="stationf-back">
          ← Retour au site
        </a>
      </header>

      <main className="stationf-main">
        <section className="stationf-hero">
          <span className="stationf-eyebrow">
            <span className="stationf-eyebrow-dot" aria-hidden="true" />
            Sélectionnés au Fighters Program
          </span>
          <h1>
            AdSync.io Human AdTech rejoint
            <br />
            <em>Station F.</em>
          </h1>
          <p className="stationf-lead">
            Le plus grand campus de startups au monde. Une confirmation forte que ce que nous
            construisons a du sens, et un accélérateur pour notre mission : remettre l&apos;humain
            au cœur de la publicité.
          </p>

          <div className="stationf-logos">
            <img src={logoImage} alt="AdSync.io" className="stationf-logos-adsync" />
            <span className="stationf-logos-cross" aria-hidden="true">×</span>
            <AssetImg
              src={STATION_F_LOGO}
              alt="Station F"
              fallbackLabel="Logo Station F"
              className="stationf-logos-stationf"
            />
          </div>

          <div className="stationf-cover">
            <AssetImg
              src={STATION_F_COVER}
              alt="Campus Station F"
              fallbackLabel="Photo de couverture Station F"
            />
          </div>
        </section>

        <section className="stationf-grid">
          <article className="stationf-card stationf-card-reverse">
            <div className="stationf-card-media">
              <AssetImg
                src={STATION_F_FIGHTERS}
                alt="Fighters Program de Station F"
                fallbackLabel="Photo Fighters Program"
              />
            </div>
            <div className="stationf-card-body">
              <span className="stationf-card-tag">Le programme</span>
              <h2>Le Fighters Program : nous avons été retenus</h2>
              <p>
                Le Fighters Program est l&apos;un des programmes d&apos;accompagnement les plus
                exigeants de Station F. Il est destiné aux fondateurs qui montrent une
                détermination hors norme à transformer leur secteur, malgré les obstacles.
              </p>
              <p>
                AdSync.io a été sélectionnée à ce programme. Une preuve que notre vision d&apos;une
                publicité fondée sur la recommandation humaine, l&apos;IA et la transparence est
                prise au sérieux par les acteurs les plus établis de l&apos;écosystème.
              </p>
            </div>
          </article>
        </section>

        <section className="stationf-pillars">
          <header>
            <span className="eyebrow">Ce que ça change pour AdSync.io</span>
            <h2>Plus qu&apos;un label, un accélérateur</h2>
          </header>
          <div className="stationf-pillars-grid">
            <article className="stationf-pillar">
              <div className="stationf-pillar-num">01</div>
              <h3>Crédibilité immédiate</h3>
              <p>
                Être à Station F, c&apos;est entrer dans le cercle restreint des startups
                identifiées par l&apos;écosystème tech mondial. Un signal fort pour nos
                créateurs, nos marques et nos partenaires financiers.
              </p>
            </article>
            <article className="stationf-pillar">
              <div className="stationf-pillar-num">02</div>
              <h3>Réseau international</h3>
              <p>
                Accès direct à des fondateurs, mentors et investisseurs venus du monde entier.
                AdSync est une plateforme pensée globale dès le premier jour ; ce réseau accélère
                notre déploiement sur l&apos;Europe et l&apos;Afrique francophone.
              </p>
            </article>
            <article className="stationf-pillar">
              <div className="stationf-pillar-num">03</div>
              <h3>Vitesse d&apos;exécution</h3>
              <p>
                Mentorat, ressources et challenges hebdomadaires : le Fighters Program est conçu
                pour pousser les équipes à exécuter plus vite et plus juste. Exactement ce dont
                nous avons besoin avant le lancement public du 21 juin 2026.
              </p>
            </article>
          </div>
        </section>

        <section className="stationf-cta-section">
          <div className="stationf-cta-card">
            <h2>
              Tu veux rejoindre l&apos;aventure avant le lancement ?
            </h2>
            <p>
              AdSync ouvre ses portes le 21 juin 2026. Réserve ta place sur la liste d&apos;attente
              ou rejoins le programme partenaires pour gagner 25 % de commission sur les
              premiers contrats de tes filleuls.
            </p>
            <div className="stationf-cta-actions">
              <a href="/" className="stationf-cta-btn stationf-cta-btn-ghost">
                Liste d&apos;attente
              </a>
              <a href="/partenaires" className="stationf-cta-btn stationf-cta-btn-primary">
                ✦ Programme Partenaires
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

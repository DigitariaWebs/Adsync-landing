import creatorPhoto from '../assets/photo-pourqui1.png';
import brandPhoto from '../assets/photo-pourqui2.png';
import photoA from '../assets/photo1.png';
import photoB from '../assets/photo2.png';
import photoC from '../assets/photo3.png';
import photoD from '../assets/photo-solution1.png';
import photoE from '../assets/photo-solution2.png';
import influenceurFemme from '../assets/influeunceur-femme.png';
import influenceurHomme from '../assets/influenceur-hommr.png';
import musicienne from '../assets/musicienne.png';
import garsAvecPc from '../assets/gars_avecpc.png';
import femmeAvecPc from '../assets/femme_avecpc.png';
import appMobile from '../assets/app-mobile.png';
import cuisine from '../assets/cuisine.png';
import podcast from '../assets/podcast.png';
import livreur from '../assets/livreur.png';
import pharmacie from '../assets/pharmacie.png';
import jeuVideo from '../assets/jeu_video.png';
import donateur from '../assets/donateur.png';
import screen4 from '../assets/screen4-removebg-preview.png';
import screen10 from '../assets/screen10-removebg-preview.png';
import starIcon from '../assets/a_high_end_premium_3d_icon_of_a_minimalist_4_pointed_star._the_star_features-removebg-preview.png';

type IconName =
  | 'camera'
  | 'gamepad'
  | 'chat'
  | 'chef'
  | 'music'
  | 'globe'
  | 'people'
  | 'cap'
  | 'hand'
  | 'bag'
  | 'phone'
  | 'fork'
  | 'briefcase'
  | 'cross'
  | 'heart'
  | 'rocket'
  | 'video'
  | 'building'
  | 'pin'
  | 'broadcast'
  | 'bulb'
  | 'web'
  | 'reshare'
  | 'check'
  | 'spark';

function Icon({ name }: { name: IconName }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  switch (name) {
    case 'camera':
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="13" rx="2.5" />
          <path d="M8 7l1.5-2.5h5L16 7" />
          <circle cx="12" cy="13.5" r="3.6" />
        </svg>
      );
    case 'gamepad':
      return (
        <svg {...common}>
          <rect x="2.5" y="8" width="19" height="10" rx="3.5" />
          <path d="M7 13h2.5M8.25 11.75v2.5" />
          <circle cx="15" cy="12.5" r="0.7" fill="currentColor" />
          <circle cx="17" cy="14.5" r="0.7" fill="currentColor" />
        </svg>
      );
    case 'chat':
      return (
        <svg {...common}>
          <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4 3.5v-3.5H6.5A2.5 2.5 0 0 1 4 14.5z" />
          <path d="M8.5 9.5h7M8.5 12h4.5" />
        </svg>
      );
    case 'chef':
      return (
        <svg {...common}>
          <path d="M7 11a4 4 0 1 1 1.5-7.7A4.5 4.5 0 0 1 17 5.3 4 4 0 1 1 17 11" />
          <path d="M7 11h10v7a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z" />
          <path d="M10 14v3M14 14v3" />
        </svg>
      );
    case 'music':
      return (
        <svg {...common}>
          <path d="M9 18V6l11-2v12" />
          <circle cx="6.5" cy="18" r="2.5" />
          <circle cx="17.5" cy="16" r="2.5" />
        </svg>
      );
    case 'globe':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
      );
    case 'people':
      return (
        <svg {...common}>
          <circle cx="9" cy="9" r="3.2" />
          <circle cx="17" cy="10.5" r="2.5" />
          <path d="M3 19c0-3.3 2.7-6 6-6s6 2.7 6 6" />
          <path d="M15 19c0-2.5 1.8-4.5 4-4.5s4 2 4 4.5" transform="translate(-2 0)" />
        </svg>
      );
    case 'cap':
      return (
        <svg {...common}>
          <path d="M2 9l10-4 10 4-10 4z" />
          <path d="M6 11v4c0 2 3 3.5 6 3.5s6-1.5 6-3.5v-4" />
          <path d="M22 9v5" />
        </svg>
      );
    case 'hand':
      return (
        <svg {...common}>
          <path d="M9 10V4.5a1.5 1.5 0 1 1 3 0V10" />
          <path d="M12 10V3.5a1.5 1.5 0 1 1 3 0V10" />
          <path d="M15 10V5.5a1.5 1.5 0 1 1 3 0v8a7 7 0 0 1-7 7h-1a6 6 0 0 1-6-6V11a1.5 1.5 0 1 1 3 0v3" />
        </svg>
      );
    case 'bag':
      return (
        <svg {...common}>
          <path d="M5 8h14l-1 12H6z" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2" />
        </svg>
      );
    case 'phone':
      return (
        <svg {...common}>
          <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
          <path d="M10 18.5h4" />
        </svg>
      );
    case 'fork':
      return (
        <svg {...common}>
          <path d="M7 3v8a2 2 0 0 0 4 0V3M9 11v10" />
          <path d="M17 3c-2 0-3 2-3 5s1 5 3 5v8" />
        </svg>
      );
    case 'briefcase':
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" />
        </svg>
      );
    case 'cross':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      );
    case 'heart':
      return (
        <svg {...common}>
          <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
        </svg>
      );
    case 'rocket':
      return (
        <svg {...common}>
          <path d="M14 4c4 0 6 2 6 6-2 0-4 1-6 3l-3-3c2-2 3-4 3-6z" />
          <path d="M11 13l-3-3-4 1 2 3-1 4 4-1 3 2 1-4z" />
          <circle cx="16" cy="8" r="1" fill="currentColor" />
        </svg>
      );
    case 'video':
      return (
        <svg {...common}>
          <rect x="2.5" y="6.5" width="13" height="11" rx="2" />
          <path d="M15.5 10.5l5-3v9l-5-3z" />
        </svg>
      );
    case 'building':
      return (
        <svg {...common}>
          <rect x="4" y="3" width="16" height="18" rx="1.5" />
          <path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h2M13 16h2" />
        </svg>
      );
    case 'pin':
      return (
        <svg {...common}>
          <path d="M12 21s-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12z" />
          <circle cx="12" cy="9.5" r="2.5" />
        </svg>
      );
    case 'broadcast':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="2.5" />
          <path d="M7.5 7.5a6 6 0 0 0 0 9M16.5 7.5a6 6 0 0 1 0 9" />
          <path d="M4 5a10 10 0 0 0 0 14M20 5a10 10 0 0 1 0 14" />
        </svg>
      );
    case 'bulb':
      return (
        <svg {...common}>
          <path d="M9 17h6M10 20h4" />
          <path d="M12 3a6 6 0 0 0-4 10.5c1 1 1.5 2 1.5 3.5h5c0-1.5.5-2.5 1.5-3.5A6 6 0 0 0 12 3z" />
        </svg>
      );
    case 'web':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 9h18M7 6.5h0.01M10 6.5h0.01" />
        </svg>
      );
    case 'reshare':
      return (
        <svg {...common}>
          <path d="M4 9V7a2 2 0 0 1 2-2h11l-3-3M20 15v2a2 2 0 0 1-2 2H7l3 3" />
        </svg>
      );
    case 'check':
      return (
        <svg {...common}>
          <path d="M5 12.5l4 4 10-10" />
        </svg>
      );
    case 'spark':
      return (
        <svg {...common}>
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.5 5.5l3 3M15.5 15.5l3 3M5.5 18.5l3-3M15.5 8.5l3-3" />
        </svg>
      );
  }
}

type Profile = {
  image: string;
  title: string;
  description: string;
};

// Pour swapper une photo : remplace simplement la valeur `image` ci-dessous
// par un nouvel import (ex: import influenceurPhoto from '../assets/influenceur.png')
const creatorProfiles: Profile[] = [
  {
    image: influenceurFemme,
    title: 'Influenceur ou influenceuse',
    description: "Instagram, TikTok, YouTube, Snapchat. N'importe quelle taille d'audience.",
  },
  {
    image: garsAvecPc,
    title: 'Gamer ou streamer',
    description: "Twitch, Kick, YouTube Gaming, TikTok Live. L'IA insère la pub au bon moment.",
  },
  {
    image: photoB,
    title: 'Communauté Discord ou forum',
    description: 'Tu as un serveur actif ou une communauté ? Tes espaces accueillent des contrats.',
  },
  {
    image: cuisine,
    title: 'Cuisine ou lifestyle',
    description: 'Recettes, voyages, mode, beauté, fitness. Chaque niche a ses marques.',
  },
  {
    image: musicienne,
    title: 'Musicien ou artiste',
    description: 'Tu fédères une communauté autour de ta musique ou ton art ? Tu peux monétiser.',
  },
  {
    image: femmeAvecPc,
    title: 'Blogueur ou site web',
    description: 'Tu as un site ou un blog ? Place des pubs et sois payé pour chaque visiteur réel.',
  },
  {
    image: photoC,
    title: 'Groupe Facebook ou WhatsApp',
    description: "Tu gères un groupe actif ? Partage une pub d'une marque et sois payé.",
  },
  {
    image: podcast,
    title: 'Expert ou formateur',
    description: 'LinkedIn, newsletters, podcasts. Toute audience pro ou éducative est valorisée.',
  },
  {
    image: influenceurHomme,
    title: 'Monsieur ou madame tout le monde',
    description: "Sans être influenceur, dès 200 abonnés quelque part, tu peux commencer.",
  },
];

const brandProfiles: Profile[] = [
  {
    image: photoA,
    title: 'Boutique en ligne',
    description: 'E-commerce, Shopify. Tu veux des ventes réelles, pas juste des vues.',
  },
  {
    image: appMobile,
    title: 'Application mobile',
    description: 'Téléchargements réels uniquement. PaySync paie à chaque install vérifiée.',
  },
  {
    image: livreur,
    title: 'Restaurant ou commerce local',
    description: 'Des créateurs locaux parlent de toi à leur communauté dans ta ville.',
  },
  {
    image: screen4,
    title: 'Formation ou cours en ligne',
    description: "Tu paies uniquement quand quelqu'un s'inscrit vraiment.",
  },
  {
    image: screen10,
    title: 'Start-up ou PME',
    description: 'Tu lances un produit avec de la visibilité auprès d\'une vraie audience ciblée.',
  },
  {
    image: pharmacie,
    title: 'Clinique, pharmacie, santé',
    description: 'Des créateurs de confiance parlent de tes services à leur communauté locale.',
  },
  {
    image: jeuVideo,
    title: 'Studio de jeux vidéo',
    description: 'Streamers et gamers présentent ton jeu, avec résultats mesurés.',
  },
  {
    image: donateur,
    title: 'ONG ou association',
    description: 'Sensibilise et recrute bénévoles ou donateurs grâce à des créateurs engagés.',
  },
];

const surfaces = [
  'Stories Instagram',
  'Mur Instagram',
  'Reels et Shorts TikTok',
  'Vidéo YouTube',
  'Mur Facebook',
  'Post Facebook',
  'Statut WhatsApp',
  'LinkedIn',
  'Pages de site web',
  "Partage d'une pub Facebook",
  'Lives et streams automatiques',
];

const brandActions = [
  'Donner une pub à un créateur pour qu\'il la publie sur ses réseaux',
  'Faire booster une pub Facebook existante par un créateur — il la partage, tu paies les résultats',
  "Placer une pub sur le site web d'un créateur, comme un panneau publicitaire numérique",
  "Laisser l'IA AdSync créer la pub complète à ta place : vidéo, texte, format",
  'Payer uniquement ce qui se passe vraiment — vue, clic, achat réel',
];

function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <article className="pq-profile-card">
      <div className="pq-profile-thumb">
        <img src={profile.image} alt="" loading="lazy" />
      </div>
      <h4>{profile.title}</h4>
      <p>{profile.description}</p>
    </article>
  );
}

export default function PourQuiSection() {
  return (
    <section className="section pq-section" id="pour-qui">
      <div className="pq-shell">
        <header className="pq-header">
          <img src={starIcon} alt="" aria-hidden="true" className="pq-header-star" />
          <span className="eyebrow pq-eyebrow">Pour qui ?</span>
          <h2>
            AdSync,
            <br />
            <em>c&apos;est pour toi.</em>
          </h2>
          <p>
            Créateur ou marque, si tu as une audience ou un produit, tu as ta place sur AdSync.
          </p>
        </header>

        {/* CREATOR BLOCK */}
        <div className="pq-block">
          <div className="pq-hero pq-hero-creator">
            <img src={creatorPhoto} alt="Créateur de contenu en plein direct" loading="lazy" />
            <div className="pq-hero-overlay" />
            <div className="pq-hero-badge">
              <Icon name="video" />
              <span>Côté créateur</span>
            </div>
            <div className="pq-hero-title">
              <h3>Tu es un créateur si&hellip;</h3>
            </div>
          </div>

          <p className="pq-block-lead">
            Tu as une audience, même petite, dès 200 abonnés. Tu publies du contenu sur n&apos;importe
            quelle plateforme et tu veux transformer tes Reels, Stories, Statuts, ton mur Facebook ou
            Instagram, tes vidéos et tes espaces web en surfaces publicitaires actives — rémunérées
            par contrats avec des marques alignées avec ton univers.
          </p>

          <div className="pq-profile-grid">
            {creatorProfiles.map(profile => (
              <ProfileCard key={profile.title} profile={profile} />
            ))}
          </div>

          <div className="pq-surfaces">
            <span className="pq-surfaces-label">
              <Icon name="pin" />
              Tes espaces deviennent des surfaces publicitaires
            </span>
            <ul className="pq-surfaces-list">
              {surfaces.map(surface => (
                <li key={surface}>{surface}</li>
              ))}
            </ul>
          </div>

          <div className="pq-info-row">
            <article className="pq-info-card">
              <span className="pq-info-icon">
                <Icon name="broadcast" />
              </span>
              <div>
                <h4>Pendant tes lives, l&apos;IA choisit seule le bon moment</h4>
                <p>
                  Live Instagram, TikTok, YouTube ou Twitch&nbsp;: tu n&apos;as rien à faire. Notre IA
                  analyse en temps réel et insère la pub au moment le plus naturel — pause,
                  changement de sujet, moment calme. Jamais agressif.
                </p>
              </div>
            </article>
            <article className="pq-info-card">
              <span className="pq-info-icon">
                <Icon name="bulb" />
              </span>
              <div>
                <h4>Le bon à savoir</h4>
                <p>
                  Une marque a déjà une pub Facebook&nbsp;? Tu peux simplement la partager sur ta
                  page dans le cadre d&apos;un contrat. Ton espace devient temporairement la surface
                  de diffusion — sans même créer de contenu.
                </p>
              </div>
            </article>
          </div>
        </div>

        {/* BRAND BLOCK */}
        <div className="pq-block">
          <div className="pq-hero pq-hero-brand">
            <img src={brandPhoto} alt="Vitrine de marque premium" loading="lazy" />
            <div className="pq-hero-overlay" />
            <div className="pq-hero-badge">
              <Icon name="building" />
              <span>Côté marque · annonceur</span>
            </div>
            <div className="pq-hero-title">
              <h3>Tu es une marque si&hellip;</h3>
            </div>
          </div>

          <p className="pq-block-lead">
            Tu vends un produit ou un service, ou tu fais la promotion d&apos;une cause, d&apos;un
            événement, d&apos;une application. Tu veux faire diffuser ta pub sur les espaces
            numériques de vrais créateurs — leur mur Facebook, leurs Stories, leurs Reels, leurs
            Statuts, leur site web — en signant des contrats publicitaires directs.
          </p>

          <div className="pq-profile-grid">
            {brandProfiles.map(profile => (
              <ProfileCard key={profile.title} profile={profile} />
            ))}
          </div>

          <div className="pq-actions-block">
            <span className="pq-surfaces-label">
              <Icon name="spark" />
              Ce que tu peux faire avec AdSync
            </span>
            <ul className="pq-actions-list">
              {brandActions.map(action => (
                <li key={action}>
                  <span className="pq-actions-check">
                    <Icon name="check" />
                  </span>
                  {action}
                </li>
              ))}
            </ul>
          </div>

          <article className="pq-example">
            <span className="pq-example-tag">
              <Icon name="bulb" />
              Exemple concret
            </span>
            <p>
              Tu as une pub Nike Running déjà sur Facebook. Sur AdSync, tu signes un contrat avec
              20 créateurs qui la partagent à leur communauté. Tu ne paies que <strong>30&nbsp;€
              pour 3 vrais achats mesurés</strong>. Les créateurs reçoivent leur rémunération
              (75&nbsp;%) automatiquement. Transparent. Propre.
            </p>
          </article>

          <div className="pq-info-row">
            <article className="pq-info-card">
              <span className="pq-info-icon">
                <Icon name="web" />
              </span>
              <div>
                <h4>WebSpaces — ton site devient surface pub</h4>
                <p>
                  Les marques diffusent leurs pubs directement sur les pages de ton site ou blog,
                  comme un panneau publicitaire numérique sur ton propre terrain. Chaque visiteur
                  réel est comptabilisé et génère ta rémunération.
                </p>
              </div>
            </article>
            <article className="pq-info-card">
              <span className="pq-info-icon">
                <Icon name="reshare" />
              </span>
              <div>
                <h4>Pub Boost — partage de pub existante</h4>
                <p>
                  La marque a déjà sa pub sur Facebook&nbsp;? Tu n&apos;as rien à filmer. AdSync te
                  propose un contrat&nbsp;: tu partages la publication sur ta page ou ton groupe et
                  tu reçois ta rémunération pour chaque résultat généré.
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

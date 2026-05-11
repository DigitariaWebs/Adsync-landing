import { useState, type ReactNode } from 'react';
import aiCoreImage from '../assets/ai-core.png';
import dashboardImage from '../assets/dashboard.png';
import contratImage from '../assets/contrat.png';
import payoutImage from '../assets/payout.png';
import uploadImage from '../assets/upload.png';
import shieldImage from '../assets/shield.png';
import stripeImage from '../assets/stripe.png';
import liveGlobeImage from '../assets/live-globe.png';
import starIcon from '../assets/a_high_end_premium_3d_icon_of_a_minimalist_4_pointed_star._the_star_features-removebg-preview.png';

type CardType = 'creator' | 'brand' | 'partner';

const creatorCards = [
  {
    number: '01',
    title: 'Inscription gratuite',
    description: "Je m'inscris sur AdSync.io et je connecte mes réseaux en 1 clic.",
    image: aiCoreImage,
  },
  {
    number: '02',
    title: "L'IA me matche",
    description: "L'IA analyse mon profil et me propose des marques compatibles avec mon univers.",
    image: dashboardImage,
  },
  {
    number: '03',
    title: 'Offre sécurisée',
    description: "Je reçois une offre. L'argent est déjà bloqué en escrow Stripe avant même que j'accepte.",
    image: contratImage,
  },
  {
    number: '04',
    title: 'Co-Create™',
    description: "Si j'accepte, Co-Create™ rédige la pub dans mon style. AdSync publie automatiquement depuis mon compte.",
    image: uploadImage,
  },
  {
    number: '05',
    title: 'Je suis payé',
    description: 'Je reçois 75 % du montant automatiquement via Stripe, virement ou Mobile Money.',
    image: payoutImage,
  },
];

const brandCards = [
  {
    number: '01',
    title: 'Compte gratuit',
    description: 'Je crée mon compte gratuitement sur AdSync.io.',
    image: aiCoreImage,
  },
  {
    number: '02',
    title: 'Campagne en 60 s',
    description: "Je décris ma campagne. L'IA Advisor™ sélectionne automatiquement les créateurs compatibles.",
    image: uploadImage,
  },
  {
    number: '03',
    title: 'Audience filtrée',
    description: "L'IA filtre les faux abonnés via AudienceQualityEngine™. Je confirme les créateurs.",
    image: shieldImage,
  },
  {
    number: '04',
    title: 'Diffusion 14+ réseaux',
    description: "Je bloque mon budget en escrow Stripe. La campagne s'active. AdSync publie sur 14+ réseaux.",
    image: liveGlobeImage,
  },
  {
    number: '05',
    title: 'PrecisionPay™',
    description: "Je paie uniquement les vues, clics et achats réels. Le surplus m'est remboursé automatiquement.",
    image: payoutImage,
  },
];

const partnerCards = [
  {
    number: '01',
    title: 'Je rejoins le programme',
    description: "Je m'inscris au site en 60 sec.",
    image: aiCoreImage,
  },
  {
    number: '02',
    title: 'Code parrain unique',
    description: 'Je reçois instantanément mon code personnel (ex : AS-PRENOM1234).',
    image: contratImage,
  },
  {
    number: '03',
    title: 'Je partage mon lien',
    description: "Je partage mon lien personnel avec ma communauté. Ils rejoignent la liste d'attente AdSync.",
    image: liveGlobeImage,
  },
  {
    number: '04',
    title: 'Accès prioritaire',
    description: 'Le 21 juin, les personnes inscrites via mon code accèdent en priorité à la plateforme.',
    image: dashboardImage,
  },
  {
    number: '05',
    title: '25 % sur le 2ème contrat',
    description: 'Dès que mon filleul signe son 2ème contrat, je reçois 25 % de la commission AdSync — une seule fois, versés via Stripe, PayPal ou Mobile Money.',
    image: stripeImage,
  },
];

const titles: Record<CardType, { eyebrow: string; heading: ReactNode; subline: string }> = {
  creator: {
    eyebrow: 'Parcours sur mesure',
    heading: (
      <>
        Tu crées. L&apos;IA monétise.
        <br />
        <em>Tu encaisses.</em>
      </>
    ),
    subline: 'selon ton profil.',
  },
  brand: {
    eyebrow: 'Parcours sur mesure',
    heading: (
      <>
        Lance des campagnes ciblées.
        <br />
        <em>Paie la performance réelle.</em>
      </>
    ),
    subline: 'selon ton profil.',
  },
  partner: {
    eyebrow: 'Programme Partenaires',
    heading: (
      <>
        Gagne 25 % sur
        <br />
        <em>le 2ème contrat de tes filleuls.</em>
      </>
    ),
    subline: 'selon ton profil.',
  },
};

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState<CardType>('creator');
  const cards =
    activeTab === 'creator' ? creatorCards : activeTab === 'brand' ? brandCards : partnerCards;
  const meta = titles[activeTab];

  return (
    <section className="section" id="comment-ca-marche">
      <div className="how-it-works-panel">
        <div className="how-it-works-glow" />

        <div className="how-it-works-intro">
          <img src={starIcon} alt="" aria-hidden="true" className="section-star" />
          <span className="eyebrow">{meta.eyebrow}</span>
          <h2>
            Comment ça marche
            <br />
            <em>{meta.subline}</em>
          </h2>
          <p className="how-it-works-headline">{meta.heading}</p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div className="toggle-wrapper toggle-wrapper-three">
            <button
              className={`toggle-btn ${activeTab === 'creator' ? 'active' : 'inactive'}`}
              onClick={() => setActiveTab('creator')}
            >
              Je suis Créateur
            </button>
            <button
              className={`toggle-btn ${activeTab === 'brand' ? 'active' : 'inactive'}`}
              onClick={() => setActiveTab('brand')}
            >
              Je suis une Marque
            </button>
            <button
              className={`toggle-btn ${activeTab === 'partner' ? 'active' : 'inactive'}`}
              onClick={() => setActiveTab('partner')}
            >
              Programme Partenaires
            </button>
          </div>
        </div>

        <div className="steps-grid steps-grid-five">
          {cards.map(card => (
            <article className="step-card" key={card.number}>
              <div className="step-image">
                <img src={card.image} alt={card.title} />
                <div className="step-number">{card.number}</div>
              </div>
              <div className="step-body">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </article>
          ))}
        </div>

        {activeTab === 'partner' && (
          <div className="how-it-works-cta">
            <a className="btn btn-primary" href="/partenaires">
              ✦ Rejoindre le programme partenaires
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

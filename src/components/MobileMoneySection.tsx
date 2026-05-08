import starIcon from '../assets/a_high_end_premium_3d_icon_of_a_minimalist_4_pointed_star._the_star_features-removebg-preview.png';
import { BrandBadge } from './BrandedText';

const providers = [
  { name: 'Orange Money', region: 'Afrique de l\'Ouest et Centrale' },
  { name: 'MTN MoMo', region: 'Côte d\'Ivoire, Cameroun, Bénin, Ghana' },
  { name: 'Wave', region: 'Sénégal, Côte d\'Ivoire, Mali' },
  { name: 'M-Pesa', region: 'Kenya, Tanzanie, RDC' },
  { name: 'Moov Money', region: 'Togo, Bénin, Burkina Faso' },
  { name: 'Airtel Money', region: 'Afrique de l\'Est' },
];

const benefits = [
  'Versement sur ton numéro de téléphone, sans carte bancaire.',
  'Conversion automatique en monnaie locale (XOF, XAF, KES, GHS, NGN).',
  'Reçu officiel pour chaque paiement, conforme aux régulations locales.',
];

export default function MobileMoneySection() {
  return (
    <section className="section section-mobile-money" id="mobile-money">
      <div className="mobile-money-panel">
        <div className="mobile-money-copy">
          <img src={starIcon} alt="" aria-hidden="true" className="section-star" />
          <span className="eyebrow">Paiement local</span>
          <h2>
            Mobile Money,
            <br />
            <em>partout chez toi.</em>
          </h2>
          <p>
            Tu n'as pas besoin d'un compte bancaire. <span className="brand-name">AdSync.io</span><BrandBadge /> te paie directement sur ton téléphone
            via les plus grands opérateurs de Mobile Money en Afrique.
          </p>

          <ul className="mobile-money-benefits">
            {benefits.map(b => (
              <li key={b}>
                <span className="mobile-money-bullet" aria-hidden="true">✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="mobile-money-providers">
          <div className="mobile-money-providers-head">
            <span>Opérateurs supportés</span>
            <strong>+12 pays</strong>
          </div>
          <ul className="mobile-money-providers-list">
            {providers.map(p => (
              <li key={p.name}>
                <strong>{p.name}</strong>
                <span>{p.region}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

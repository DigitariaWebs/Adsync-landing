export default function CreatorCard() {
  return (
    <div className="creator-card">
      <img
        src="/api/placeholder/600/400"
        alt="Creator content showcase"
        className="creator-card-image"
      />
      <div className="creator-card-overlay" />
      <div className="creator-card-content">
        <span className="creator-badge">CRÉATEUR</span>
        <h3>Tu crées. Tu encaisses.</h3>
        <ul className="creator-checklist">
          <li>Monétise tes contenus existants</li>
          <li>Gère tes collaborations en toute sécurité</li>
          <li>Reçois des paiements automatiques</li>
        </ul>
      </div>
    </div>
  );
}

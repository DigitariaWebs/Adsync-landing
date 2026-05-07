import { useEffect, useRef, useState } from 'react';
import heroVideoMp4 from '../assets/video.mp4';
import starIcon from '../assets/a_high_end_premium_3d_icon_of_a_minimalist_4_pointed_star._the_star_features-removebg-preview.png';

const LAUNCH_DATE = new Date('2026-06-21T09:00:00Z');

function getCountdown(target: Date) {
  const now = new Date();
  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

function pad(value: number) {
  return value.toString().padStart(2, '0');
}

function HeroCountdown() {
  const [time, setTime] = useState(() => getCountdown(LAUNCH_DATE));

  useEffect(() => {
    const id = window.setInterval(() => setTime(getCountdown(LAUNCH_DATE)), 1000);
    return () => window.clearInterval(id);
  }, []);

  const units: { label: string; value: number }[] = [
    { label: 'Jours', value: time.days },
    { label: 'Heures', value: time.hours },
    { label: 'Min', value: time.minutes },
    { label: 'Sec', value: time.seconds },
  ];

  return (
    <div className="hero-countdown" role="timer" aria-label="Compte à rebours avant le lancement">
      <span className="hero-countdown-kicker">Lancement officiel · 21 juin 2026</span>
      <div className="hero-countdown-grid">
        {units.map(unit => (
          <div className="hero-countdown-cell" key={unit.label}>
            <strong>{pad(unit.value)}</strong>
            <span>{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    const next = !muted;
    video.muted = next;
    if (!next) {
      video.play().catch(() => {});
    }
    setMuted(next);
  };

  return (
    <section className="hero-stage" id="home">
      <div className="hero-panel-shell">
        <section className="hero hero-photo">
          <div className="hero-copy">
            <h1>
              Tes plateformes<br />
              ton immobilier<br />
              <em className="hero-title-gold">numérique louable.</em>
            </h1>

            <p className="hero-lead">
             AdSync.io transforme chaque story, reel, live et page web...ect ,d'un créateur de contenus en surface publicitaire active. Les marques louent tes espaces via des contrats officiels. Tu encaisses, automatiquement.
            </p>

            <HeroCountdown />

            <div className="hero-actions">
              <a className="primary-button hero-primary" href="#inscription">
                Réserver ma place <span aria-hidden="true">→</span>
              </a>
              <a className="secondary-button hero-secondary-button" href="#comment-ca-marche">
                Découvrir la plateforme
              </a>
            </div>
          </div>

          <div className="hero-visual hero-visual-photo">
            <div className="visual-card photo-card">
              <div className="hero-visual-glow hero-visual-glow-top" aria-hidden="true" />
              <div className="hero-visual-glow hero-visual-glow-bottom" aria-hidden="true" />
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-label="Aperçu animé d'AdSync.io"
              >
                <source src={heroVideoMp4} type="video/mp4" />
              </video>
              <button
                type="button"
                className={`hero-sound-toggle${muted ? '' : ' is-on'}`}
                onClick={toggleSound}
                aria-pressed={!muted}
                aria-label={muted ? 'Activer le son de la vidéo' : 'Couper le son de la vidéo'}
              >
                {muted ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M11 5 6 9H3v6h3l5 4V5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                    <path d="m16 9 5 6m0-6-5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M11 5 6 9H3v6h3l5 4V5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                    <path d="M15.5 8.5a5 5 0 0 1 0 7M18 5.5a9 9 0 0 1 0 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                )}
              </button>
              <div className="photo-overlay" />

       

             
            </div>
          </div>
        </section>

      </div>
    </section>
  );
}

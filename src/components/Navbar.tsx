import { useEffect, useState } from 'react';
import logoImage from '../assets/logo.png';
import starIcon from '../assets/a_high_end_premium_3d_icon_of_a_minimalist_4_pointed_star._the_star_features-removebg-preview.png';

type NavItem = {
  href: string;
  label: string;
  id: string;
  external?: boolean;
};

const navItems: NavItem[] = [
  { href: '#probleme', label: 'Le Problème', id: 'probleme' },
  { href: '#solution', label: 'La Solution', id: 'solution' },
  { href: '#comment-ca-marche', label: 'Comment ça marche', id: 'comment-ca-marche' },
  { href: '#pour-qui', label: 'Pour qui', id: 'pour-qui' },
  { href: '#nos-avantages', label: 'Nos avantages', id: 'nos-avantages' },
  { href: '#inscription', label: "L'inscription", id: 'inscription' },
  { href: '#vision', label: 'La Vision', id: 'vision' },
  { href: '#faq', label: 'Vos questions', id: 'faq' },
  { href: '/station-f', label: 'Station F', id: 'station-f', external: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = navItems
      .filter(item => !item.external)
      .map(item => document.getElementById(item.id))
      .filter((section): section is HTMLElement => section instanceof HTMLElement);

    if (!sections.length) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        const visibleEntries = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0.2, 0.35, 0.5, 0.7],
      },
    );

    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 1280) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <header className={`topbar${scrolled ? ' topbar-scrolled' : ''}${menuOpen ? ' topbar-menu-open' : ''}`}>
      <a className="brand" href="#home" aria-label="Accueil AdSync.io">
        <span className="brand-row">
          <img className="brand-star" src={starIcon} alt="" aria-hidden="true" />
          <img className="brand-logo" src={logoImage} alt="AdSync.io logo" />
        </span>
        <span className="brand-tagline">HUMAN ADTECH</span>
      </a>

      <button
        type="button"
        className={`nav-toggle${menuOpen ? ' nav-toggle-open' : ''}`}
        aria-expanded={menuOpen}
        aria-controls="site-navigation"
        aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        onClick={() => setMenuOpen(open => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav
        id="site-navigation"
        className={menuOpen ? 'nav nav-open' : 'nav'}
        aria-label="Navigation principale"
      >
        {navItems.map(item => {
          const isActive = !item.external && activeSection === item.id;
          const baseClass = item.external ? 'nav-link nav-link-stationf' : 'nav-link';
          return (
            <a
              key={item.id}
              href={item.href}
              className={isActive ? `${baseClass} nav-link-active` : baseClass}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          );
        })}
        <a
          className="nav-link nav-link-partner nav-link-partner-mobile"
          href="/partenaires"
          onClick={() => setMenuOpen(false)}
        >
          ✦ Programme Partenaires
        </a>
      </nav>

      <div className="topbar-actions">
        <a className="nav-cta nav-cta-partner" href="/partenaires" onClick={() => setMenuOpen(false)}>
          <span aria-hidden="true">✦</span>
          <span>Programme Partenaires</span>
        </a>
        <a className="nav-cta nav-cta-ghost" href="#inscription" onClick={() => setMenuOpen(false)}>
          Je m&apos;inscris
        </a>
      </div>
    </header>
  );
}

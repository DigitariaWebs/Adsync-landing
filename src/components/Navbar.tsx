import { useEffect, useState } from 'react';
import logoImage from '../assets/logo.png';

const navItems = [
  { href: '#home', label: 'Accueil', id: 'home' },
  { href: '#comment-ca-marche', label: 'Comment ca marche', id: 'comment-ca-marche' },
  { href: '#pour-qui', label: 'Pour qui', id: 'pour-qui' },
  { href: '#fonctionnalites', label: 'Fonctionnalites', id: 'fonctionnalites' },
  { href: '#comparaison', label: 'Comparaison', id: 'comparaison' },
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
      if (window.innerWidth > 900) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <header className={`topbar${scrolled ? ' topbar-scrolled' : ''}${menuOpen ? ' topbar-menu-open' : ''}`}>
      <a className="brand" href="#home" aria-label="Accueil AdSync">
        <img className="brand-logo" src={logoImage} alt="AdSync logo" />
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
        {navItems.map(item => (
          <a
            key={item.id}
            href={item.href}
            className={activeSection === item.id ? 'nav-link nav-link-active' : 'nav-link'}
            aria-current={activeSection === item.id ? 'page' : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="topbar-actions">
        <a className="nav-cta nav-cta-ghost" href="#inscription-beta" onClick={() => setMenuOpen(false)}>
          Je m&apos;inscris
        </a>
      </div>
    </header>
  );
}

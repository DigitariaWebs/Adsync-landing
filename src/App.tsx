import { useEffect } from 'react';
import './index.css';
import './styles/new-sections.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FormatsMarquee from './components/FormatsMarquee';
import HowItWorks from './components/HowItWorks';
import AdvantagesSection from './components/AdvantagesSection';
import SolutionSection from './components/SolutionSection';
import PourQuiSection from './components/PourQuiSection';
import LiveWorldSection from './components/LiveWorldSection';
import VisionSection from './components/VisionSection';
import ProblemSection from './components/ProblemSection';
import MobileMoneySection from './components/MobileMoneySection';
import FAQSection from './components/FAQSection';
import SmartSignupSection from './components/SmartSignupSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AdminPage from './admin/AdminPage';
import PartnersPage from './partners/PartnersPage';
import StationFPage from './stationf/StationFPage';

export default function App() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ref = new URLSearchParams(window.location.search).get('ref');
    if (ref) {
      window.localStorage.setItem('adsync_ref', ref.toUpperCase());
    }
  }, []);

  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
    return <AdminPage />;
  }
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/partenaires')) {
    return <PartnersPage />;
  }
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/station-f')) {
    return <StationFPage />;
  }

  return (
    <div className="page-shell">
      <div className="background-orb background-orb-left" />
      <div className="background-orb background-orb-right" />

      <Navbar />

      <main>
        <Hero />
        <FormatsMarquee />
        <LiveWorldSection />
        <ProblemSection />
        <SolutionSection />
        <HowItWorks />
        <PourQuiSection />
        <AdvantagesSection />
        <MobileMoneySection />
        <SmartSignupSection />
        <ContactSection />
        <VisionSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}

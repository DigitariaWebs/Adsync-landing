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

export default function App() {
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
    return <AdminPage />;
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

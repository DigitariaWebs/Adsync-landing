import './index.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FormatsMarquee from './components/FormatsMarquee';
import HowItWorks from './components/HowItWorks';
import AdvantagesSection from './components/AdvantagesSection';
import SolutionSection from './components/SolutionSection';
import { AudienceSection, FeaturesSection, ComparisonSection } from './components/Sections';
import LiveWorldSection from './components/LiveWorldSection';
import FAQSection from './components/FAQSection';
import SmartSignupSection from './components/SmartSignupSection';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="page-shell">
      <div className="background-orb background-orb-left" />
      <div className="background-orb background-orb-right" />

      <Navbar />

      <main>
        <Hero />
        <FormatsMarquee />
        <LiveWorldSection />
        <HowItWorks />
        <SolutionSection />
        <AdvantagesSection />
        <AudienceSection />
        <FAQSection />
        <SmartSignupSection />
      </main>
      <Footer />
    </div>
  );
}

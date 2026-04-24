import './index.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import CollabSection from './components/CollabSection';
import { AudienceSection, FeaturesSection, ComparisonSection } from './components/Sections';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="page-shell">
      <div className="background-orb background-orb-left" />
      <div className="background-orb background-orb-right" />

      <Navbar />

      <main>
        <Hero />
        <HowItWorks />
        <CollabSection />
        <AudienceSection />
        <FeaturesSection />
        <ComparisonSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}

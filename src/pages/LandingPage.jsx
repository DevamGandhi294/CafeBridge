import HeroSection from '../components/landing/HeroSection';
import MenuPreview from '../components/landing/MenuPreview';
import TableAvailability from '../components/landing/TableAvailability';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <MenuPreview />
      <div id="tables">
        <TableAvailability />
      </div>
      <Footer />
    </div>
  );
}

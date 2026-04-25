import HeroSection from '../components/HeroSection'
import TrustBrandsSection from '../components/TrustBrandsSection'
import RoomsSection from '../components/RoomsSection'
import WhyChooseSection from '../components/WhyChooseSection'
import MilestonesSection from '../components/MilestonesSection'
import CTASection from '../components/CTASection'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <TrustBrandsSection />
      <RoomsSection />
      <WhyChooseSection />
      <MilestonesSection />
      <CTASection />
      <Footer />
    </div>
  )
}
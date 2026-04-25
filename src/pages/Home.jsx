import HeroSection from '../components/HeroSection'
import TrustBrandsSection from '../components/TrustBrandsSection'
import RoomsSection from '../components/RoomsSection'

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <TrustBrandsSection />
      <RoomsSection />
    </div>
  )
}
import HeroSection from '../components/HeroSection'
import TrustBrandsSection from '../components/TrustBrandsSection'
import RoomsSection from '../components/RoomsSection'
import ReviewsSection from '../components/ReviewsSection'

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <TrustBrandsSection />
      <RoomsSection />
      <ReviewsSection />
    </div>
  )
}
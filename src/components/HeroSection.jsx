import { Link } from 'react-router-dom'
import { Building2, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#101010]">
      {/* Layer 1: Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-image.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Layer 2: Typography */}
      <div className="absolute z-10 inset-0 flex flex-col items-center justify-start pt-12 md:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center px-4"
        >
          <span className="inline-block px-4 py-1 text-sm font-medium text-[#FF1493] bg-white/30 rounded-full backdrop-blur-sm">
            Premium Corporate Venue
          </span>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-normal text-[#101010] tracking-tight mt-4">
            Where Your Premium<br/>Journey Begins
          </h1>
          
          <p className="text-lg md:text-xl text-[#101010]/80 mt-3">
            Host your next masterclass in a space where brilliant ideas come alive.
          </p>
          
          <Link
            to="/spaces"
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 text-base font-medium bg-[#FF1493] text-white rounded-lg"
          >
            Explore Space
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
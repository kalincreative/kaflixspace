import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold"><span className="text-[#FF1493]">KaFlix</span> Space</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            <Link to="/" className="transition-colors">Spaces</Link>
            <Link to="/gallery" className="transition-colors">Gallery</Link>
            <Link to="/news" className="transition-colors">News</Link>
            <Link to="/contact" className="transition-colors">Contact</Link>
          </div>

          <Link
            to="/booking"
            className="hidden md:block px-4 py-2 text-sm font-medium bg-[#FF1493] text-white rounded-lg"
          >
            Book Now
          </Link>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-4 space-y-4">
          <Link to="/" className="block py-2">Spaces</Link>
          <Link to="/gallery" className="block py-2">Gallery</Link>
          <Link to="/news" className="block py-2">News</Link>
          <Link to="/contact" className="block py-2">Contact</Link>
          <Link to="/booking" className="block py-2 text-[#FF1493] font-medium">Book Now</Link>
        </div>
      )}
    </nav>
  )
}
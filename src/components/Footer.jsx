import { Link } from 'react-router-dom'
import { MapPin, Mail, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-100 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4">
              <span className="text-[#FF1493]">KaFlix</span> Space
            </h3>
            <p className="text-neutral-500 text-sm">
              Premium spaces for premium ideas. Inspiring corporate excellence.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 mb-4">Explore</h4>
            <ul className="flex flex-col gap-2 text-sm text-neutral-500">
              <li><Link to="/spaces" className="hover:text-[#FF1493]">All Spaces</Link></li>
              <li><Link to="/" className="hover:text-[#FF1493]">Image Gallery</Link></li>
              <li><Link to="/" className="hover:text-[#FF1493]">News & Insights</Link></li>
              <li><Link to="/" className="hover:text-[#FF1493]">FAQ & Help</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 mb-4">Company</h4>
            <ul className="flex flex-col gap-2 text-sm text-neutral-500">
              <li><a href="#" className="hover:text-[#FF1493]">About Us</a></li>
              <li><a href="#" className="hover:text-[#FF1493]">Careers</a></li>
              <li><a href="#" className="hover:text-[#FF1493]">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#FF1493]">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 mb-4">Contact</h4>
            <ul className="flex flex-col gap-2 text-sm text-neutral-500">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" />hello@kaflixspace.com</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4" />+60 3 1234 5678</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4" />Kuala Lumpur, Malaysia</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-neutral-500">
          <p>© 2026 KaFlix Space. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="https://www.threads.com/@itskalin_" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF1493]">Threads</a>
            <a href="https://www.instagram.com/itskalin_/" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF1493]">Instagram</a>
            <a href="http://www.tiktok.com/@itskalin_" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF1493]">TikTok</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
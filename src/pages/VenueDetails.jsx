import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { Users, MapPin, Monitor, Wifi, PenTool, Volume2, Coffee, Plus, Check, ShoppingCart } from 'lucide-react'

const spaces = [
  { id: 1, name: 'Grand Seminar Hall', capacity: 120, price: 'RM150', image: '/Spaces/Grand Seminar Hall.png', location: 'Level 3, Tower A', description: 'Our flagship Grand Seminar Hall is an expansive, architecturally stunning venue designed for large-scale conferences, keynote presentations, and corporate events. Featuring a 200-inch 4K projection wall, professional-grade acoustics, and seating for up to 120 guests, this space sets the stage for unforgettable moments. The floor-to-ceiling glass windows flood the room with natural light, while the dark wood paneling and premium carpet create an atmosphere of sophistication and focus.' },
  { id: 2, name: 'Tech Innovation Lab', capacity: 40, price: 'RM120', image: '/Spaces/Tech Innovation Lab.png', location: 'Level 2, Tower B', description: 'A state-of-the-art collaboration hub engineered for product teams, hackathons, and technical workshops. The open-plan layout encourages cross-functional teamwork, with writable walls covering two full sides of the room. High-performance workstations and enterprise-grade connectivity ensure your team stays in the zone.' },
  { id: 3, name: 'Executive Boardroom', capacity: 20, price: 'RM100', image: '/Spaces/Executive Boardroom.png', location: 'Level 5, Tower A', description: 'An intimate, high-end meeting space designed for C-suite discussions and critical decision-making. The classic wooden boardroom table seats 20 executives in ergonomic comfort, while ambient lighting and sound masking create a focused environment for productive discussions.' },
  { id: 4, name: 'Creative Workshop', capacity: 30, price: 'RM90', image: '/Spaces/Creative Workshop.png', location: 'Level 1, Tower B', description: 'A vibrant creative studio designed for brainstorming, design sprints, and collaborative ideation. Modular furniture can be configured to suit your session needs, while abundant natural light and inspiring artwork spark creativity.' },
  { id: 5, name: 'Pitching Theatre', capacity: 50, price: 'RM110', image: '/Spaces/Pitching Theatre.png', location: 'Level 2, Tower A', description: 'A theatre-style presentation space perfect for pitch days, demo sessions, and investor meetings. The tiered seating ensures every attendee has a clear view, while professional AV equipment handles your presentation with flawless execution.' },
  { id: 6, name: 'Podcast & Media Studio', capacity: 4, price: 'RM80', image: '/Spaces/Podcast & Media Studio.png', location: 'Level 4, Tower B', description: 'A professionally treated recording space for podcasts, video content, and media production. Acoustic panels, professional lighting, and broadcast-quality microphones ensure your content sounds and looks exceptional.' },
  { id: 7, name: 'Agile Sprint Room', capacity: 15, price: 'RM70', image: '/Spaces/Agile Sprint Room.png', location: 'Level 3, Tower B', description: 'Designed for agile teams conducting sprints, stand-ups, and retrospectives. The flexible layout supports various workshop formats, with writable surfaces throughout to capture ideas and track progress.' },
  { id: 8, name: 'Strategy War Room', capacity: 10, price: 'RM60', image: '/Spaces/Strategy War Room.png', location: 'Level 4, Tower A', description: 'An enclosed meeting space for confidential strategic discussions. The secure environment and minimal distractions create the perfect setting for high-stakes planning sessions.' },
  { id: 9, name: 'Focus Pod', capacity: 6, price: 'RM40', image: '/Spaces/Focus Pod.png', location: 'Level 1, Tower A', description: 'A quiet, private space for small team collaborations and focused work sessions. Sound-dampening walls and comfortable seating make this an ideal space for deep work.' },
  { id: 10, name: 'Zen Huddle Space', capacity: 8, price: 'RM45', image: '/Spaces/Zen Huddle Space.png', location: 'Level 2, Tower A', description: 'A calming, minimalist space for small team catch-ups and informal discussions. The zen-inspired design promotes relaxation and open conversation.' },
]

const amenities = [
  { icon: Monitor, label: '4K Projector' },
  { icon: Wifi, label: 'Enterprise WiFi' },
  { icon: PenTool, label: 'Whiteboard Walls' },
  { icon: Volume2, label: 'Sound System' },
  { icon: Coffee, label: 'Artisan Coffee' },
]

const addOns = [
  { id: 1, name: 'Premium Catering (Lunch & Tea)', description: 'Artisan buffet setup', price: 50, unit: '/pax' },
  { id: 2, name: 'Dedicated AV Technician', description: 'On-site support for the entire duration', price: 150, unit: '/flat' },
  { id: 3, name: 'Extended Whiteboard Setup', description: '3 extra mobile glass whiteboards', price: 50, unit: '/flat' },
]

export default function VenueDetails() {
  const { id } = useParams()
  const space = spaces.find(s => s.id === Number(id))
  const [selectedAddons, setSelectedAddons] = useState([])

  const basePrice = space ? parseInt(space.price.replace('RM', '')) : 0
  const addonsTotal = selectedAddons.reduce((sum, addonId) => {
    const addon = addOns.find(a => a.id === addonId)
    return sum + (addon ? addon.price : 0)
  }, 0)
  const totalPrice = basePrice + addonsTotal
  const reservationCount = 0

  const toggleAddon = (addonId) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    )
  }

  if (!space) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Space not found</h1>
          <Link
            to="/spaces"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF1493] text-white rounded-lg hover:scale-[1.02] transition-transform"
          >
            Back to Spaces
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-0">
      <div className="h-[400px] md:h-[500px] w-full relative">
        <img src={space.image} alt={space.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-neutral-900 mb-4">{space.name}</h1>
              <div className="flex flex-wrap gap-6 text-neutral-600">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#FF1493]" />
                  <span>{space.capacity} Pax</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#FF1493]" />
                  <span>{space.location}</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-3">About this Space</h2>
              <p className="text-neutral-600 leading-relaxed">{space.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">What's Included</h2>
              <div className="grid grid-cols-2 gap-4">
                {amenities.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-neutral-100">
                    <div className="w-10 h-10 rounded-lg bg-[#FF1493]/10 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-[#FF1493]" />
                    </div>
                    <span className="text-neutral-700 font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mt-12 mb-6">Optional Add-ons</h2>
              {add-ons.map(addon => (
                <div 
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`border rounded-xl p-4 flex justify-between items-center mb-3 cursor-pointer transition-colors ${
                    selectedAddons.includes(addon.id) 
                      ? 'border-pink-500 bg-pink-50' 
                      : 'border-neutral-200 hover:border-pink-500'
                  }`}
                >
                  <div>
                    <h3 className="font-semibold text-neutral-900">{addon.name}</h3>
                    <p className="text-neutral-500 text-sm">{addon.description}</p>
                    <p className="text-pink-600 font-medium mt-1">+RM {addon.price} {addon.unit}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedAddons.includes(addon.id)
                      ? 'bg-[#FF1493] text-white'
                      : 'bg-neutral-100 text-neutral-400'
                  }`}>
                    {selectedAddons.includes(addon.id) ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-neutral-100 p-6">
              <div className="mb-6">
                <span className="text-3xl font-bold text-neutral-900">RM{totalPrice}</span>
                <span className="text-neutral-500">/hr</span>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#FF1493]/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Time Slot</label>
                  <select className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#FF1493]/50">
                    <option>09:00 AM - 12:00 PM</option>
                    <option>12:00 PM - 03:00 PM</option>
                    <option>03:00 PM - 06:00 PM</option>
                    <option>06:00 PM - 09:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#FF1493]/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Corporate Email</label>
                  <input
                    type="email"
                    placeholder="you@company.com"
                    className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#FF1493]/50"
                  />
                </div>

                {addonsTotal > 0 && (
                  <div className="py-3 border-t border-neutral-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Base Price</span>
                      <span className="text-neutral-500">RM{basePrice}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-neutral-500">Add-ons</span>
                      <span className="text-neutral-500">+RM{addonsTotal}</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-[#FF1493] text-white rounded-lg hover:scale-[1.02] transition-transform font-semibold flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add to Reservation
                </button>

                <button
                  type="button"
                  className="w-full py-2 text-pink-500 hover:bg-pink-50 rounded-lg mt-2 flex items-center justify-center gap-2 font-medium"
                >
                  <ShoppingCart className="w-4 h-4" />
                  View My Reservation ({reservationCount} items)
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
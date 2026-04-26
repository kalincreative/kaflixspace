import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Users, MapPin, Monitor, Wifi, PenTool, Volume2, Coffee, Plus, ShoppingCart, AlertCircle, Wrench } from 'lucide-react'
import { useReservation } from '../context/ReservationContext'

const MAINTENANCE_KEY = 'kaflix_spaces_maintenance'

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
  const { addToCart, setIsOpen, cart } = useReservation()
  const [addonQuantities, setAddonQuantities] = useState({})
  const [formData, setFormData] = useState({ date: '', startTime: '', endTime: '', name: '', email: '' })
  const [errors, setErrors] = useState({})
  const [maintenanceSpaces, setMaintenanceSpaces] = useState({})

  useEffect(() => {
    const stored = localStorage.getItem(MAINTENANCE_KEY)
    if (stored) setMaintenanceSpaces(JSON.parse(stored))
    
    const handleUpdate = () => {
      const stored = localStorage.getItem(MAINTENANCE_KEY)
      setMaintenanceSpaces(stored ? JSON.parse(stored) : {})
    }
    window.addEventListener('kaflix_spaces_updated', handleUpdate)
    return () => window.removeEventListener('kaflix_spaces_updated', handleUpdate)
  }, [])

  if (!space || maintenanceSpaces[space.id]) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-neutral-50">
        <div className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md mx-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wrench className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Space Under Maintenance</h2>
          <p className="text-neutral-600 mb-6">
            This space is currently unavailable. Please check back later or browse other spaces.
          </p>
          <Link
            to="/spaces"
            className="inline-block px-6 py-3 bg-[#FF1493] text-white rounded-lg hover:opacity-90 transition-colors"
          >
            Browse Spaces
          </Link>
        </div>
      </div>
    )
  }

  const timeSlots = [
    { value: '08:00', label: '08:00 AM' },
    { value: '09:00', label: '09:00 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '13:00', label: '01:00 PM' },
    { value: '14:00', label: '02:00 PM' },
    { value: '15:00', label: '03:00 PM' },
    { value: '16:00', label: '04:00 PM' },
    { value: '17:00', label: '05:00 PM' },
    { value: '18:00', label: '06:00 PM' },
    { value: '19:00', label: '07:00 PM' },
    { value: '20:00', label: '08:00 PM' },
    { value: '21:00', label: '09:00 PM' },
  ]

  const getEndTimeOptions = () => {
    if (!formData.startTime) return timeSlots
    const startIdx = timeSlots.findIndex(t => t.value === formData.startTime)
    if (startIdx === -1) return timeSlots
    return timeSlots.slice(startIdx + 1)
  }

  const calculateUsageHours = () => {
    if (!formData.startTime || !formData.endTime) return 0
    const startHour = parseInt(formData.startTime.split(':')[0])
    const endHour = parseInt(formData.endTime.split(':')[0])
    return Math.max(0, endHour - startHour)
  }

  const basePrice = space ? parseInt(space.price.replace('RM', '')) : 0
  const usageHours = calculateUsageHours()
  const prepHours = 1
  const totalBookingHours = usageHours + prepHours
  const usageTotal = basePrice * usageHours
  const prepTotal = basePrice * prepHours
  const addonsTotal = Object.entries(addonQuantities).reduce((sum, [addonId, qty]) => {
    const addon = addOns.find(a => a.id === Number(addonId))
    return sum + (addon ? addon.price * qty : 0)
  }, 0)
  const totalPrice = (basePrice * totalBookingHours) + addonsTotal
  const reservationCount = cart.length

  const updateQuantity = (addonId, change) => {
    setAddonQuantities(prev => {
      const current = prev[addonId] || 0
      const next = Math.max(0, current + change)
      if (next === 0) {
        const { [addonId]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [addonId]: next }
    })
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.date) newErrors.date = 'Date is required'
    if (!formData.startTime) newErrors.startTime = 'Start time is required'
    if (!formData.endTime) newErrors.endTime = 'End time is required'
    if (formData.startTime && formData.endTime) {
      const startHour = parseInt(formData.startTime.split(':')[0])
      const endHour = parseInt(formData.endTime.split(':')[0])
      if (endHour <= startHour) newErrors.endTime = 'End time must be after start time'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const formatTimeRange = () => {
    const startLabel = timeSlots.find(t => t.value === formData.startTime)?.label || formData.startTime
    const endLabel = timeSlots.find(t => t.value === formData.endTime)?.label || formData.endTime
    return `${startLabel} - ${endLabel}`
  }

  const handleAddToReservation = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const selectedAddons = Object.entries(addonQuantities)
      .filter(([_, qty]) => qty > 0)
      .map(([addonId, qty]) => {
        const addon = addOns.find(a => a.id === Number(addonId))
        return { ...addon, qty }
      })

    addToCart({
      spaceId: space.id,
      spaceName: space.name,
      location: space.location,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      timeRange: formatTimeRange(),
      usageHours: usageHours,
      prepHours: prepHours,
      totalBookingHours: totalBookingHours,
      addons: selectedAddons,
      basePrice,
      usageTotal,
      prepTotal,
      addonsTotal,
      totalPrice,
    })

    setAddonQuantities({})
    setFormData({ date: '', startTime: '', endTime: '', name: '', email: '' })
    setIsOpen(true)
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
              {addOns.map(addon => {
                const qty = addonQuantities[addon.id] || 0
                return (
                  <div 
                    key={addon.id}
                    className={`border rounded-xl p-4 flex justify-between items-center mb-3 transition-colors ${
                      qty > 0 
                        ? 'border-pink-500 bg-pink-50' 
                        : 'border-neutral-200'
                    }`}
                  >
                    <div>
                      <h3 className="font-semibold text-neutral-900">{addon.name}</h3>
                      <p className="text-neutral-500 text-sm">{addon.description}</p>
                      <p className="text-pink-600 font-medium mt-1">+RM {addon.price} {addon.unit}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateQuantity(addon.id, -1)}
                        className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-50"
                        disabled={qty === 0}
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">{qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(addon.id, 1)}
                        className="w-8 h-8 rounded-full bg-[#FF1493] text-white flex items-center justify-center hover:opacity-90"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-neutral-100 p-6">
              <div className="mb-4">
                <span className="text-3xl font-bold text-neutral-900">RM{totalPrice}</span>
                <span className="text-neutral-500">/total</span>
              </div>
              <div className="text-sm text-neutral-600 mb-4 space-y-1">
                <p>Rate: RM{basePrice}/hr</p>
                <p>Usage: {usageHours} hr {formatTimeRange()}</p>
                <p>Prep time: +{prepHours} hr</p>
                <p className="font-semibold text-neutral-900">Total booking: {totalBookingHours} hrs</p>
              </div>

              <form className="space-y-4" onSubmit={handleAddToReservation}>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#FF1493]/50 ${errors.date ? 'border-red-500' : 'border-neutral-200'}`}
                  />
                  {errors.date && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.date}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Start Time</label>
                    <select
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value, endTime: '' })}
                      className={`w-full px-3 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#FF1493]/50 ${errors.startTime ? 'border-red-500' : 'border-neutral-200'}`}
                    >
                      <option value="">Start</option>
                      {timeSlots.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                    {errors.startTime && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.startTime}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">End Time</label>
                    <select
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className={`w-full px-3 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#FF1493]/50 ${errors.endTime ? 'border-red-500' : 'border-neutral-200'}`}
                    >
                      <option value="">End</option>
                      {getEndTimeOptions().map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                    {errors.endTime && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.endTime}</p>}
                  </div>
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
                  onClick={() => setIsOpen(true)}
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
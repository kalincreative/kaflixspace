import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Users, MapPin, ArrowRight, ChevronDown } from 'lucide-react'

const spaces = [
  { id: 1, name: 'Grand Seminar Hall', capacity: 120, price: 'RM150', image: '/Spaces/Grand Seminar Hall.png' },
  { id: 2, name: 'Tech Innovation Lab', capacity: 40, price: 'RM120', image: '/Spaces/Tech Innovation Lab.png' },
  { id: 3, name: 'Executive Boardroom', capacity: 20, price: 'RM100', image: '/Spaces/Executive Boardroom.png' },
  { id: 4, name: 'Creative Workshop', capacity: 30, price: 'RM90', image: '/Spaces/Creative Workshop.png' },
  { id: 5, name: 'Pitching Theatre', capacity: 50, price: 'RM110', image: '/Spaces/Pitching Theatre.png' },
  { id: 6, name: 'Podcast & Media Studio', capacity: 4, price: 'RM80', image: '/Spaces/Podcast & Media Studio.png' },
  { id: 7, name: 'Agile Sprint Room', capacity: 15, price: 'RM70', image: '/Spaces/Agile Sprint Room.png' },
  { id: 8, name: 'Strategy War Room', capacity: 10, price: 'RM60', image: '/Spaces/Strategy War Room.png' },
  { id: 9, name: 'Focus Pod', capacity: 6, price: 'RM40', image: '/Spaces/Focus Pod.png' },
  { id: 10, name: 'Zen Huddle Space', capacity: 8, price: 'RM45', image: '/Spaces/Zen Huddle Space.png' },
]

const capacityFilters = [
  { label: 'All Sizes', value: 'all' },
  { label: 'Small (<10)', value: 'small' },
  { label: 'Medium (10-40)', value: 'medium' },
  { label: 'Large (40+)', value: 'large' },
]

export default function SpacesPage() {
  const [search, setSearch] = useState('')
  const [capacityFilter, setCapacityFilter] = useState('all')

  const filteredSpaces = spaces.filter(space => {
    const matchesSearch = space.name.toLowerCase().includes(search.toLowerCase())
    const matchesCapacity = capacityFilter === 'all' || 
      (capacityFilter === 'small' && space.capacity < 10) ||
      (capacityFilter === 'medium' && space.capacity >= 10 && space.capacity <= 40) ||
      (capacityFilter === 'large' && space.capacity > 40)
    return matchesSearch && matchesCapacity
  })

  return (
    <div className="min-h-screen pt-20">
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Our Premium Spaces</h1>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Explore 10 world-class environments engineered for focus, creativity, and breakthrough moments.
          </p>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search spaces..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#FF1493]/50"
            />
          </div>
          <div className="relative">
            <select
              value={capacityFilter}
              onChange={(e) => setCapacityFilter(e.target.value)}
              className="w-full md:w-auto px-6 py-3 rounded-full border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#FF1493]/50 appearance-none pr-10"
            >
              {capacityFilters.map(filter => (
                <option key={filter.value} value={filter.value}>{filter.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpaces.map(space => (
            <Link
              key={space.id}
              to={`/spaces/${space.id}`}
              className="bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <div className="aspect-video overflow-hidden">
                <img src={space.image} alt={space.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-neutral-900">{space.name}</h3>
                <div className="flex flex-col gap-2 mt-3 text-neutral-500 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{space.capacity} Pax</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-5 pt-4 border-t border-neutral-100">
                  <div>
                    <span className="font-bold text-neutral-900">{space.price}</span>
                    <span className="text-neutral-500 text-sm">/hr</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#FF1493] text-white flex items-center justify-center">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
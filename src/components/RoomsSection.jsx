import { Link } from 'react-router-dom'
import { Users, MapPin, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const featuredSpaces = [
  {
    id: 1,
    name: 'Grand Seminar Hall',
    capacity: '120 Seats',
    location: 'Main Building, Floor 1',
    price: '$120',
    image: '/spaces/Grand Seminar Hall.png'
  },
  {
    id: 2,
    name: 'Executive Boardroom',
    capacity: '20 Seats',
    location: 'Tower A, Floor 10',
    price: '$80',
    image: '/spaces/Executive Boardroom.png'
  },
  {
    id: 3,
    name: 'Creative Workshop',
    capacity: '30 Seats',
    location: 'Innovation Hub, Floor 3',
    price: '$60',
    image: '/spaces/Creative Workshop.png'
  },
  {
    id: 4,
    name: 'Focus Pod',
    capacity: '6 Seats',
    location: 'Main Building, Floor 2',
    price: '$35',
    image: '/spaces/Focus Pod.png'
  }
]

export default function RoomsSection() {
  return (
    <section className="py-16 px-4 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 relative">
          <h2 className="text-3xl md:text-4xl font-bold text-[#101010] mb-6">Our Spaces</h2>
          <p className="text-[#101010]/60 max-w-2xl mx-auto text-lg">
            Discover fully equipped training rooms and executive boardrooms tailored to inspire focus, collaboration, and breakthrough moments.
          </p>
          <Link to="/booking" className="absolute right-0 bottom-0 text-[#FF1493] text-sm font-medium hover:underline hidden md:block">
            View all spaces →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredSpaces.map((space, idx) => (
            <motion.div
              key={space.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={space.image}
                  alt={space.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-neutral-900">{space.name}</h3>
                
                <div className="flex flex-col gap-2 mt-3 text-neutral-500 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{space.capacity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{space.location}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-5 pt-4 border-t border-neutral-100">
                  <div>
                    <span className="font-bold text-neutral-900">{space.price}</span>
                    <span className="text-neutral-500 text-sm">/hr</span>
                  </div>
                  <Link
                    to={`/booking/${space.id}`}
                    className="w-8 h-8 rounded-full bg-[#FF1493] text-white flex items-center justify-center"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link to="/booking" className="text-[#FF1493] text-sm font-medium hover:underline">
            View all spaces →
          </Link>
        </div>
      </div>
    </section>
  )
}
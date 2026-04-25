import { Users, Calendar, Heart, Headphones } from 'lucide-react'

const stats = [
  { icon: Calendar, value: '200+', label: 'Events Hosted' },
  { icon: Users, value: '50,000+', label: 'Happy Attendees' },
  { icon: Heart, value: '98%', label: 'Client Satisfaction' },
  { icon: Headphones, value: '24/7', label: 'Dedicated Support' },
]

export default function MilestonesSection() {
  return (
    <section className="py-16 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <stat.icon className="w-8 h-8 text-[#FF1493] mx-auto mb-3" />
              <p className="text-4xl font-bold text-[#FF1493]">{stat.value}</p>
              <p className="text-neutral-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
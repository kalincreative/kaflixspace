import { Shield, Zap, MapPin, CheckCircle } from 'lucide-react'

const valuePoints = [
  {
    title: 'Enterprise-Grade Privacy',
    description: 'Soundproof walls and secure networks for confidential board meetings.',
    icon: Shield
  },
  {
    title: 'Frictionless Experience',
    description: 'From smart-booking to on-site tech support, we handle the logistics.',
    icon: Zap
  },
  {
    title: 'Prime City Location',
    description: 'Easily accessible with dedicated VIP parking for your executives.',
    icon: MapPin
  }
]

export default function WhyChooseSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sm font-semibold tracking-widest text-[#FF1493] uppercase mb-3">
              THE KAFLIX ADVANTAGE
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Designed for Corporate Excellence.
            </h2>
            <p className="text-lg text-neutral-500 mb-8">
              We don't just provide rooms; we provide an environment engineered for focus, creativity, and breakthrough moments.
            </p>

            <div className="flex flex-col gap-6">
              {valuePoints.map((point, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <point.icon className="w-6 h-6 text-[#FF1493] flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-neutral-900">{point.title}</h4>
                    <p className="text-neutral-500">{point.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <img
              src="/advantage.png"
              alt="Corporate meeting room"
              className="w-full h-[500px] object-cover rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
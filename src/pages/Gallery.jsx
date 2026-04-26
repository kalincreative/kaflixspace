import { useState } from 'react'

const images = [
  { src: '/Gallery/gallery1.png', name: 'Event Space 1' },
  { src: '/Gallery/gallery2.png', name: 'Event Space 2' },
  { src: '/Gallery/gallery3.png', name: 'Event Space 3' },
  { src: '/Gallery/gallery4.png', name: 'Event Space 4' },
  { src: '/Gallery/gallery5.png', name: 'Event Space 5' },
  { src: '/Spaces/Grand Seminar Hall.png', name: 'Grand Seminar Hall' },
  { src: '/Spaces/Tech Innovation Lab.png', name: 'Tech Innovation Lab' },
  { src: '/Spaces/Executive Boardroom.png', name: 'Executive Boardroom' },
  { src: '/Spaces/Creative Workshop.png', name: 'Creative Workshop' },
  { src: '/Spaces/Pitching Theatre.png', name: 'Pitching Theatre' },
  { src: '/Spaces/Podcast & Media Studio.png', name: 'Podcast & Media Studio' },
  { src: '/Spaces/Agile Sprint Room.png', name: 'Agile Sprint Room' },
  { src: '/Spaces/Strategy War Room.png', name: 'Strategy War Room' },
  { src: '/Spaces/Focus Pod.png', name: 'Focus Pod' },
  { src: '/Spaces/Zen Huddle Space.png', name: 'Zen Huddle Space' },
  { src: '/hero-image.png', name: 'Main Event Space' },
  { src: '/advantage.png', name: 'Premium Atmosphere' },
]

export default function Gallery() {
  return (
    <div className="min-h-screen pt-20 bg-neutral-50">
      <section className="py-16 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Spaces in Action</h1>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
            Step into the world of KaFlix Space - where every corner is designed for breakthrough moments.
          </p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img, idx) => (
              <div 
                key={idx}
                className={`relative overflow-hidden rounded-2xl group cursor-pointer h-64 ${
                  idx === 0 ? 'md:col-span-2 md:row-span-2 h-auto' : ''
                } ${idx === 4 ? 'md:col-span-1' : ''}
                ${idx === 5 ? 'md:col-span-1' : ''}
                ${idx === 17 ? 'md:col-span-1' : ''}`}
              >
                <img 
                  src={img.src} 
                  alt={img.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-white font-semibold text-lg">{img.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
import { useState } from 'react'

const images = [
  { src: '/Gallery/gallery1.png', name: 'Event Space 1', size: 'large' },
  { src: '/Gallery/gallery2.png', name: 'Event Space 2', size: 'medium' },
  { src: '/Gallery/gallery3.png', name: 'Event Space 3', size: 'medium' },
  { src: '/Spaces/hero-image.png', name: 'Main Event Space', size: 'wide' },
  { src: '/Gallery/gallery4.png', name: 'Event Space 4', size: 'small' },
  { src: '/Spaces/Grand Seminar Hall.png', name: 'Grand Seminar Hall', size: 'medium' },
  { src: '/Spaces/Tech Innovation Lab.png', name: 'Tech Innovation Lab', size: 'tall' },
  { src: '/Spaces/advantage.png', name: 'Premium Atmosphere', size: 'wide' },
  { src: '/Spaces/Executive Boardroom.png', name: 'Executive Boardroom', size: 'medium' },
  { src: '/Spaces/Creative Workshop.png', name: 'Creative Workshop', size: 'small' },
  { src: '/Spaces/Pitching Theatre.png', name: 'Pitching Theatre', size: 'medium' },
  { src: '/Spaces/Podcast & Media Studio.png', name: 'Podcast & Media Studio', size: 'wide' },
  { src: '/Spaces/Agile Sprint Room.png', name: 'Agile Sprint Room', size: 'tall' },
  { src: '/Spaces/Strategy War Room.png', name: 'Strategy War Room', size: 'small' },
  { src: '/Spaces/Focus Pod.png', name: 'Focus Pod', size: 'medium' },
  { src: '/Spaces/Zen Huddle Space.png', name: 'Zen Huddle Space', size: 'small' },
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
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[200px]">
            {images.map((img, idx) => (
              <div 
                key={idx}
                className={`relative overflow-hidden rounded-2xl group cursor-pointer ${
                  img.size === 'large' ? 'col-span-2 row-span-2' : ''
                } ${img.size === 'wide' ? 'col-span-2' : ''}
                ${img.size === 'tall' ? 'row-span-2' : ''}
                ${img.size === 'medium' ? '' : ''}
                ${img.size === 'small' ? '' : ''}`}
              >
                <img 
                  src={img.src} 
                  alt={img.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-white font-semibold text-sm">{img.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
import { useState } from 'react'

const images = [
  { src: '/Gallery/gallery1.png', name: 'Event Space 1', span: 'large' },
  { src: '/Gallery/gallery2.png', name: 'Event Space 2' },
  { src: '/Gallery/gallery3.png', name: 'Event Space 3', span: 'wide' },
  { src: '/Gallery/gallery4.png', name: 'Event Space 4' },
  { src: '/Gallery/gallery5.png', name: 'Event Space 5', span: 'tall' },
  { src: '/advantage.png', name: 'Premium Atmosphere' },
  { src: '/Spaces/Grand Seminar Hall.png', name: 'Grand Seminar Hall', span: 'large' },
  { src: '/Spaces/Tech Innovation Lab.png', name: 'Tech Innovation Lab' },
  { src: '/Spaces/Executive Boardroom.png', name: 'Executive Boardroom', span: 'wide' },
  { src: '/Spaces/Creative Workshop.png', name: 'Creative Workshop' },
  { src: '/Spaces/Pitching Theatre.png', name: 'Pitching Theatre', span: 'tall' },
  { src: '/Spaces/Podcast & Media Studio.png', name: 'Podcast & Media Studio', span: 'wide' },
  { src: '/Spaces/Agile Sprint Room.png', name: 'Agile Sprint Room' },
  { src: '/Spaces/Strategy War Room.png', name: 'Strategy War Room', span: 'tall' },
  { src: '/Spaces/Focus Pod.png', name: 'Focus Pod' },
  { src: '/Spaces/Zen Huddle Space.png', name: 'Zen Huddle Space' },
  { src: '/hero-image.png', name: 'Main Event Space' },
]

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null)

  return (
    <div className="min-h-screen pt-20 bg-neutral-950">
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-serif font-thin text-white mb-4 tracking-tight">Gallery</h1>
          <p className="text-neutral-500 text-sm tracking-widest uppercase">A Glimpse Into Our Space</p>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[280px]">
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`relative overflow-hidden rounded-xl group cursor-pointer ${
                  img.span === 'large' ? 'lg:col-span-2 lg:row-span-2' : ''
                } ${img.span === 'wide' ? 'lg:col-span-2 lg:row-span-1' : ''}
                ${img.span === 'tall' ? 'lg:col-span-1 lg:row-span-2' : ''}`}
                onClick={() => setSelectedImage(img)}
              >
                <img
                  src={img.src}
                  alt={img.name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Space</p>
                  <span className="text-white font-light text-lg">{img.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={selectedImage.src}
            alt={selectedImage.name}
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-10 text-center">
            <p className="text-white/60 text-xs uppercase tracking-widest">{selectedImage.name}</p>
          </div>
        </div>
      )}
    </div>
  )
}
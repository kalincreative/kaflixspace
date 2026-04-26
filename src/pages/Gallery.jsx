import { useState } from 'react'

const images = [
  { src: '/Spaces/Grand Seminar Hall.png', name: 'Grand Seminar Hall' },
  { src: '/Spaces/Tech Innovation Lab.png', name: 'Tech Innovation Lab' },
  { src: '/Spaces/Executive Boardroom.png', name: 'Executive Boardroom' },
  { src: '/Gallery/gallery1.png', name: 'Event Space 1' },
  { src: '/Spaces/Creative Workshop.png', name: 'Creative Workshop' },
  { src: '/Spaces/Pitching Theatre.png', name: 'Pitching Theatre' },
  { src: '/Spaces/Podcast & Media Studio.png', name: 'Podcast & Media Studio' },
  { src: '/Spaces/Agile Sprint Room.png', name: 'Agile Sprint Room' },
  { src: '/Gallery/gallery2.png', name: 'Gallery 2' },
  { src: '/Gallery/gallery3.png', name: 'Event Space 3' },
  { src: '/Spaces/Strategy War Room.png', name: 'Strategy War Room' },
  { src: '/Spaces/Focus Pod.png', name: 'Focus Pod' },
  { src: '/Spaces/Zen Huddle Space.png', name: 'Zen Huddle Space' },
  { src: '/Gallery/gallery4.png', name: 'Gallery 4' },
  { src: '/advantage.png', name: 'The KaFlix Advantage' },
  { src: '/Gallery/gallery5.png', name: 'Event Space 5' },
]

const gridSpans = [
  'col-span-4 aspect-[19/6]',
  'col-span-2',
  'col-span-2',
  'col-span-4 aspect-[19/6]',
  'col-span-3 aspect-[19/6]',
  'col-span-3 aspect-[19/6]',
  'col-span-2',
  'col-span-2',
  'col-span-2',
  'col-span-4 aspect-[19/6]',
  'col-span-2',
  'col-span-2',
  'col-span-4 aspect-[19/6]',
  'col-span-2',
  'col-span-2',
  'col-span-2',
]

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null)

  return (
    <div className="min-h-screen pt-20 bg-neutral-50">
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">Gallery</h1>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
            A Glimpse Into Our Space
          </p>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-6 gap-4 bg-neutral-50">
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`relative overflow-hidden group cursor-pointer rounded-2xl ${gridSpans[idx]}`}
              >
                <img
                  src={img.src}
                  alt={img.name}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm font-medium tracking-wide">{img.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 md:p-12"
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
          <div className="absolute bottom-8 text-center">
            <p className="text-white/80 text-sm tracking-wide">{selectedImage.name}</p>
          </div>
        </div>
      )}
    </div>
  )
}
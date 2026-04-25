import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react'

const reviews = [
  {
    id: 1,
    name: 'Sarah Ahmad',
    title: 'CEO, TechVenture Malaysia',
    image: '/review1.jpg',
    quote: 'KaFlix Space transformed our annual tech summit into an unforgettable experience. The facilities and service were impeccable.'
  },
  {
    id: 2,
    name: 'Michael Chen',
    title: 'Director, Apex Consulting',
    image: '/review2.jpg',
    quote: 'Professional, clean, and inspiring. The best venue we have worked with for our corporate training programs.'
  },
  {
    id: 3,
    name: 'Dr. Amanda Lee',
    title: 'Founder, MedInnovate Asia',
    image: '/review3.jpg',
    quote: 'Our medical conference was a huge success thanks to the exceptional facilities and support at KaFlix Space.'
  },
  {
    id: 4,
    name: 'James Wong',
    title: 'VP Operations, FinanceHub',
    image: '/review4.jpg',
    quote: 'The attention to detail and premium amenities make KaFlix Space our go-to choice for important client meetings.'
  },
  {
    id: 5,
    name: 'Lisa Tan',
    title: 'Managing Director, CreativeHub',
    image: '/review5.jpg',
    quote: 'An inspiring environment that truly fosters creativity and collaboration. Our team productivity has never been higher.'
  }
]

export default function ReviewsSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  const goToPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setActiveIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1))
  }

  const activeReview = reviews[activeIndex]

  return (
    <section className="py-20 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-neutral-400 tracking-[0.3em] uppercase mb-2">Testimonials</p>
          <h2 className="text-4xl font-bold text-[#101010] mb-4">
            What Our Corporate Clients Say
          </h2>
          <p className="text-lg text-[#101010]/60 max-w-2xl mx-auto">
            Discover the real experiences of those who've chosen our spaces to inspire focus and collaboration.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">
          <div className="lg:w-[40%]">
            <div className="relative h-[400px] lg:h-[500px]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeReview.id}
                  src={activeReview.image}
                  alt={activeReview.name}
                  className="absolute inset-0 w-full h-full object-cover rounded-3xl shadow-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
            </div>
          </div>

          <div className="lg:w-[60%] flex flex-col gap-6">
            <div className="flex gap-3 justify-start">
              {reviews.map((review, idx) => (
                <button
                  key={review.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-14 h-14 rounded-lg overflow-hidden transition-all duration-300 ${
                    idx === activeIndex
                      ? 'ring-2 ring-[#FF1493] scale-110'
                      : 'grayscale opacity-50 scale-95 hover:scale-100 hover:opacity-75'
                  }`}
                >
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="flex-1 flex items-start">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeReview.id}
                  className="w-full"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Quote className="w-10 h-10 text-[#FF1493]/30 mb-4" />
                  <p className="text-xl lg:text-2xl font-light text-[#101010] leading-relaxed">
                    "{activeReview.quote}"
                  </p>
                  <div className="mt-6">
                    <h4 className="text-xl font-bold text-[#101010]">{activeReview.name}</h4>
                    <p className="text-[#FF1493] font-medium">{activeReview.title}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex gap-2">
              <button
                onClick={goToPrev}
                className="w-12 h-12 rounded-full bg-[#FF1493] text-white flex items-center justify-center hover:bg-[#FF1493]/90 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={goToNext}
                className="w-12 h-12 rounded-full bg-[#FF1493] text-white flex items-center justify-center hover:bg-[#FF1493]/90 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react'

const clientLogos = [
  '/logo/1.png',
  '/logo/2.png',
  '/logo/3.png',
  '/logo/4.png',
  '/logo/5.png',
  '/logo/6.png',
  '/logo/7.png',
  '/logo/8.png',
  '/logo/9.png',
  '/logo/10.png',
  '/logo/11.png',
  '/logo/12.png',
  '/logo/13.png',
  '/logo/14.png',
  '/logo/15.png',
]

const reviews = [
  {
    id: 1,
    name: 'Michael Chen',
    title: 'Director, Apex Consulting',
    image: '/review/review1.png',
    quote: 'KaFlix Space transformed our annual tech summit into an unforgettable experience. The facilities and service were impeccable.'
  },
  {
    id: 2,
    name: 'Sarah Ahmad',
    title: 'CEO, TechVenture Malaysia',
    image: '/review/review2.png',
    quote: 'Professional, clean, and inspiring. The best venue we have worked with for our corporate training programs.'
  },
  {
    id: 3,
    name: 'Dr. Amanda Lee',
    title: 'Founder, MedInnovate Asia',
    image: '/review/review3.png',
    quote: 'Our medical conference was a huge success thanks to the exceptional facilities and support at KaFlix Space.'
  },
  {
    id: 4,
    name: 'Emily Wong',
    title: 'VP Operations, FinanceHub',
    image: '/review/review4.png',
    quote: 'The attention to detail and premium amenities make KaFlix Space our go-to choice for important client meetings.'
  },
  {
    id: 5,
    name: 'David Tan',
    title: 'Managing Director, CreativeHub',
    image: '/review/review5.png',
    quote: 'An inspiring environment that truly fosters creativity and collaboration. Our team productivity has never been higher.'
  }
]

export default function TrustBrandsSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  const goToPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setActiveIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1))
  }

  const activeReview = reviews[activeIndex]

  return (
    <section className="py-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
        <p className="text-3xl font-bold text-[#101010]">Trusted by Industry Leaders</p>
      </div>

      <div className="relative w-full overflow-hidden mb-16">
        <motion.div
          className="flex gap-20 w-max"
          animate={{
            x: ["0%", "-50%"]
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear"
            }
          }}
        >
          {[...clientLogos, ...clientLogos].map((logo, index) => (
            <div
              key={index}
              className="flex-shrink-0 h-16 w-32 flex items-center justify-center"
            >
              <img
                src={logo}
                alt={`Client ${index + 1}`}
                className="max-h-full max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
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
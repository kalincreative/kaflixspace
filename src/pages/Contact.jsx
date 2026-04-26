import { useState } from 'react'
import { Mail, Phone, MessageCircle, Send, ChevronDown, CheckCircle } from 'lucide-react'

const faqs = [
  {
    question: 'How do I book a space?',
    answer: 'Simply browse our Spaces page, select your preferred room, and fill out the booking form. Our team will confirm your reservation within 24 hours.',
  },
  {
    question: 'Are catering options available?',
    answer: 'Yes! We partner with premium catering services to provide customized F&B packages. Contact us for menu options and dietary requirements.',
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'Full refunds are available up to 7 days before your event. Cancellations within 7 days receive a 50% refund. No-shows are non-refundable.',
  },
  {
    question: 'Do you provide AV support?',
    answer: 'Absolutely! All our spaces come equipped with state-of-the-art AV systems, high-speed WiFi, and technical support available upon request.',
  },
]

export default function Contact() {
  const [openFaq, setOpenFaq] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen pt-20 bg-neutral-50">
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">Get in Touch</h1>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
            Have questions? We're here to help you create the perfect event experience.
          </p>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-neutral-100 rounded-2xl p-8 text-center hover:-translate-y-2 transition-all duration-300 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-[#FF2D8C]" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Email Us</h3>
              <a href="mailto:hello@kaflixspace.my" className="text-[#FF2D8C] hover:underline">
                hello@kaflixspace.my
              </a>
            </div>

            <div className="bg-white border border-neutral-100 rounded-2xl p-8 text-center hover:-translate-y-2 transition-all duration-300 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-7 h-7 text-[#FF2D8C]" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Call Us</h3>
              <a href="tel:+60123456789" className="text-[#FF2D8C] hover:underline">
                +60 12 345 6789
              </a>
            </div>

            <div className="bg-white border border-neutral-100 rounded-2xl p-8 text-center hover:-translate-y-2 transition-all duration-300 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-7 h-7 text-[#FF2D8C]" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Threads</h3>
              <a href="https://threads.net/@kaflixspace" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:underline">
                @kaflixspace
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 bg-neutral-50">
        <div className="max-w-6xl mx-auto mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div 
                    key={idx}
                    className="bg-white rounded-xl border border-neutral-100 overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <span className="font-medium text-neutral-900">{faq.question}</span>
                      <ChevronDown className={`w-5 h-5 text-neutral-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                    </button>
                    {openFaq === idx && (
                      <div className="px-5 pb-5 text-neutral-600">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-100">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-2">Message Sent!</h2>
                    <p className="text-neutral-600">We'll get back to you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h2 className="text-xl font-bold text-neutral-900 mb-6">Send us a Message</h2>
                    
                    <div>
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#FF2D8C]/50"
                        required
                      />
                    </div>

                    <div>
                      <input
                        type="email"
                        placeholder="Work Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#FF2D8C]/50"
                        required
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#FF2D8C]/50"
                        required
                      />
                    </div>

                    <div>
                      <textarea
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#FF2D8C]/50 resize-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-[#FF2D8C] text-white rounded-lg hover:opacity-90 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full h-[450px]">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127482.35520846554!2d101.6169485!3d3.1385059!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc362abd08e7d3%3A0x232e17121d3dd30!2sKuala%20Lumpur%2C%20Federal%20Territory%20of%20Kuala%20Lumpur!5e0!3m2!1sen!2smy!4v1714090000000!5m2!1sen!2smy" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </div>
  )
}
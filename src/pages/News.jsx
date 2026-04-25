import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const articles = [
  {
    id: 1,
    title: 'The Future of Hybrid Meetings in KL',
    excerpt: 'As Kuala Lumpur emerges as a business hub, the way we meet is evolving. Discover how hybrid spaces are reshaping corporate collaborations.',
    date: 'April 2026',
    image: '/Spaces/Grand Seminar Hall.png',
  },
  {
    id: 2,
    title: '5 Tips for a Successful Corporate Workshop',
    excerpt: 'From breakout sessions to interactive presentations, learn the secrets to running workshops that actually work.',
    date: 'March 2026',
    image: '/Spaces/Creative Workshop.png',
  },
  {
    id: 3,
    title: 'How KaFlix Space is Redefining Office Luxury',
    excerpt: 'Gone are the boring conference rooms. We explore the rise of premium workspaces that inspire creativity.',
    date: 'February 2026',
    image: '/Spaces/Executive Boardroom.png',
  },
]

export default function News() {
  return (
    <div className="min-h-screen pt-20 bg-neutral-50">
      <section className="py-16 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Latest from KaFlix Space</h1>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
            Insights, tips, and stories from the world of premium event spaces.
          </p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {articles.map(article => (
            <div 
              key={article.id}
              className="bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row"
            >
              <div className="md:w-1/3 aspect-video md:aspect-auto">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 p-6 flex flex-col justify-center">
                <span className="text-neutral-400 text-sm mb-2">{article.date}</span>
                <h2 className="text-xl font-bold text-neutral-900 mb-2">{article.title}</h2>
                <p className="text-neutral-600 mb-4">{article.excerpt}</p>
                <Link to="#" className="text-pink-500 font-medium flex items-center gap-1 hover:gap-2 transition-all">
                  Read More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
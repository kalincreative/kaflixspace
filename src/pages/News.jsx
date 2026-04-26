import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const articles = [
  {
    id: 1,
    title: 'The Future of Hybrid Meetings in KL',
    excerpt: 'As Kuala Lumpur emerges as a business hub, the way we meet is evolving. Discover how hybrid spaces are reshaping corporate collaborations.',
    content: 'As Kuala Lumpur emerges as a global business hub, the way we conduct meetings is undergoing a revolutionary transformation. Hybrid spaces are now at the forefront of this change, combining the best of in-person collaboration with the flexibility of remote participation.\n\nAt KaFlix Space, we\'ve designed our rooms specifically to accommodate this new paradigm. Our state-of-the-art AV systems, high-speed connectivity, and thoughtfully designed acoustics ensure that whether your team is in the room or joining from across the globe, everyone feels equally engaged and valued.\n\nThe future of work isn\'t about choosing between office and home—it\'s about creating spaces that bridge the gap seamlessly.',
    date: 'April 2026',
    category: 'Industry',
    image: '/Spaces/Grand Seminar Hall.png',
  },
  {
    id: 2,
    title: '5 Tips for a Successful Corporate Workshop',
    excerpt: 'From breakout sessions to interactive presentations, learn the secrets to running workshops that actually work.',
    content: 'Running a successful corporate workshop requires more than just a good agenda. Here are five essential tips that transform ordinary sessions into breakthrough moments.\n\n1. Start with a clear objective - know what success looks like before you begin.\n2. Design for interaction - people learn by doing, not just listening.\n3. Create comfortable spaces - the environment directly impacts creativity.\n4. Build in breaks - sustained focus requires recovery periods.\n5. Follow up with action items - great workshops lead to measurable outcomes.',
    date: 'March 2026',
    category: 'Tips',
    image: '/Spaces/Creative Workshop.png',
  },
  {
    id: 3,
    title: 'How KaFlix Space is Redefining Office Luxury',
    excerpt: 'Gone are the boring conference rooms. We explore the rise of premium workspaces that inspire creativity.',
    content: 'The modern workplace has evolved beyond sterile cubicles and generic conference rooms. Today\'s professionals demand spaces that inspire creativity, foster collaboration, and provide the amenities that make long workdays manageable.\n\nKaFlix Space represents this new paradigm of office luxury—not just about aesthetics, but about creating environments where innovation naturally flourishes. From our carefully curated acoustics to our natural lighting designs, every element serves a purpose.\n\nLuxury in the modern sense isn\'t about opulence—it\'s about thoughtful design that makes people feel valued and energized.',
    date: 'February 2026',
    category: 'Space Highlights',
    image: '/Spaces/Executive Boardroom.png',
  },
]

export default function News() {
  return (
    <div className="min-h-screen pt-20 bg-neutral-50">
      <section className="py-16 bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">Latest from KaFlix Space</h1>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
            Insights, tips, and stories from the world of premium event spaces.
          </p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {articles.map((article, idx) => (
            <div 
              key={article.id}
              className={`bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col md:flex-row ${idx === 0 ? 'md:flex-col' : ''}`}
            >
              <div className={`${idx === 0 ? 'md:w-full aspect-video' : 'md:w-1/3 aspect-video md:aspect-auto'}`}>
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 p-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-pink-500/10 text-pink-600 text-xs font-medium rounded-full">
                    {article.category}
                  </span>
                  <span className="text-neutral-400 text-sm">{article.date}</span>
                </div>
                <h2 className={`font-bold text-neutral-900 mb-2 ${idx === 0 ? 'text-2xl' : 'text-xl'}`}>{article.title}</h2>
                <p className="text-neutral-600 mb-4">{article.excerpt}</p>
                <Link 
                  to={`/news/${article.id}`} 
                  className="text-pink-500 font-medium flex items-center gap-1 hover:gap-2 transition-all w-fit"
                >
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

export { articles }
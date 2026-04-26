import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { articles } from './News'

export default function SingleNews() {
  const { id } = useParams()
  const article = articles.find(a => a.id === parseInt(id))

  if (!article) {
    return (
      <div className="min-h-screen pt-20 bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Article not found</h1>
          <Link to="/news" className="text-pink-500 hover:underline">
            Back to News
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 bg-neutral-50">
      <div className="max-w-3xl mx-auto">
        <div className="aspect-video w-full">
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full h-full object-cover rounded-b-2xl"
          />
        </div>

        <div className="py-12 px-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-pink-500/10 text-pink-600 text-sm font-medium rounded-full">
              {article.category}
            </span>
            <span className="text-neutral-400">{article.date}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
            {article.title}
          </h1>

          <div className="prose prose-lg max-w-none text-neutral-600">
            {article.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="mb-4 leading-relaxed">{paragraph}</p>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-neutral-200">
            <Link 
              to="/news" 
              className="inline-flex items-center gap-2 text-pink-500 font-medium hover:gap-3 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to News
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Article } from '../../types'

export function ArticleCard({ article, index }: { article: Article; index: number }) {
  return <article className={`group rounded-xl bg-white p-3 shadow-[0_2px_0_rgba(24,25,22,.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(24,25,22,.12)] sm:p-4 ${index === 0 ? 'md:col-span-2' : ''}`}>
    <Link to={`/articulos/${article.slug}`} className={`block overflow-hidden rounded-lg bg-ink/5 ${index === 0 ? 'aspect-[16/10] md:aspect-[16/8]' : 'aspect-[4/3]'}`}><img src={article.imageUrl} alt={article.imageAlt} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" /></Link>
    <div className="px-1 pb-1 pt-5"><div className="mb-3 flex items-center gap-3 text-xs font-medium uppercase tracking-[.16em] text-clay"><span>{article.category}</span><span className="h-px w-6 bg-clay/50" /><time>{new Date(article.publishedAt).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}</time></div><h2 className={`font-display font-semibold leading-tight ${index === 0 ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-xl sm:text-2xl'}`}>{article.title}</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-ink/65 sm:text-base sm:leading-7">{article.excerpt}</p><Link to={`/articulos/${article.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider transition hover:gap-3 hover:text-clay">Leer artículo <ArrowRight size={15} /></Link></div>
  </article>
}

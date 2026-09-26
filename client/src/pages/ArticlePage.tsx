import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { emptySettings } from '../constants'
import type { Article, SiteSettings } from '../types'

export function ArticlePage() {
  const { slug = '' } = useParams()
  const [article, setArticle] = useState<Article>()
  const [settings, setSettings] = useState<SiteSettings>(emptySettings)
  const [error, setError] = useState('')
  useEffect(() => { Promise.all([api.getArticle(slug), api.getSettings()]).then(([loadedArticle, loadedSettings]) => { setArticle(loadedArticle); setSettings(loadedSettings) }).catch((requestError: Error) => setError(requestError.message)) }, [slug])
  if (error) return <><Header settings={settings} /><main className="mx-auto max-w-3xl px-5 py-24"><h1 className="font-display text-4xl">Artículo no encontrado</h1><Link to="/" className="mt-8 inline-flex gap-2"><ArrowLeft /> Volver</Link></main></>
  if (!article) return <p className="p-12 text-center">Cargando…</p>
  return <><Header settings={settings} /><main><article><header className="mx-auto max-w-5xl px-5 py-16 text-center lg:py-24"><p className="text-xs font-semibold uppercase tracking-[.2em] text-clay">{article.category}</p><h1 className="mt-5 font-display text-4xl font-semibold leading-tight sm:text-6xl">{article.title}</h1><p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-ink/60">{article.excerpt}</p><div className="mt-8 text-sm text-ink/55">Por {article.author} · {new Date(article.publishedAt).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}</div></header><div className="mx-auto max-w-6xl px-5"><img src={article.imageUrl} alt={article.imageAlt} className="max-h-[680px] w-full object-cover" /></div><div className="article-body mx-auto max-w-2xl whitespace-pre-line px-5 py-16 font-display text-[1.18rem] leading-9 text-ink/85 lg:py-24">{article.content}</div></article></main><Footer settings={settings} /></>
}

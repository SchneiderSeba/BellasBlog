import { useMemo, useState } from 'react'
import { ArticleCard } from '../components/articles/ArticleCard'
import { ArticleSearch } from '../components/articles/ArticleSearch'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { usePublicData } from '../hooks/use-public-data'

export function HomePage() {
  const { articles, settings, loading, error } = usePublicData()
  const [search, setSearch] = useState('')
  const filteredArticles = useMemo(() => {
    const query = search.trim().normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
    if (!query) return articles
    return articles.filter(article => [article.title, article.excerpt, article.content, article.author, article.category]
      .some(value => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().includes(query)))
  }, [articles, search])
  return <><Header settings={settings} /><main>
    <section className="bg-[#ece8de]"><div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.1fr_.9fr] lg:px-10 lg:py-24"><div><p className="mb-4 text-[.65rem] font-semibold uppercase tracking-[.25em] text-clay sm:text-xs">{settings.eyebrow}</p><h1 className="max-w-4xl font-display text-4xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">{settings.heroTitle}</h1></div><div className="flex items-end"><p className="max-w-lg border-l border-ink/30 pl-4 text-base leading-7 text-ink/65 sm:pl-6 sm:text-lg sm:leading-8">{settings.heroText}</p></div></div></section>
    {settings.bannerText && <div className="border-y border-ink/15 bg-moss px-4 py-3 text-center text-xs text-white sm:text-sm"><span className="font-medium">{settings.bannerText}</span></div>}
    <section id="articulos" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-24"><div className="mb-8 flex items-end justify-between border-b border-ink/20 pb-5 sm:mb-12"><div><p className="text-[.65rem] font-semibold uppercase tracking-[.2em] text-clay sm:text-xs">Archivo</p><h2 className="mt-2 font-display text-3xl sm:text-4xl">Últimas historias</h2></div><span className="hidden text-sm text-ink/50 sm:block">{filteredArticles.length} {search ? 'resultados' : 'publicaciones'}</span></div><ArticleSearch value={search} onChange={setSearch} />{loading && <p className="py-16 text-center text-ink/60">Cargando historias…</p>}{error && <p className="py-16 text-center text-clay">{error}</p>}{!loading && !error && articles.length === 0 && <p className="py-16 text-center text-ink/60">Todavía no hay artículos publicados.</p>}{!loading && !error && articles.length > 0 && filteredArticles.length === 0 && <p className="py-16 text-center text-ink/60">No encontramos artículos para “{search}”.</p>}<div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">{filteredArticles.map((article, index) => <ArticleCard key={article._id} article={article} index={index} />)}</div></section>
    <section id="acerca" className="mt-4 bg-ink text-paper sm:mt-8"><div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-3 lg:px-10 lg:py-24"><p className="text-[.65rem] font-semibold uppercase tracking-[.2em] text-clay sm:text-xs">Acerca de este medio</p><p className="font-display text-2xl leading-snug sm:text-3xl lg:col-span-2">{settings.aboutText}</p></div></section>
  </main><Footer settings={settings} /></>
}

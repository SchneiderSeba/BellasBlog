import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, GripVertical, LogOut, Menu, Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { api } from './api'
import type { Article, SiteSettings } from './types'

const emptySettings: SiteSettings = { siteName: 'Bellas', eyebrow: '', heroTitle: '', heroText: '', bannerText: '', aboutText: '' }
const emptyArticle: Partial<Article> = { title: '', excerpt: '', content: '', author: '', category: '', imageUrl: '', imageAlt: '', published: true }

function usePublicData() {
  const [articles, setArticles] = useState<Article[]>([])
  const [settings, setSettings] = useState<SiteSettings>(emptySettings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([api.getArticles(), api.getSettings()])
      .then(([loadedArticles, loadedSettings]) => {
        setArticles(loadedArticles)
        setSettings(loadedSettings)
      })
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [])
  return { articles, settings, loading, error }
}

function Header({ settings, admin = false, onLogout }: { settings: SiteSettings; admin?: boolean; onLogout?: () => void }) {
  const [open, setOpen] = useState(false)
  return <header className="border-b border-ink/15 bg-paper/95 sticky top-0 z-40 backdrop-blur">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-10">
      <Link to={admin ? '/admin' : '/'} className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{settings.siteName}</Link>
      <nav className="hidden items-center gap-8 text-sm md:flex">
        <Link className="hover:text-clay" to="/">Portada</Link><a className="hover:text-clay" href="/#articulos">Artículos</a><a className="hover:text-clay" href="/#acerca">Acerca</a>
        {admin && <button onClick={onLogout} className="flex items-center gap-2 border-l border-ink/20 pl-8 hover:text-clay"><LogOut size={15}/> Salir</button>}
      </nav>
      <button aria-label="Abrir menú" className="md:hidden" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
    </div>
    {open && <nav className="space-y-4 border-t border-ink/10 bg-paper px-4 py-5 text-sm shadow-lg md:hidden"><Link className="block" to="/">Portada</Link><a className="block" href="/#articulos">Artículos</a><a className="block" href="/#acerca">Acerca</a>{admin && <button onClick={onLogout}>Cerrar sesión</button>}</nav>}
  </header>
}

function ArticleCard({ article, index }: { article: Article; index: number }) {
  return <article className={`group rounded-xl bg-white p-3 shadow-[0_2px_0_rgba(24,25,22,.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(24,25,22,.12)] sm:p-4 ${index === 0 ? 'md:col-span-2' : ''}`}>
    <Link to={`/articulos/${article.slug}`} className={`block overflow-hidden rounded-lg bg-ink/5 ${index === 0 ? 'aspect-[16/10] md:aspect-[16/8]' : 'aspect-[4/3]'}`}>
      <img src={article.imageUrl} alt={article.imageAlt} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"/>
    </Link>
    <div className="px-1 pb-1 pt-5">
      <div className="mb-3 flex items-center gap-3 text-xs font-medium uppercase tracking-[.16em] text-clay"><span>{article.category}</span><span className="h-px w-6 bg-clay/50"/><time>{new Date(article.publishedAt).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}</time></div>
      <h2 className={`font-display font-semibold leading-tight ${index === 0 ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-xl sm:text-2xl'}`}>{article.title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/65 sm:text-base sm:leading-7">{article.excerpt}</p>
      <Link to={`/articulos/${article.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider transition hover:gap-3 hover:text-clay">Leer artículo <ArrowRight size={15}/></Link>
    </div>
  </article>
}

function Home() {
  const { articles, settings, loading, error } = usePublicData()
  return <><Header settings={settings}/><main>
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.1fr_.9fr] lg:px-10 lg:py-24">
      <div><p className="mb-4 text-[.65rem] font-semibold uppercase tracking-[.25em] text-clay sm:text-xs">{settings.eyebrow}</p><h1 className="max-w-4xl font-display text-4xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">{settings.heroTitle}</h1></div>
      <div className="flex items-end"><p className="max-w-lg border-l border-ink/30 pl-4 text-base leading-7 text-ink/65 sm:pl-6 sm:text-lg sm:leading-8">{settings.heroText}</p></div>
    </section>
    {settings.bannerText && <div className="border-y border-ink/15 bg-moss px-4 py-3 text-center text-xs text-white sm:text-sm"><span className="font-medium">{settings.bannerText}</span></div>}
    <section id="articulos" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-24">
      <div className="mb-8 flex items-end justify-between border-b border-ink/20 pb-5 sm:mb-12"><div><p className="text-[.65rem] font-semibold uppercase tracking-[.2em] text-clay sm:text-xs">Archivo</p><h2 className="mt-2 font-display text-3xl sm:text-4xl">Últimas historias</h2></div><span className="hidden text-sm text-ink/50 sm:block">{articles.length} publicaciones</span></div>
      {loading && <p className="py-16 text-center text-ink/60">Cargando historias…</p>}
      {error && <p className="py-16 text-center text-clay">{error}</p>}
      {!loading && !error && articles.length === 0 && <p className="py-16 text-center text-ink/60">Todavía no hay artículos publicados.</p>}
      <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">{articles.map((a, i) => <ArticleCard key={a._id} article={a} index={i}/>)}</div>
    </section>
    <section id="acerca" className="mt-4 bg-ink text-paper sm:mt-8"><div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-3 lg:px-10 lg:py-24"><p className="text-[.65rem] font-semibold uppercase tracking-[.2em] text-clay sm:text-xs">Acerca de este medio</p><p className="font-display text-2xl leading-snug sm:text-3xl lg:col-span-2">{settings.aboutText}</p></div></section>
  </main><Footer settings={settings}/></>
}

function Footer({ settings }: { settings: SiteSettings }) { return <footer className="border-t border-paper/10 bg-ink text-paper"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 py-8 text-sm text-paper/55 sm:flex-row sm:px-6 lg:px-10"><span>© {new Date().getFullYear()} {settings.siteName}</span><span>Periodismo independiente</span></div></footer> }

function ArticlePage() {
  const { slug = '' } = useParams(); const [article, setArticle] = useState<Article>(); const [settings, setSettings] = useState(emptySettings); const [error, setError] = useState('')
  useEffect(() => { Promise.all([api.getArticle(slug), api.getSettings()]).then(([a, s]) => { setArticle(a); setSettings(s) }).catch((e: Error) => setError(e.message)) }, [slug])
  if (error) return <><Header settings={settings}/><main className="mx-auto max-w-3xl px-5 py-24"><h1 className="font-display text-4xl">Artículo no encontrado</h1><Link to="/" className="mt-8 inline-flex gap-2"><ArrowLeft/> Volver</Link></main></>
  if (!article) return <p className="p-12 text-center">Cargando…</p>
  return <><Header settings={settings}/><main><article>
    <header className="mx-auto max-w-5xl px-5 py-16 text-center lg:py-24"><p className="text-xs font-semibold uppercase tracking-[.2em] text-clay">{article.category}</p><h1 className="mt-5 font-display text-4xl font-semibold leading-tight sm:text-6xl">{article.title}</h1><p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-ink/60">{article.excerpt}</p><div className="mt-8 text-sm text-ink/55">Por {article.author} · {new Date(article.publishedAt).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}</div></header>
    <div className="mx-auto max-w-6xl px-5"><img src={article.imageUrl} alt={article.imageAlt} className="max-h-[680px] w-full object-cover"/></div>
    <div className="article-body mx-auto max-w-2xl whitespace-pre-line px-5 py-16 font-display text-[1.18rem] leading-9 text-ink/85 lg:py-24">{article.content}</div>
  </article></main><Footer settings={settings}/></>
}

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  const submit = async (e: FormEvent) => { e.preventDefault(); setBusy(true); setError(''); try { await api.login(username, password); onLogin() } catch (err) { setError((err as Error).message) } finally { setBusy(false) } }
  return <main className="grid min-h-screen place-items-center bg-ink px-5"><form onSubmit={submit} className="w-full max-w-md bg-paper p-8 sm:p-10"><Link to="/" className="font-display text-3xl">Bellas</Link><p className="mt-12 text-xs font-semibold uppercase tracking-[.2em] text-clay">Área privada</p><h1 className="mt-2 font-display text-4xl">Acceso editorial</h1><div className="mt-8 space-y-4"><label className="block text-sm">Usuario<input className="editor-input mt-2" autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} required/></label><label className="block text-sm">Contraseña<input type="password" className="editor-input mt-2" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required/></label></div>{error && <p className="mt-4 text-sm text-clay">{error}</p>}<button disabled={busy} className="mt-7 w-full bg-clay px-5 py-3 font-semibold text-white disabled:opacity-50">{busy ? 'Accediendo…' : 'Entrar'}</button><Link to="/" className="mt-6 block text-center text-sm text-ink/55">Volver al sitio</Link></form></main>
}

function ArticleEditor({ article, onClose, onSaved }: { article?: Article; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<Partial<Article>>(article || emptyArticle); const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  const change = (key: keyof Article, value: string | boolean) => setForm(f => ({ ...f, [key]: value }))
  const upload = async (file?: File) => { if (!file) return; setBusy(true); try { const result = await api.uploadImage(file); change('imageUrl', result.imageUrl) } catch (e) { setError((e as Error).message) } finally { setBusy(false) } }
  const submit = async (e: FormEvent) => { e.preventDefault(); setBusy(true); setError(''); try { await api.saveArticle(form); onSaved() } catch (err) { setError((err as Error).message) } finally { setBusy(false) } }
  return <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/60 p-4 sm:p-8"><form onSubmit={submit} className="mx-auto max-w-3xl bg-paper p-6 shadow-2xl sm:p-10"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-clay">Editor</p><h2 className="mt-1 font-display text-3xl">{article ? 'Editar artículo' : 'Nueva historia'}</h2></div><button type="button" aria-label="Cerrar" onClick={onClose}><X/></button></div>
    <div className="mt-8 grid gap-5 sm:grid-cols-2"><label className="sm:col-span-2 text-sm">Título<input className="editor-input mt-2" value={form.title || ''} onChange={e => change('title', e.target.value)} required/></label><label className="text-sm">Autor<input className="editor-input mt-2" value={form.author || ''} onChange={e => change('author', e.target.value)} required/></label><label className="text-sm">Categoría<input className="editor-input mt-2" value={form.category || ''} onChange={e => change('category', e.target.value)} required/></label><label className="sm:col-span-2 text-sm">Resumen<textarea className="editor-input mt-2 min-h-24" value={form.excerpt || ''} onChange={e => change('excerpt', e.target.value)} required/></label><label className="sm:col-span-2 text-sm">Contenido<textarea className="editor-input mt-2 min-h-64" value={form.content || ''} onChange={e => change('content', e.target.value)} required/></label><label className="sm:col-span-2 text-sm">Imagen<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="editor-input mt-2" onChange={e => upload(e.target.files?.[0])}/></label>{form.imageUrl && <img src={form.imageUrl} alt="Vista previa" className="sm:col-span-2 h-52 w-full object-cover"/>}<label className="sm:col-span-2 text-sm">Texto alternativo<input className="editor-input mt-2" value={form.imageAlt || ''} onChange={e => change('imageAlt', e.target.value)} required/></label><label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={form.published ?? true} onChange={e => change('published', e.target.checked)}/> Publicado</label></div>
    {error && <p className="mt-5 text-sm text-clay">{error}</p>}<div className="mt-8 flex justify-end gap-3"><button type="button" onClick={onClose} className="border border-ink/20 px-5 py-3">Cancelar</button><button disabled={busy} className="flex items-center gap-2 bg-clay px-5 py-3 font-semibold text-white disabled:opacity-50"><Save size={17}/> Guardar</button></div>
  </form></div>
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [articles, setArticles] = useState<Article[]>([]); const [settings, setSettings] = useState(emptySettings); const [editing, setEditing] = useState<Article | null | undefined>(); const [message, setMessage] = useState(''); const [dragId, setDragId] = useState('')
  const load = useCallback(() => Promise.all([api.getArticles(true), api.getSettings()]).then(([a, s]) => { setArticles(a); setSettings(s) }), [])
  useEffect(() => { load().catch((e: Error) => setMessage(e.message)) }, [load])
  const saveSettings = async () => { try { await api.saveSettings(settings); setMessage('Cambios del sitio guardados.') } catch (e) { setMessage((e as Error).message) } }
  const remove = async (id: string) => { if (!window.confirm('¿Eliminar este artículo? Esta acción no se puede deshacer.')) return; try { await api.deleteArticle(id); await load() } catch (e) { setMessage((e as Error).message) } }
  const drop = async (target: string) => { if (!dragId || dragId === target) return; const next = [...articles]; const from = next.findIndex(a => a._id === dragId); const to = next.findIndex(a => a._id === target); const [moved] = next.splice(from, 1); next.splice(to, 0, moved); setArticles(next); setDragId(''); try { await api.reorder(next.map(a => a._id)) } catch (e) { setMessage((e as Error).message); load() } }
  return <><Header settings={settings} admin onLogout={onLogout}/><main className="mx-auto max-w-7xl px-5 py-12 lg:px-10">
    <div className="flex flex-col justify-between gap-5 border-b border-ink/20 pb-8 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-clay">Panel editorial</p><h1 className="mt-2 font-display text-4xl">Gestiona tu publicación</h1></div><button onClick={() => setEditing(null)} className="flex items-center justify-center gap-2 bg-clay px-5 py-3 font-semibold text-white"><Plus size={18}/> Nuevo artículo</button></div>
    {message && <div className="mt-6 flex justify-between bg-white p-4 text-sm"><span>{message}</span><button onClick={() => setMessage('')}><X size={16}/></button></div>}
    <section className="mt-12"><h2 className="font-display text-3xl">Portada y textos</h2><div className="mt-6 grid gap-5 bg-white p-6 sm:grid-cols-2 lg:p-8">{([['siteName','Nombre del sitio'],['eyebrow','Antetítulo'],['heroTitle','Título principal'],['bannerText','Banner']] as const).map(([key, label]) => <label key={key} className="text-sm">{label}<input className="editor-input mt-2" value={settings[key]} onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}/></label>)}<label className="sm:col-span-2 text-sm">Texto de portada<textarea className="editor-input mt-2 min-h-24" value={settings.heroText} onChange={e => setSettings(s => ({ ...s, heroText: e.target.value }))}/></label><label className="sm:col-span-2 text-sm">Texto “Acerca de”<textarea className="editor-input mt-2 min-h-24" value={settings.aboutText} onChange={e => setSettings(s => ({ ...s, aboutText: e.target.value }))}/></label><div className="sm:col-span-2"><button onClick={saveSettings} className="flex items-center gap-2 bg-ink px-5 py-3 text-white"><Save size={17}/> Guardar textos</button></div></div></section>
    <section className="mt-14"><div className="flex items-end justify-between"><div><h2 className="font-display text-3xl">Artículos</h2><p className="mt-2 text-sm text-ink/55">Arrastra las filas para cambiar el orden de portada.</p></div><span className="text-sm text-ink/50">{articles.length} artículos</span></div><div className="mt-6 space-y-3">{articles.map(a => <div key={a._id} draggable onDragStart={() => setDragId(a._id)} onDragOver={e => e.preventDefault()} onDrop={() => drop(a._id)} className="grid cursor-move grid-cols-[auto_70px_1fr_auto] items-center gap-4 bg-white p-3 sm:grid-cols-[auto_110px_1fr_auto]"><GripVertical className="text-ink/30"/><img src={a.imageUrl} alt="" className="h-16 w-full object-cover sm:h-20"/><div className="min-w-0"><div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${a.published ? 'bg-moss' : 'bg-ink/25'}`}/><span className="text-xs uppercase tracking-wider text-ink/50">{a.category}</span></div><h3 className="mt-1 truncate font-display text-lg sm:text-xl">{a.title}</h3></div><div className="flex gap-1"><button aria-label="Editar" onClick={() => setEditing(a)} className="p-2 hover:text-clay"><Pencil size={18}/></button><button aria-label="Eliminar" onClick={() => remove(a._id)} className="p-2 hover:text-clay"><Trash2 size={18}/></button></div></div>)}</div></section>
  </main>{editing !== undefined && <ArticleEditor article={editing || undefined} onClose={() => setEditing(undefined)} onSaved={async () => { setEditing(undefined); await load(); setMessage('Artículo guardado.') }}/>}</>
}

function Admin() {
  const [authenticated, setAuthenticated] = useState<boolean>(); const navigate = useNavigate()
  useEffect(() => { api.session().then(s => setAuthenticated(s.authenticated)).catch(() => setAuthenticated(false)) }, [])
  const logout = async () => { await api.logout(); setAuthenticated(false); navigate('/admin') }
  if (authenticated === undefined) return <p className="p-12 text-center">Comprobando sesión…</p>
  return authenticated ? <AdminDashboard onLogout={logout}/> : <AdminLogin onLogin={() => setAuthenticated(true)}/>
}

export default function App() { return <Routes><Route path="/" element={<Home/>}/><Route path="/articulos/:slug" element={<ArticlePage/>}/><Route path="/admin" element={<Admin/>}/><Route path="*" element={<Home/>}/></Routes> }

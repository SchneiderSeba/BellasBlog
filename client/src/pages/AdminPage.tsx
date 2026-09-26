import { useCallback, useEffect, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { ArticleEditor } from '../components/admin/ArticleEditor'
import { ArticleList } from '../components/admin/ArticleList'
import { AdminLogin } from '../components/admin/AdminLogin'
import { SiteSettingsEditor } from '../components/admin/SiteSettingsEditor'
import { Header } from '../components/layout/Header'
import { emptySettings } from '../constants'
import type { Article, SiteSettings } from '../types'

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [articles, setArticles] = useState<Article[]>([])
  const [settings, setSettings] = useState<SiteSettings>(emptySettings)
  const [editing, setEditing] = useState<Article | null | undefined>()
  const [message, setMessage] = useState('')
  const [dragId, setDragId] = useState('')
  const load = useCallback(() => Promise.all([api.getArticles(true), api.getSettings()]).then(([loadedArticles, loadedSettings]) => { setArticles(loadedArticles); setSettings(loadedSettings) }), [])
  useEffect(() => { load().catch((requestError: Error) => setMessage(requestError.message)) }, [load])
  const saveSettings = async () => { try { await api.saveSettings(settings); setMessage('Cambios del sitio guardados.') } catch (requestError) { setMessage((requestError as Error).message) } }
  const remove = async (id: string) => { if (!window.confirm('¿Eliminar este artículo? Esta acción no se puede deshacer.')) return; try { await api.deleteArticle(id); await load() } catch (requestError) { setMessage((requestError as Error).message) } }
  const drop = async (target: string) => { if (!dragId || dragId === target) return; const next = [...articles]; const from = next.findIndex(article => article._id === dragId); const to = next.findIndex(article => article._id === target); const [moved] = next.splice(from, 1); next.splice(to, 0, moved); setArticles(next); setDragId(''); try { await api.reorder(next.map(article => article._id)) } catch (requestError) { setMessage((requestError as Error).message); load() } }
  return <><Header settings={settings} admin onLogout={onLogout} /><main className="mx-auto max-w-7xl px-5 py-12 lg:px-10"><div className="flex flex-col justify-between gap-5 border-b border-ink/20 pb-8 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-clay">Panel editorial</p><h1 className="mt-2 font-display text-4xl">Gestiona tu publicación</h1></div><button onClick={() => setEditing(null)} className="flex items-center justify-center gap-2 bg-clay px-5 py-3 font-semibold text-white"><Plus size={18} /> Nuevo artículo</button></div>{message && <div className="mt-6 flex justify-between bg-white p-4 text-sm"><span>{message}</span><button onClick={() => setMessage('')}><X size={16} /></button></div>}<SiteSettingsEditor settings={settings} onChange={setSettings} onSave={saveSettings} /><ArticleList articles={articles} onEdit={setEditing} onRemove={remove} onDragStart={setDragId} onReorder={drop} /></main>{editing !== undefined && <ArticleEditor article={editing || undefined} onClose={() => setEditing(undefined)} onSaved={async () => { setEditing(undefined); await load(); setMessage('Artículo guardado.') }} />}</>
}

export function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean>()
  const navigate = useNavigate()
  useEffect(() => { api.session().then(session => setAuthenticated(session.authenticated)).catch(() => setAuthenticated(false)) }, [])
  const logout = async () => { await api.logout(); setAuthenticated(false); navigate('/admin') }
  if (authenticated === undefined) return <p className="p-12 text-center">Comprobando sesión…</p>
  return authenticated ? <AdminDashboard onLogout={logout} /> : <AdminLogin onLogin={() => setAuthenticated(true)} />
}

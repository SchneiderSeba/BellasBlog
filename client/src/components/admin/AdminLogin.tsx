import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api'

export function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  const submit = async (event: FormEvent) => { event.preventDefault(); setBusy(true); setError(''); try { await api.login(username, password); onLogin() } catch (requestError) { setError((requestError as Error).message) } finally { setBusy(false) } }
  return <main className="grid min-h-screen place-items-center bg-ink px-5"><form onSubmit={submit} className="w-full max-w-md bg-paper p-8 sm:p-10"><Link to="/" className="font-display text-3xl">Bellas</Link><p className="mt-12 text-xs font-semibold uppercase tracking-[.2em] text-clay">Área privada</p><h1 className="mt-2 font-display text-4xl">Acceso editorial</h1><div className="mt-8 space-y-4"><label className="block text-sm">Usuario<input className="editor-input mt-2" autoComplete="username" value={username} onChange={event => setUsername(event.target.value)} required /></label><label className="block text-sm">Contraseña<input type="password" className="editor-input mt-2" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required /></label></div>{error && <p className="mt-4 text-sm text-clay">{error}</p>}<button disabled={busy} className="mt-7 w-full bg-clay px-5 py-3 font-semibold text-white disabled:opacity-50">{busy ? 'Accediendo…' : 'Entrar'}</button><Link to="/" className="mt-6 block text-center text-sm text-ink/55">Volver al sitio</Link></form></main>
}

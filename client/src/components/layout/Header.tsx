import { useState } from 'react'
import { LogOut, Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { SiteSettings } from '../../types'

interface HeaderProps {
  settings: SiteSettings
  admin?: boolean
  onLogout?: () => void
}

export function Header({ settings, admin = false, onLogout }: HeaderProps) {
  const [open, setOpen] = useState(false)

  return <header className="sticky top-0 z-40 border-b border-ink/20 bg-[#ded8ca]/95 backdrop-blur">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-10">
      <Link to={admin ? '/admin' : '/'} className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{settings.siteName}</Link>
      <nav className="hidden items-center gap-8 text-sm md:flex">
        <Link className="hover:text-clay" to="/">Portada</Link><a className="hover:text-clay" href="/#articulos">Artículos</a><a className="hover:text-clay" href="/#acerca">Acerca</a>
        {admin && <button onClick={onLogout} className="flex items-center gap-2 border-l border-ink/20 pl-8 hover:text-clay"><LogOut size={15} /> Salir</button>}
      </nav>
      <button aria-label="Abrir menú" className="md:hidden" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    </div>
    {open && <nav className="space-y-4 border-t border-ink/15 bg-[#ded8ca] px-4 py-5 text-sm shadow-lg md:hidden"><Link className="block" to="/">Portada</Link><a className="block" href="/#articulos">Artículos</a><a className="block" href="/#acerca">Acerca</a>{admin && <button onClick={onLogout}>Cerrar sesión</button>}</nav>}
  </header>
}

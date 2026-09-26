import type { SiteSettings } from '../../types'

export function Footer({ settings }: { settings: SiteSettings }) {
  return <footer className="border-t border-paper/10 bg-ink text-paper"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 py-8 text-sm text-paper/55 sm:flex-row sm:px-6 lg:px-10"><span>© {new Date().getFullYear()} {settings.siteName}</span><span>Periodismo independiente</span></div></footer>
}

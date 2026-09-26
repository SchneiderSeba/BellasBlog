import { Save } from 'lucide-react'
import type { SiteSettings } from '../../types'

interface SiteSettingsEditorProps {
  settings: SiteSettings
  onChange: (settings: SiteSettings) => void
  onSave: () => void
}

export function SiteSettingsEditor({ settings, onChange, onSave }: SiteSettingsEditorProps) {
  const update = (key: keyof SiteSettings, value: string) => onChange({ ...settings, [key]: value })
  return <section className="mt-12"><h2 className="font-display text-3xl">Portada y textos</h2><div className="mt-6 grid gap-5 bg-white p-6 sm:grid-cols-2 lg:p-8">{([['siteName', 'Nombre del sitio'], ['eyebrow', 'Antetítulo'], ['heroTitle', 'Título principal'], ['bannerText', 'Banner']] as const).map(([key, label]) => <label key={key} className="text-sm">{label}<input className="editor-input mt-2" value={settings[key]} onChange={event => update(key, event.target.value)} /></label>)}<label className="text-sm sm:col-span-2">Texto de portada<textarea className="editor-input mt-2 min-h-24" value={settings.heroText} onChange={event => update('heroText', event.target.value)} /></label><label className="text-sm sm:col-span-2">Texto “Acerca de”<textarea className="editor-input mt-2 min-h-24" value={settings.aboutText} onChange={event => update('aboutText', event.target.value)} /></label><div className="sm:col-span-2"><button onClick={onSave} className="flex items-center gap-2 bg-ink px-5 py-3 text-white"><Save size={17} /> Guardar textos</button></div></div></section>
}

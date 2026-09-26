import { Search, X } from 'lucide-react'

interface ArticleSearchProps {
  value: string
  onChange: (value: string) => void
}

export function ArticleSearch({ value, onChange }: ArticleSearchProps) {
  return <div className="relative mb-8 sm:mb-12">
    <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/45" size={19} />
    <input
      type="search"
      value={value}
      onChange={event => onChange(event.target.value)}
      placeholder="Buscar artículos por título, tema o autor"
      aria-label="Buscar artículos"
      className="w-full rounded-lg border border-ink/20 bg-white py-3 pl-11 pr-11 text-sm outline-none transition placeholder:text-ink/40 focus:border-clay focus:ring-2 focus:ring-clay/15 sm:text-base"
    />
    {value && <button type="button" onClick={() => onChange('')} aria-label="Limpiar búsqueda" className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ink/50 transition hover:text-clay"><X size={18} /></button>}
  </div>
}

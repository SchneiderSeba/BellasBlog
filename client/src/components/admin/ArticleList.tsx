import { GripVertical, Pencil, Trash2 } from 'lucide-react'
import type { Article } from '../../types'

interface ArticleListProps {
  articles: Article[]
  onEdit: (article: Article) => void
  onRemove: (id: string) => void
  onReorder: (targetId: string) => void
  onDragStart: (id: string) => void
}

export function ArticleList({ articles, onEdit, onRemove, onReorder, onDragStart }: ArticleListProps) {
  return <section className="mt-14"><div className="flex items-end justify-between"><div><h2 className="font-display text-3xl">Artículos</h2><p className="mt-2 text-sm text-ink/55">Arrastra las filas para cambiar el orden de portada.</p></div><span className="text-sm text-ink/50">{articles.length} artículos</span></div><div className="mt-6 space-y-3">{articles.map(article => <div key={article._id} draggable onDragStart={() => onDragStart(article._id)} onDragOver={event => event.preventDefault()} onDrop={() => onReorder(article._id)} className="grid cursor-move grid-cols-[auto_70px_1fr_auto] items-center gap-4 bg-white p-3 sm:grid-cols-[auto_110px_1fr_auto]"><GripVertical className="text-ink/30" /><img src={article.imageUrl} alt="" className="h-16 w-full object-cover sm:h-20" /><div className="min-w-0"><div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${article.published ? 'bg-moss' : 'bg-ink/25'}`} /><span className="text-xs uppercase tracking-wider text-ink/50">{article.category}</span></div><h3 className="mt-1 truncate font-display text-lg sm:text-xl">{article.title}</h3></div><div className="flex gap-1"><button aria-label="Editar" onClick={() => onEdit(article)} className="p-2 hover:text-clay"><Pencil size={18} /></button><button aria-label="Eliminar" onClick={() => onRemove(article._id)} className="p-2 hover:text-clay"><Trash2 size={18} /></button></div></div>)}</div></section>
}

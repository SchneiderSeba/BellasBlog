import type { Article, SiteSettings } from './types'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, { credentials: 'include', ...options })
  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: 'Error inesperado' }))
    throw new Error(body.message || 'Error inesperado')
  }
  return response.status === 204 ? (undefined as T) : response.json()
}

export const api = {
  getArticles: (admin = false) => request<Article[]>(`/articles${admin ? '?admin=true' : ''}`),
  getArticle: (slug: string) => request<Article>(`/articles/${slug}`),
  getSettings: () => request<SiteSettings>('/settings'),
  login: (username: string, password: string) => request<{ username: string }>('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) }),
  logout: () => request<void>('/auth/logout', { method: 'POST' }),
  session: () => request<{ authenticated: boolean; username?: string }>('/auth/session'),
  saveSettings: (settings: SiteSettings) => request<SiteSettings>('/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) }),
  saveArticle: (article: Partial<Article>) => request<Article>(article._id ? `/articles/${article._id}` : '/articles', { method: article._id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(article) }),
  deleteArticle: (id: string) => request<void>(`/articles/${id}`, { method: 'DELETE' }),
  reorder: (ids: string[]) => request<Article[]>('/articles/reorder', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids }) }),
  uploadImage: async (file: File) => {
    const form = new FormData(); form.append('image', file)
    return request<{ imageUrl: string }>('/images', { method: 'POST', body: form })
  },
}

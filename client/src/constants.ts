import type { Article, SiteSettings } from './types'

export const emptySettings: SiteSettings = {
  siteName: 'Bellas',
  eyebrow: '',
  heroTitle: '',
  heroText: '',
  bannerText: '',
  aboutText: '',
}

export const emptyArticle: Partial<Article> = {
  title: '',
  excerpt: '',
  content: '',
  author: '',
  category: '',
  imageUrl: '',
  imageAlt: '',
  published: true,
}

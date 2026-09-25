export interface Article {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  category: string
  imageUrl: string
  imageAlt: string
  position: number
  published: boolean
  publishedAt: string
}

export interface SiteSettings {
  siteName: string
  eyebrow: string
  heroTitle: string
  heroText: string
  bannerText: string
  aboutText: string
}

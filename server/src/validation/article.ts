import { z } from 'zod'
import { imageUrlPattern } from '../utils.js'

export const articleSchema = z.object({
  title: z.string().trim().min(3).max(180),
  excerpt: z.string().trim().min(10).max(500),
  content: z.string().trim().min(20),
  author: z.string().trim().min(2).max(100),
  category: z.string().trim().min(2).max(80),
  imageUrl: z.string().regex(imageUrlPattern),
  imageAlt: z.string().trim().min(2).max(180),
  published: z.boolean().default(true),
})

export const reorderSchema = z.object({
  ids: z.array(z.string().regex(/^[a-f\d]{24}$/i)).max(500),
})

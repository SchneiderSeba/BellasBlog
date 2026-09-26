import { z } from 'zod'

export const settingsSchema = z.object({
  siteName: z.string().trim().min(1).max(60),
  eyebrow: z.string().trim().max(100),
  heroTitle: z.string().trim().min(3).max(180),
  heroText: z.string().trim().min(3).max(600),
  bannerText: z.string().trim().max(240),
  aboutText: z.string().trim().min(3).max(1000),
})

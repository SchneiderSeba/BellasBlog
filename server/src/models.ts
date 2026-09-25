import { Schema, model } from 'mongoose'

const articleSchema = new Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  excerpt: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  author: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  imageId: { type: Schema.Types.ObjectId, ref: 'Image', required: true },
  imageAlt: { type: String, required: true, trim: true },
  position: { type: Number, required: true, default: 0, index: true },
  published: { type: Boolean, default: true, index: true },
  publishedAt: { type: Date, default: Date.now },
}, { timestamps: true })

const settingsSchema = new Schema({
  key: { type: String, unique: true, default: 'main' },
  siteName: { type: String, required: true },
  eyebrow: { type: String, required: true },
  heroTitle: { type: String, required: true },
  heroText: { type: String, required: true },
  bannerText: { type: String, default: '' },
  aboutText: { type: String, required: true },
}, { timestamps: true })

const imageSchema = new Schema({ data: { type: Buffer, required: true }, contentType: { type: String, required: true }, filename: { type: String, required: true } }, { timestamps: true })

export const Article = model('Article', articleSchema)
export const SiteSettings = model('SiteSettings', settingsSchema)
export const Image = model('Image', imageSchema)

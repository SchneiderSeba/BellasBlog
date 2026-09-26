import { Router } from 'express'
import mongoose from 'mongoose'
import { isAuthenticated, requireAdmin } from '../auth.js'
import { asyncRoute } from '../middleware/async-route.js'
import { Article, Image } from '../models.js'
import { serializeArticle } from '../serializers/article.js'
import { createSlug, imageIdFromUrl } from '../utils.js'
import { articleSchema, reorderSchema } from '../validation/article.js'

export const articlesRouter = Router()

articlesRouter.get('/', asyncRoute(async (req, res) => {
  const admin = req.query.admin === 'true' && isAuthenticated(req)
  const articles = await Article.find(admin ? {} : { published: true }).sort({ position: 1, publishedAt: -1 }).lean()
  res.json(articles.map(serializeArticle))
}))

articlesRouter.put('/reorder', requireAdmin, asyncRoute(async (req, res) => {
  const { ids } = reorderSchema.parse(req.body)
  await Article.bulkWrite(ids.map((id, position) => ({ updateOne: { filter: { _id: id }, update: { position } } })))
  const articles = await Article.find().sort({ position: 1 }).lean()
  res.json(articles.map(serializeArticle))
}))

articlesRouter.get('/:slug', asyncRoute(async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug, published: true }).lean()
  if (!article) {
    res.status(404).json({ message: 'Artículo no encontrado.' })
    return
  }
  res.json(serializeArticle(article))
}))

articlesRouter.post('/', requireAdmin, asyncRoute(async (req, res) => {
  const data = articleSchema.parse(req.body)
  const imageId = imageIdFromUrl(data.imageUrl)
  const max = await Article.findOne().sort({ position: -1 }).select('position').lean()
  const baseSlug = createSlug(data.title)
  let slug = baseSlug
  let suffix = 2
  while (await Article.exists({ slug })) slug = `${baseSlug}-${suffix++}`

  const article = await Article.create({ ...data, imageUrl: undefined, imageId, slug, position: (max?.position ?? -1) + 1 })
  res.status(201).json(serializeArticle(article.toObject()))
}))

articlesRouter.put('/:id', requireAdmin, asyncRoute(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ message: 'Identificador no válido.' })
    return
  }

  const data = articleSchema.parse(req.body)
  const imageId = imageIdFromUrl(data.imageUrl)
  const current = await Article.findById(req.params.id)
  if (!current) {
    res.status(404).json({ message: 'Artículo no encontrado.' })
    return
  }

  const wantedSlug = createSlug(data.title)
  const duplicate = await Article.exists({ slug: wantedSlug, _id: { $ne: current._id } })
  const slug = duplicate ? current.slug : wantedSlug
  const article = await Article.findByIdAndUpdate(req.params.id, { ...data, imageUrl: undefined, imageId, slug }, { new: true, runValidators: true })
  res.json(serializeArticle(article!.toObject()))
}))

articlesRouter.delete('/:id', requireAdmin, asyncRoute(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ message: 'Identificador no válido.' })
    return
  }

  const article = await Article.findByIdAndDelete(req.params.id)
  if (!article) {
    res.status(404).json({ message: 'Artículo no encontrado.' })
    return
  }

  const stillUsed = await Article.exists({ imageId: article.imageId })
  if (!stillUsed) await Image.findByIdAndDelete(article.imageId)
  res.status(204).end()
}))

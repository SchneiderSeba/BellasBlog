import { Router } from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import { requireAdmin } from '../auth.js'
import { asyncRoute } from '../middleware/async-route.js'
import { Image } from '../models.js'
import { imageUrl } from '../utils.js'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype)),
})

export const imagesRouter = Router()

imagesRouter.post('/', requireAdmin, upload.single('image'), asyncRoute(async (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: 'Selecciona una imagen JPG, PNG, WEBP o GIF de hasta 5 MB.' })
    return
  }

  const image = await Image.create({ data: req.file.buffer, contentType: req.file.mimetype, filename: req.file.originalname })
  res.status(201).json({ imageUrl: imageUrl(image._id) })
}))

imagesRouter.get('/:id', asyncRoute(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404).end()
    return
  }

  const image = await Image.findById(req.params.id)
  if (!image) {
    res.status(404).end()
    return
  }

  res.set({ 'Content-Type': image.contentType, 'Cache-Control': 'public, max-age=31536000, immutable' })
  res.end(Buffer.from(image.data))
}))

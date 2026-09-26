import { Router } from 'express'
import { requireAdmin } from '../auth.js'
import { asyncRoute } from '../middleware/async-route.js'
import { SiteSettings } from '../models.js'
import { settingsSchema } from '../validation/settings.js'

export const settingsRouter = Router()

settingsRouter.get('/', asyncRoute(async (_req, res) => {
  const settings = await SiteSettings.findOne({ key: 'main' }).lean()
  if (!settings) {
    res.status(404).json({ message: 'Configuración no encontrada. Ejecuta npm run seed.' })
    return
  }
  res.json(settings)
}))

settingsRouter.put('/', requireAdmin, asyncRoute(async (req, res) => {
  const data = settingsSchema.parse(req.body)
  const settings = await SiteSettings.findOneAndUpdate(
    { key: 'main' },
    { ...data, key: 'main' },
    { upsert: true, new: true, runValidators: true },
  )
  res.json(settings)
}))

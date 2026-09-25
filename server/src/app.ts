import cors from 'cors'
import cookieParser from 'cookie-parser'
import express, { type NextFunction, type Request, type Response } from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import mongoose from 'mongoose'
import multer from 'multer'
import { z } from 'zod'
import { clearSession, createToken, isAuthenticated, requireAdmin, setSession, validCredentials } from './auth.js'
import { config } from './config.js'
import { Article, Image, SiteSettings } from './models.js'
import { createSlug, imageUrl } from './utils.js'

const app = express()
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({ origin: config.clientUrl, credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())

const asyncRoute = (handler: (req: Request, res: Response, next: NextFunction) => Promise<void>) => (req: Request, res: Response, next: NextFunction) => { handler(req, res, next).catch(next) }
const articleSchema = z.object({ title: z.string().trim().min(3).max(180), excerpt: z.string().trim().min(10).max(500), content: z.string().trim().min(20), author: z.string().trim().min(2).max(100), category: z.string().trim().min(2).max(80), imageUrl: z.string().regex(/^\/api\/images\/[a-f\d]{24}$/i), imageAlt: z.string().trim().min(2).max(180), published: z.boolean().default(true) })
const settingsSchema = z.object({ siteName: z.string().trim().min(1).max(60), eyebrow: z.string().trim().max(100), heroTitle: z.string().trim().min(3).max(180), heroText: z.string().trim().min(3).max(600), bannerText: z.string().trim().max(240), aboutText: z.string().trim().min(3).max(1000) })
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false, message: { message: 'Demasiados intentos. Prueba nuevamente más tarde.' } })

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
app.post('/api/auth/login', loginLimiter, (req, res) => { const parsed = z.object({ username: z.string(), password: z.string() }).safeParse(req.body); if (!parsed.success || !validCredentials(parsed.data.username, parsed.data.password)) { res.status(401).json({ message: 'Usuario o contraseña incorrectos.' }); return } setSession(res, createToken()); res.json({ username: config.adminUsername }) })
app.post('/api/auth/logout', (_req, res) => { clearSession(res); res.status(204).end() })
app.get('/api/auth/session', (req, res) => res.json({ authenticated: isAuthenticated(req), ...(isAuthenticated(req) ? { username: config.adminUsername } : {}) }))

app.get('/api/settings', asyncRoute(async (_req, res) => { const settings = await SiteSettings.findOne({ key: 'main' }).lean(); if (!settings) { res.status(404).json({ message: 'Configuración no encontrada. Ejecuta npm run seed.' }); return } res.json(settings) }))
app.put('/api/settings', requireAdmin, asyncRoute(async (req, res) => { const data = settingsSchema.parse(req.body); const settings = await SiteSettings.findOneAndUpdate({ key: 'main' }, { ...data, key: 'main' }, { upsert: true, new: true, runValidators: true }); res.json(settings) }))

app.get('/api/articles', asyncRoute(async (req, res) => { const admin = req.query.admin === 'true' && isAuthenticated(req); const articles = await Article.find(admin ? {} : { published: true }).sort({ position: 1, publishedAt: -1 }).lean(); res.json(articles.map(a => ({ ...a, imageUrl: imageUrl(a.imageId), imageId: undefined }))) }))
app.put('/api/articles/reorder', requireAdmin, asyncRoute(async (req, res) => { const { ids } = z.object({ ids: z.array(z.string().regex(/^[a-f\d]{24}$/i)).max(500) }).parse(req.body); await Article.bulkWrite(ids.map((id, position) => ({ updateOne: { filter: { _id: id }, update: { position } } }))); const articles = await Article.find().sort({ position: 1 }).lean(); res.json(articles.map(a => ({ ...a, imageUrl: imageUrl(a.imageId), imageId: undefined }))) }))
app.get('/api/articles/:slug', asyncRoute(async (req, res) => { const article = await Article.findOne({ slug: req.params.slug, published: true }).lean(); if (!article) { res.status(404).json({ message: 'Artículo no encontrado.' }); return } res.json({ ...article, imageUrl: imageUrl(article.imageId), imageId: undefined }) }))
app.post('/api/articles', requireAdmin, asyncRoute(async (req, res) => { const data = articleSchema.parse(req.body); const imageId = data.imageUrl.split('/').pop(); const max = await Article.findOne().sort({ position: -1 }).select('position').lean(); const baseSlug = createSlug(data.title); let slug = baseSlug; let suffix = 2; while (await Article.exists({ slug })) slug = `${baseSlug}-${suffix++}`; const article = await Article.create({ ...data, imageUrl: undefined, imageId, slug, position: (max?.position ?? -1) + 1 }); res.status(201).json({ ...article.toObject(), imageUrl: imageUrl(article.imageId), imageId: undefined }) }))
app.put('/api/articles/:id', requireAdmin, asyncRoute(async (req, res) => { if (!mongoose.isValidObjectId(req.params.id)) { res.status(400).json({ message: 'Identificador no válido.' }); return } const data = articleSchema.parse(req.body); const imageId = data.imageUrl.split('/').pop(); const current = await Article.findById(req.params.id); if (!current) { res.status(404).json({ message: 'Artículo no encontrado.' }); return } const wantedSlug = createSlug(data.title); const duplicate = await Article.exists({ slug: wantedSlug, _id: { $ne: current._id } }); const slug = duplicate ? current.slug : wantedSlug; const article = await Article.findByIdAndUpdate(req.params.id, { ...data, imageUrl: undefined, imageId, slug }, { new: true, runValidators: true }); res.json({ ...article!.toObject(), imageUrl: imageUrl(article!.imageId), imageId: undefined }) }))
app.delete('/api/articles/:id', requireAdmin, asyncRoute(async (req, res) => { if (!mongoose.isValidObjectId(req.params.id)) { res.status(400).json({ message: 'Identificador no válido.' }); return } const article = await Article.findByIdAndDelete(req.params.id); if (!article) { res.status(404).json({ message: 'Artículo no encontrado.' }); return } const stillUsed = await Article.exists({ imageId: article.imageId }); if (!stillUsed) await Image.findByIdAndDelete(article.imageId); res.status(204).end() }))

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (_req, file, cb) => cb(null, ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype)) })
app.post('/api/images', requireAdmin, upload.single('image'), asyncRoute(async (req, res) => { if (!req.file) { res.status(400).json({ message: 'Selecciona una imagen JPG, PNG, WEBP o GIF de hasta 5 MB.' }); return } const image = await Image.create({ data: req.file.buffer, contentType: req.file.mimetype, filename: req.file.originalname }); res.status(201).json({ imageUrl: imageUrl(image._id) }) }))
app.get('/api/images/:id', asyncRoute(async (req, res) => { if (!mongoose.isValidObjectId(req.params.id)) { res.status(404).end(); return } const image = await Image.findById(req.params.id).lean(); if (!image) { res.status(404).end(); return } res.set({ 'Content-Type': image.contentType, 'Cache-Control': 'public, max-age=31536000, immutable' }); res.send(image.data) }))

app.use((_req, res) => res.status(404).json({ message: 'Ruta no encontrada.' }))
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => { if (error instanceof z.ZodError) { res.status(400).json({ message: error.issues[0]?.message || 'Datos no válidos.' }); return } if (error instanceof multer.MulterError) { res.status(400).json({ message: error.code === 'LIMIT_FILE_SIZE' ? 'La imagen supera los 5 MB.' : error.message }); return } console.error(error); res.status(500).json({ message: 'No pudimos completar la solicitud.' }) })

export default app

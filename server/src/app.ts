import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { resolve } from 'node:path'
import { config } from './config.js'
import { errorHandler } from './middleware/error-handler.js'
import { articlesRouter } from './routes/articles.js'
import { authRouter } from './routes/auth.js'
import { imagesRouter } from './routes/images.js'
import { settingsRouter } from './routes/settings.js'

const app = express()
const clientDist = resolve(process.cwd(), '../client/dist')

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({ origin: config.clientUrl, credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRouter)
app.use('/api/settings', settingsRouter)
app.use('/api/articles', articlesRouter)
app.use('/api/images', imagesRouter)
app.use('/api', (_req, res) => res.status(404).json({ message: 'Ruta no encontrada.' }))

app.use(express.static(clientDist, { index: false, maxAge: config.production ? '1h' : 0 }))
app.get('/{*splat}', (_req, res) => res.sendFile('index.html', { root: clientDist }))
app.use(errorHandler)

export default app

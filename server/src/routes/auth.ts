import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { clearSession, createToken, sessionUsername, setSession, validCredentials } from '../auth.js'
import { asyncRoute } from '../middleware/async-route.js'
import { loginSchema } from '../validation/auth.js'

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados intentos. Prueba nuevamente más tarde.' },
})

export const authRouter = Router()

authRouter.post('/login', loginLimiter, asyncRoute(async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success || !await validCredentials(parsed.data.username, parsed.data.password)) {
    res.status(401).json({ message: 'Usuario o contraseña incorrectos.' })
    return
  }

  const username = parsed.data.username.trim().toLowerCase()
  setSession(res, createToken(username))
  res.json({ username })
}))

authRouter.post('/logout', (_req, res) => {
  clearSession(res)
  res.status(204).end()
})

authRouter.get('/session', (req, res) => {
  const username = sessionUsername(req)
  res.json({ authenticated: Boolean(username), ...(username ? { username } : {}) })
})

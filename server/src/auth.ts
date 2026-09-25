import crypto from 'node:crypto'
import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { config } from './config.js'

const COOKIE = 'bellas_session'

function safeEqual(a: string, b: string) {
  const left = crypto.createHash('sha256').update(a).digest()
  const right = crypto.createHash('sha256').update(b).digest()
  return crypto.timingSafeEqual(left, right)
}

export function validCredentials(username: string, password: string) { return safeEqual(username, config.adminUsername) && safeEqual(password, config.adminPassword) }
export function createToken() { return jwt.sign({ role: 'admin', username: config.adminUsername }, config.jwtSecret, { expiresIn: '8h' }) }
export function setSession(res: Response, token: string) { res.cookie(COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: config.production, maxAge: 8 * 60 * 60 * 1000, path: '/' }) }
export function clearSession(res: Response) { res.clearCookie(COOKIE, { httpOnly: true, sameSite: 'lax', secure: config.production, path: '/' }) }
export function isAuthenticated(req: Request) { try { const payload = jwt.verify(req.cookies?.[COOKIE] || '', config.jwtSecret) as { role?: string }; return payload.role === 'admin' } catch { return false } }
export function requireAdmin(req: Request, res: Response, next: NextFunction) { if (!isAuthenticated(req)) { res.status(401).json({ message: 'Sesión no válida o expirada.' }); return } next() }

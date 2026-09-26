import bcrypt from 'bcryptjs'
import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { config } from './config.js'
import { AdminUser } from './models.js'

const COOKIE = 'bellas_session'

export async function validCredentials(username: string, password: string) {
  const user = await AdminUser.findOne({ username: username.trim().toLowerCase() }).lean()
  return Boolean(user && await bcrypt.compare(password, user.passwordHash))
}
export function createToken(username: string) { return jwt.sign({ role: 'admin', username }, config.jwtSecret, { expiresIn: '8h' }) }
export function setSession(res: Response, token: string) { res.cookie(COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: config.production, maxAge: 8 * 60 * 60 * 1000, path: '/' }) }
export function clearSession(res: Response) { res.clearCookie(COOKIE, { httpOnly: true, sameSite: 'lax', secure: config.production, path: '/' }) }
export function sessionUsername(req: Request) { try { const payload = jwt.verify(req.cookies?.[COOKIE] || '', config.jwtSecret) as { role?: string; username?: string }; return payload.role === 'admin' && payload.username ? payload.username : undefined } catch { return undefined } }
export function isAuthenticated(req: Request) { return Boolean(sessionUsername(req)) }
export function requireAdmin(req: Request, res: Response, next: NextFunction) { if (!isAuthenticated(req)) { res.status(401).json({ message: 'Sesión no válida o expirada.' }); return } next() }

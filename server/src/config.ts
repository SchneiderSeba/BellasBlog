import dotenv from 'dotenv'
import { resolve } from 'node:path'

// Los scripts de workspace se ejecutan desde /server; la configuración del
// proyecto vive en la raíz. El segundo intento también cubre ejecuciones desde
// la raíz (por ejemplo, `node server/dist/index.js`).
dotenv.config({ path: resolve(process.cwd(), '../.env') })
dotenv.config()

export const config = {
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bellas_blog',
  jwtSecret: process.env.JWT_SECRET || 'local-development-secret-change-me',
  adminUsername: process.env.ADMIN_USERNAME || 'admin',
  adminPassword: process.env.ADMIN_PASSWORD || 'change-me',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  production: process.env.NODE_ENV === 'production',
}

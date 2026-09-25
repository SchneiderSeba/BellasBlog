import mongoose from 'mongoose'
import app from './app.js'
import { config } from './config.js'

async function start() {
  await mongoose.connect(config.mongoUri)
  app.listen(config.port, () => console.log(`API lista en http://localhost:${config.port}`))
}

start().catch(error => { console.error('No se pudo iniciar el servidor:', error); process.exit(1) })

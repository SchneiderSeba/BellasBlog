import type { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import { z } from 'zod'

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof z.ZodError) {
    res.status(400).json({ message: error.issues[0]?.message || 'Datos no válidos.' })
    return
  }

  if (error instanceof multer.MulterError) {
    res.status(400).json({ message: error.code === 'LIMIT_FILE_SIZE' ? 'La imagen supera los 5 MB.' : error.message })
    return
  }

  console.error(error)
  res.status(500).json({ message: 'No pudimos completar la solicitud.' })
}

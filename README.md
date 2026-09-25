# Bellas Blog

Sitio editorial para un periodista independiente, con web pública y panel de administración.

## Requisitos

- Node.js 20+
- MongoDB 7+ (local, Atlas o Docker)

## Inicio rápido

1. Copia `.env.example` como `.env` y cambia las credenciales.
2. Ejecuta `docker compose up -d` para iniciar MongoDB, o configura `MONGODB_URI`.
3. Ejecuta `npm install`.
4. Ejecuta `npm run seed` para cargar contenido inicial.
5. Ejecuta `npm run dev` y abre `http://localhost:5173`.

El panel está en `http://localhost:5173/admin`. Las imágenes se almacenan en MongoDB.

## Scripts

- `npm run dev`: inicia API y web.
- `npm run build`: compila ambos proyectos.
- `npm test`: ejecuta pruebas del servidor.
- `npm run lint`: valida el código.
- `npm run seed`: crea contenido inicial si la base está vacía.

# BellasBlog

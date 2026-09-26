export function createSlug(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function imageUrl(id: unknown): string {
  // La versión invalida respuestas antiguas de la misma imagen en el navegador.
  // Las imágenes nuevas siempre reciben otro ObjectId, por lo que esta versión
  // estable conserva el caché eficiente después de la primera carga correcta.
  return `/api/images/${String(id)}?v=1`
}

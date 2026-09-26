import { imageUrl } from '../utils.js'

type ArticleWithImage = { imageId: unknown }

export function serializeArticle<T extends ArticleWithImage>(article: T) {
  const { imageId, ...articleData } = article
  return { ...articleData, imageUrl: imageUrl(imageId) }
}

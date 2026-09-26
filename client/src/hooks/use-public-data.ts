import { useEffect, useState } from 'react'
import { api } from '../api'
import { emptySettings } from '../constants'
import type { Article, SiteSettings } from '../types'

export function usePublicData() {
  const [articles, setArticles] = useState<Article[]>([])
  const [settings, setSettings] = useState<SiteSettings>(emptySettings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([api.getArticles(), api.getSettings()])
      .then(([loadedArticles, loadedSettings]) => {
        setArticles(loadedArticles)
        setSettings(loadedSettings)
      })
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [])

  return { articles, settings, loading, error }
}

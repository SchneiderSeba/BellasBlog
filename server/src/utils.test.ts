import { describe, expect, it } from 'vitest'
import { createSlug, imageUrl } from './utils.js'

describe('createSlug', () => {
  it('normaliza acentos, espacios y signos', () => expect(createSlug('  Crónica: Un País Único  ')).toBe('cronica-un-pais-unico'))
  it('no deja guiones en los extremos', () => expect(createSlug('---Hola---')).toBe('hola'))
})

describe('imageUrl', () => { it('crea una ruta de API versionada', () => expect(imageUrl('abc')).toBe('/api/images/abc?v=1')) })

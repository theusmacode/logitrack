import { useCallback, useEffect, useState } from 'react'
import { fetchProductByCode, fetchProductMovements } from '../lib/products'
import type { Movement, Product } from '../types'

export function useProductDetails(code: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null)
  const [movements, setMovements] = useState<Movement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  const load = useCallback(async (silent = false) => {
    if (!code) return

    if (!silent) setLoading(true)
    setError(null)
    setNotFound(false)

    try {
      const found = await fetchProductByCode(code)
      if (!found) {
        setNotFound(true)
        setProduct(null)
        setMovements([])
        return
      }

      setProduct(found)
      setMovements(await fetchProductMovements(found.id))
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Não foi possível carregar o produto.'
      )
    } finally {
      setLoading(false)
    }
  }, [code])

  useEffect(() => {
    load()
  }, [load])

  return {
    product,
    movements,
    loading,
    error,
    notFound,
    refresh: () => load(true),
    setProduct,
  }
}

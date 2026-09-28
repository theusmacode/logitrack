import { useCallback, useEffect, useState } from 'react'
import { fetchAllMovements } from '../lib/products'
import type { MovementWithProduct } from '../types'

export function useMovements() {
  const [movements, setMovements] = useState<MovementWithProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setMovements(await fetchAllMovements())
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível carregar as movimentações.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { movements, loading, error, refresh: load }
}

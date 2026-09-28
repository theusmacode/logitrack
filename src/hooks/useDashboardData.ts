import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { DashboardStats, MovementWithProduct, Product } from '../types'

const RECENT_PRODUCTS_LIMIT = 5
const RECENT_MOVEMENTS_LIMIT = 5

type DashboardData = {
  stats: DashboardStats
  recentProducts: Product[]
  lowStockProducts: Product[]
  recentMovements: MovementWithProduct[]
}

const emptyData: DashboardData = {
  stats: { totalProducts: 0, totalStock: 0, lowStockCount: 0, totalMovements: 0 },
  recentProducts: [],
  lowStockProducts: [],
  recentMovements: [],
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>(emptyData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // As três consultas são independentes, então rodam em paralelo.
      const [productsResult, movementsCountResult, movementsResult] =
        await Promise.all([
          supabase
            .from('products')
            .select(
              'id, code, name, description, quantity, location, minimum_stock, created_at, updated_at'
            )
            .order('created_at', { ascending: false }),

          // count: 'exact', head: true -> só pede o total, sem baixar linhas.
          supabase
            .from('movements')
            .select('*', { count: 'exact', head: true }),

          // Embed do produto relacionado via product_id -> products.id
          supabase
            .from('movements')
            .select(
              'id, type, quantity, operator, created_at, product:products(code, name)'
            )
            .order('created_at', { ascending: false })
            .limit(RECENT_MOVEMENTS_LIMIT),
        ])

      if (productsResult.error) throw productsResult.error
      if (movementsCountResult.error) throw movementsCountResult.error
      if (movementsResult.error) throw movementsResult.error

      const products = (productsResult.data ?? []) as Product[]
      const totalStock = products.reduce((sum, p) => sum + p.quantity, 0)
      const lowStockProducts = products.filter(
        (p) => p.quantity <= p.minimum_stock
      )

      setData({
        stats: {
          totalProducts: products.length,
          totalStock,
          lowStockCount: lowStockProducts.length,
          totalMovements: movementsCountResult.count ?? 0,
        },
        recentProducts: products.slice(0, RECENT_PRODUCTS_LIMIT),
        lowStockProducts,
        recentMovements: (movementsResult.data ??
          []) as unknown as MovementWithProduct[],
      })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível carregar os dados do Dashboard.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { ...data, loading, error, refresh: load }
}

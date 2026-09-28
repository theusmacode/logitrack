import type { StockStatus } from '../types'

/**
 * Regra de negócio: quantity <= minimum_stock indica estoque baixo.
 * quantity === 0 é tratado como "sem estoque" (caso mais crítico dentro
 * do mesmo grupo de alerta).
 */
export function getStockStatus(
  quantity: number,
  minimumStock: number
): StockStatus {
  if (quantity <= 0) return 'sem_estoque'
  if (quantity <= minimumStock) return 'estoque_baixo'
  return 'em_estoque'
}

export function stockStatusLabel(status: StockStatus): string {
  switch (status) {
    case 'sem_estoque':
      return 'Sem estoque'
    case 'estoque_baixo':
      return 'Estoque baixo'
    case 'em_estoque':
      return 'Em estoque'
  }
}

import type { StockStatus } from '../../types'
import { stockStatusLabel } from '../../lib/stock'

function StatusBadge({ status }: { status: StockStatus }) {
  const isAlert = status !== 'em_estoque'

  return (
    <span className={`stock-badge ${isAlert ? 'stock-badge--low' : ''}`}>
      {stockStatusLabel(status)}
    </span>
  )
}

export default StatusBadge

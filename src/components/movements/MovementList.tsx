import type { MovementType } from '../../types'
import { formatDateTime } from '../../lib/format'
import EmptyState from '../ui/EmptyState'

export type MovementRow = {
  id: string
  type: MovementType
  quantity: number
  operator: string | null
  created_at: string
  product?: { code: string; name: string } | null
}

type MovementListProps = {
  movements: MovementRow[]
  showProduct?: boolean
  emptyMessage?: string
}

function MovementList({
  movements,
  showProduct = true,
  emptyMessage = 'Nenhuma movimentação registrada.',
}: MovementListProps) {
  if (movements.length === 0) {
    return <EmptyState icon="⇅" title="Nada por aqui" message={emptyMessage} />
  }

  return (
    <div className="movement-list">
      {movements.map((movement) => (
        <div
          key={movement.id}
          className={`movement-row ${!showProduct ? 'movement-row--compact' : ''}`}
        >
          <span
            className={`movement-type ${
              movement.type === 'entrada'
                ? 'movement-type--in'
                : 'movement-type--out'
            }`}
          >
            {movement.type === 'entrada' ? 'Entrada' : 'Saída'}
          </span>

          {showProduct && (
            <div className="movement-info">
              <strong>{movement.product?.name ?? 'Produto removido'}</strong>
              <span>{movement.product?.code ?? '—'}</span>
            </div>
          )}

          <div className="movement-meta">
            <strong>{movement.quantity} un.</strong>
            <span>{movement.operator ?? 'Operador não informado'}</span>
          </div>

          <span className="movement-date">
            {formatDateTime(movement.created_at)}
          </span>
        </div>
      ))}
    </div>
  )
}

export default MovementList

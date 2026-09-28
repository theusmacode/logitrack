import type { Product } from '../../types'
import { getStockStatus } from '../../lib/stock'
import StatusBadge from '../ui/StatusBadge'
import Button from '../ui/Button'

type ProductTableProps = {
  products: Product[]
  onViewDetails: (product: Product) => void
  onGenerateQr: (product: Product) => void
  onEntrada: (product: Product) => void
  onSaida: (product: Product) => void
}

function ProductTable({
  products,
  onViewDetails,
  onGenerateQr,
  onEntrada,
  onSaida,
}: ProductTableProps) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Código</th>
          <th>Produto</th>
          <th>Localização</th>
          <th>Quantidade</th>
          <th>Mínimo</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>

      <tbody>
        {products.map((product) => {
          const status = getStockStatus(product.quantity, product.minimum_stock)

          return (
            <tr key={product.id}>
              <td data-label="Código">
                <span className="mono">{product.code}</span>
              </td>
              <td data-label="Produto">{product.name}</td>
              <td data-label="Localização">{product.location || '—'}</td>
              <td data-label="Quantidade">
                <span className="mono">{product.quantity}</span>
              </td>
              <td data-label="Mínimo">
                <span className="mono">{product.minimum_stock}</span>
              </td>
              <td data-label="Status">
                <StatusBadge status={status} />
              </td>
              <td data-label="Ações">
                <div className="table-actions">
                  <Button variant="ghost" onClick={() => onViewDetails(product)}>
                    Ver detalhes
                  </Button>
                  <Button variant="ghost" onClick={() => onGenerateQr(product)}>
                    Gerar QR
                  </Button>
                  <Button variant="ghost" onClick={() => onEntrada(product)}>
                    Entrada
                  </Button>
                  <Button variant="ghost" onClick={() => onSaida(product)}>
                    Saída
                  </Button>
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default ProductTable

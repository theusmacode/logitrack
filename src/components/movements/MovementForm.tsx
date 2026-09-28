import { useState } from 'react'
import type { Product, MovementType } from '../../types'
import { registerMovement } from '../../lib/products'
import { getLastOperator, saveLastOperator } from '../../lib/operator'
import Button from '../ui/Button'

type MovementFormProps = {
  product: Product
  type: MovementType
  onSuccess: (updatedProduct: Product) => void
  onCancel: () => void
}

function MovementForm({ product, type, onSuccess, onCancel }: MovementFormProps) {
  const [quantity, setQuantity] = useState('')
  const [operator, setOperator] = useState(getLastOperator())
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const isSaida = type === 'saida'
  const parsedQuantity = Number(quantity)
  const quantityIsValid =
    quantity.trim() !== '' && Number.isInteger(parsedQuantity) && parsedQuantity > 0

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)

    if (!quantityIsValid) {
      setError('Informe uma quantidade inteira maior que zero.')
      return
    }

    if (isSaida && parsedQuantity > product.quantity) {
      setError(`Estoque insuficiente. Disponível: ${product.quantity} unidades.`)
      return
    }

    setSubmitting(true)
    try {
      const updated = await registerMovement({
        productId: product.id,
        type,
        quantity: parsedQuantity,
        operator,
      })
      saveLastOperator(operator)
      onSuccess(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível registrar.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-summary">
        <span>{product.code}</span>
        <strong>{product.name}</strong>
        <span>Estoque atual: {product.quantity} unidades</span>
      </div>

      <div className="form-field">
        <label htmlFor="movement-quantity">Quantidade</label>
        <input
          id="movement-quantity"
          type="number"
          min={1}
          step={1}
          inputMode="numeric"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          autoFocus
        />
      </div>

      <div className="form-field">
        <label htmlFor="movement-operator">Operador</label>
        <input
          id="movement-operator"
          type="text"
          placeholder="Seu nome"
          value={operator}
          onChange={(event) => setOperator(event.target.value)}
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type="submit"
          variant={isSaida ? 'danger' : 'primary'}
          disabled={submitting}
        >
          {submitting
            ? isSaida
              ? 'Registrando saída…'
              : 'Registrando entrada…'
            : `Confirmar ${isSaida ? 'saída' : 'entrada'}`}
        </Button>
      </div>
    </form>
  )
}

export default MovementForm

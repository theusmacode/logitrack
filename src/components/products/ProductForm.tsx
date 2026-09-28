import { useState } from 'react'
import type { Product } from '../../types'
import { createProduct } from '../../lib/products'
import Button from '../ui/Button'

type ProductFormProps = {
  onCreated: (product: Product) => void
}

type FormErrors = Partial<Record<'name' | 'quantity' | 'minimumStock', string>>

function ProductForm({ onCreated }: ProductFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [quantity, setQuantity] = useState('0')
  const [location, setLocation] = useState('')
  const [minimumStock, setMinimumStock] = useState('0')
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function validate(): FormErrors {
    const next: FormErrors = {}

    if (!name.trim()) {
      next.name = 'Informe o nome do produto.'
    }

    const parsedQuantity = Number(quantity)
    if (quantity.trim() === '' || !Number.isInteger(parsedQuantity) || parsedQuantity < 0) {
      next.quantity = 'Quantidade inicial deve ser um número inteiro ≥ 0.'
    }

    const parsedMinimum = Number(minimumStock)
    if (
      minimumStock.trim() === '' ||
      !Number.isInteger(parsedMinimum) ||
      parsedMinimum < 0
    ) {
      next.minimumStock = 'Estoque mínimo deve ser um número inteiro ≥ 0.'
    }

    return next
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitError(null)

    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    try {
      const product = await createProduct({
        name,
        description,
        quantity: Number(quantity),
        location,
        minimum_stock: Number(minimumStock),
      })
      onCreated(product)
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Não foi possível cadastrar o produto.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="product-name">Nome *</label>
        <input
          id="product-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="product-description">Descrição</label>
        <textarea
          id="product-description"
          rows={3}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="product-quantity">Quantidade inicial</label>
          <input
            id="product-quantity"
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            aria-invalid={Boolean(errors.quantity)}
          />
          {errors.quantity && (
            <span className="form-error">{errors.quantity}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="product-minimum-stock">Estoque mínimo</label>
          <input
            id="product-minimum-stock"
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={minimumStock}
            onChange={(event) => setMinimumStock(event.target.value)}
            aria-invalid={Boolean(errors.minimumStock)}
          />
          {errors.minimumStock && (
            <span className="form-error">{errors.minimumStock}</span>
          )}
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="product-location">Localização</label>
        <input
          id="product-location"
          type="text"
          placeholder="Ex.: Prateleira B3"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
        />
      </div>

      {submitError && <p className="form-error">{submitError}</p>}

      <div className="form-actions">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Salvando…' : 'Cadastrar produto'}
        </Button>
      </div>
    </form>
  )
}

export default ProductForm

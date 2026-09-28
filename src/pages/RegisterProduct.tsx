import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Product } from '../types'
import ProductForm from '../components/products/ProductForm'
import QRCodeDisplay from '../components/qr/QRCodeDisplay'
import Button from '../components/ui/Button'
import { useToast } from '../hooks/useToast'

function RegisterProduct() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [created, setCreated] = useState<Product | null>(null)

  function handleCreated(product: Product) {
    setCreated(product)
    showToast(`Produto ${product.code} cadastrado com sucesso.`, 'success')
  }

  if (created) {
    return (
      <div className="page-placeholder">
        <div className="success-panel">
          <span className="eyebrow">Produto cadastrado</span>
          <h3>{created.name}</h3>
          <p className="mono">{created.code}</p>

          <QRCodeDisplay code={created.code} />

          <div className="button-row">
            <Button variant="secondary" onClick={() => setCreated(null)}>
              Cadastrar outro produto
            </Button>
            <Button onClick={() => navigate(`/produtos/${created.code}`)}>
              Ver produto
            </Button>
          </div>

          <button className="text-button" onClick={() => navigate('/produtos')}>
            Voltar para produtos
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="welcome">
        <div>
          <span className="eyebrow">Estoque</span>
          <h3>Cadastrar produto</h3>
          <p>
            O código (LT-XXXXX) é gerado automaticamente pelo sistema ao
            salvar.
          </p>
        </div>
      </div>

      <div className="panel panel--form">
        <ProductForm onCreated={handleCreated} />
      </div>
    </>
  )
}

export default RegisterProduct

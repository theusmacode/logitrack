import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchProductByCode } from '../lib/products'
import { getStockStatus } from '../lib/stock'
import type { Product } from '../types'
import QRScanner from '../components/qr/QRScanner'
import StatusBadge from '../components/ui/StatusBadge'
import LoadingState from '../components/ui/LoadingState'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import MovementForm from '../components/movements/MovementForm'
import { useToast } from '../hooks/useToast'

function Scanner() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [movementType, setMovementType] = useState<'entrada' | 'saida' | null>(null)

  async function handleCodeDetected(code: string) {
    setSearching(true)
    setError(null)
    setProduct(null)

    try {
      const found = await fetchProductByCode(code)
      if (!found) {
        setError(`Nenhum produto encontrado com o código ${code}.`)
      } else {
        setProduct(found)
      }
    } catch (err) {
      console.error('Erro ao buscar produto no scanner:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Falha de rede ao buscar o produto. Tente novamente.'
      )
    } finally {
      setSearching(false)
    }
  }

  function handleMovementSuccess(updated: Product) {
    setProduct(updated)
    showToast(
      movementType === 'saida'
        ? 'Saída registrada com sucesso.'
        : 'Entrada registrada com sucesso.',
      'success'
    )
    setMovementType(null)
  }

  return (
    <>
      <div className="welcome">
        <div>
          <span className="eyebrow">Operação</span>
          <h3>Scanner QR</h3>
          <p>Aponte a câmera para o QR Code do produto para identificá-lo.</p>
        </div>
      </div>

      <div className="scanner-layout">
        <div className="panel">
          <QRScanner onCodeDetected={handleCodeDetected} />
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Resultado</span>
              <h3>Produto identificado</h3>
            </div>
          </div>

          {searching && <LoadingState label="Buscando produto…" />}

          {error && <p className="form-error">{error}</p>}

          {!searching && !error && !product && (
            <p>Nenhum produto lido ainda. Abra a câmera ou digite o código.</p>
          )}

          {product && !searching && (
            <div className="scan-result">
              <div className="scan-result-head">
                <div>
                  <span className="mono">{product.code}</span>
                  <h3>{product.name}</h3>
                </div>
                <StatusBadge
                  status={getStockStatus(product.quantity, product.minimum_stock)}
                />
              </div>

              <dl className="detail-grid">
                <div>
                  <dt>Estoque atual</dt>
                  <dd className="mono">{product.quantity} unidades</dd>
                </div>
                <div>
                  <dt>Localização</dt>
                  <dd>{product.location || '—'}</dd>
                </div>
              </dl>

              <div className="button-row">
                <Button onClick={() => setMovementType('entrada')}>
                  Registrar entrada
                </Button>
                <Button variant="danger" onClick={() => setMovementType('saida')}>
                  Registrar saída
                </Button>
              </div>

              <Button
                variant="secondary"
                onClick={() => navigate(`/produtos/${product.code}`)}
              >
                Ver detalhes e histórico
              </Button>
            </div>
          )}
        </div>
      </div>

      {product && movementType && (
        <Modal
          title={movementType === 'saida' ? 'Registrar saída' : 'Registrar entrada'}
          onClose={() => setMovementType(null)}
        >
          <MovementForm
            product={product}
            type={movementType}
            onSuccess={handleMovementSuccess}
            onCancel={() => setMovementType(null)}
          />
        </Modal>
      )}
    </>
  )
}

export default Scanner

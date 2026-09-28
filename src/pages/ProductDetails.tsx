import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProductDetails } from '../hooks/useProductDetails'
import { getStockStatus } from '../lib/stock'
import { formatDateTime } from '../lib/format'
import type { Product } from '../types'
import StatusBadge from '../components/ui/StatusBadge'
import EmptyState from '../components/ui/EmptyState'
import LoadingState from '../components/ui/LoadingState'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import QRCodeDisplay from '../components/qr/QRCodeDisplay'
import MovementForm from '../components/movements/MovementForm'
import MovementList from '../components/movements/MovementList'
import { useToast } from '../hooks/useToast'

type ActiveModal = 'qr' | 'entrada' | 'saida' | null

function ProductDetails() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { product, movements, loading, error, notFound, refresh, setProduct } =
    useProductDetails(code)

  const [activeModal, setActiveModal] = useState<ActiveModal>(null)

  function handleMovementSuccess(updated: Product) {
    setProduct(updated)
    showToast(
      activeModal === 'saida'
        ? 'Saída registrada com sucesso.'
        : 'Entrada registrada com sucesso.',
      'success'
    )
    setActiveModal(null)
    refresh()
  }

  if (loading) {
    return (
      <div className="page-placeholder">
        <LoadingState label="Carregando produto…" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="page-placeholder">
        <EmptyState
          icon="▣"
          title="Produto não encontrado"
          message={`Não existe nenhum produto com o código ${code}.`}
        />
        <Button onClick={() => navigate('/produtos')}>Voltar para produtos</Button>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="error-banner">
        <div>
          <strong>Não foi possível carregar o produto</strong>
          <span>{error}</span>
        </div>
        <Button variant="secondary" onClick={refresh}>
          Tentar novamente
        </Button>
      </div>
    )
  }

  const status = getStockStatus(product.quantity, product.minimum_stock)

  return (
    <>
      <div className="welcome">
        <div>
          <span className="eyebrow mono">{product.code}</span>
          <h3>{product.name}</h3>
          <p>{product.description || 'Sem descrição cadastrada.'}</p>
        </div>

        <div className="button-row">
          <Button variant="secondary" onClick={() => navigate('/produtos')}>
            Voltar
          </Button>
          <Button onClick={() => window.open(`/produtos/${product.code}/imprimir`, '_blank')}>
            Imprimir QR
          </Button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Detalhes</span>
              <h3>Informações do produto</h3>
            </div>
            <StatusBadge status={status} />
          </div>

          <dl className="detail-grid">
            <div>
              <dt>Localização</dt>
              <dd>{product.location || '—'}</dd>
            </div>
            <div>
              <dt>Quantidade atual</dt>
              <dd className="mono">{product.quantity} unidades</dd>
            </div>
            <div>
              <dt>Estoque mínimo</dt>
              <dd className="mono">{product.minimum_stock} unidades</dd>
            </div>
            <div>
              <dt>Cadastrado em</dt>
              <dd>{formatDateTime(product.created_at)}</dd>
            </div>
            <div>
              <dt>Última atualização</dt>
              <dd>{formatDateTime(product.updated_at)}</dd>
            </div>
          </dl>

          <div className="button-row">
            <Button onClick={() => setActiveModal('entrada')}>+ Entrada</Button>
            <Button variant="danger" onClick={() => setActiveModal('saida')}>
              − Saída
            </Button>
            <Button variant="secondary" onClick={() => setActiveModal('qr')}>
              Gerar QR
            </Button>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Identificação</span>
              <h3>QR Code</h3>
            </div>
          </div>

          <QRCodeDisplay code={product.code} size={180} />
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Histórico</span>
            <h3>Movimentações deste produto</h3>
          </div>
        </div>

        <MovementList
          movements={movements}
          showProduct={false}
          emptyMessage="Este produto ainda não teve nenhuma entrada ou saída registrada."
        />
      </div>

      {activeModal === 'qr' && (
        <Modal title={`QR Code — ${product.code}`} onClose={() => setActiveModal(null)}>
          <QRCodeDisplay code={product.code} />
        </Modal>
      )}

      {(activeModal === 'entrada' || activeModal === 'saida') && (
        <Modal
          title={activeModal === 'saida' ? 'Registrar saída' : 'Registrar entrada'}
          onClose={() => setActiveModal(null)}
        >
          <MovementForm
            product={product}
            type={activeModal}
            onSuccess={handleMovementSuccess}
            onCancel={() => setActiveModal(null)}
          />
        </Modal>
      )}
    </>
  )
}

export default ProductDetails

import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { getStockStatus } from '../lib/stock'
import type { Product, ProductStatusFilter } from '../types'
import ProductFilters from '../components/products/ProductFilters'
import ProductTable from '../components/products/ProductTable'
import EmptyState from '../components/ui/EmptyState'
import LoadingState from '../components/ui/LoadingState'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import MovementForm from '../components/movements/MovementForm'
import QRCodeDisplay from '../components/qr/QRCodeDisplay'
import { useToast } from '../hooks/useToast'

type ActiveModal =
  | { kind: 'qr'; product: Product }
  | { kind: 'entrada' | 'saida'; product: Product }
  | null

function Products() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { products, loading, error, refresh, setProducts } = useProducts()

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ProductStatusFilter>('todos')
  const [activeModal, setActiveModal] = useState<ActiveModal>(null)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()

    return products.filter((product) => {
      const matchesSearch =
        term === '' ||
        product.name.toLowerCase().includes(term) ||
        product.code.toLowerCase().includes(term) ||
        (product.location ?? '').toLowerCase().includes(term)

      const matchesStatus =
        status === 'todos' ||
        getStockStatus(product.quantity, product.minimum_stock) === status

      return matchesSearch && matchesStatus
    })
  }, [products, search, status])

  function handleMovementSuccess(updated: Product) {
    setProducts((current) =>
      current.map((product) => (product.id === updated.id ? updated : product))
    )
    showToast(
      activeModal?.kind === 'saida'
        ? 'Saída registrada com sucesso.'
        : 'Entrada registrada com sucesso.',
      'success'
    )
    setActiveModal(null)
  }

  return (
    <>
      <div className="welcome">
        <div>
          <span className="eyebrow">Estoque</span>
          <h3>Produtos</h3>
          <p>Consulte, pesquise e gerencie todos os produtos cadastrados.</p>
        </div>

        <div className="button-row">
          <Button variant="secondary" onClick={refresh} disabled={loading}>
            {loading ? 'Atualizando…' : '↻ Atualizar'}
          </Button>
          <Button onClick={() => navigate('/produtos/novo')}>
            + Cadastrar produto
          </Button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <div>
            <strong>Não foi possível carregar os produtos</strong>
            <span>{error}</span>
          </div>
          <Button variant="secondary" onClick={refresh}>
            Tentar novamente
          </Button>
        </div>
      )}

      <ProductFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
      />

      <div className="panel">
        {loading && <LoadingState label="Carregando produtos…" />}

        {!loading && products.length === 0 && !error && (
          <EmptyState
            icon="▣"
            title="Nenhum produto cadastrado"
            message="Cadastre o primeiro produto para começar a acompanhar o estoque."
          />
        )}

        {!loading && products.length > 0 && filtered.length === 0 && (
          <EmptyState
            icon="▣"
            title="Nenhum resultado encontrado"
            message="Ajuste a busca ou o filtro de status para ver outros produtos."
          />
        )}

        {!loading && filtered.length > 0 && (
          <ProductTable
            products={filtered}
            onViewDetails={(product) => navigate(`/produtos/${product.code}`)}
            onGenerateQr={(product) => setActiveModal({ kind: 'qr', product })}
            onEntrada={(product) => setActiveModal({ kind: 'entrada', product })}
            onSaida={(product) => setActiveModal({ kind: 'saida', product })}
          />
        )}
      </div>

      {activeModal?.kind === 'qr' && (
        <Modal
          title={`QR Code — ${activeModal.product.code}`}
          onClose={() => setActiveModal(null)}
        >
          <QRCodeDisplay code={activeModal.product.code} />
        </Modal>
      )}

      {(activeModal?.kind === 'entrada' || activeModal?.kind === 'saida') && (
        <Modal
          title={activeModal.kind === 'saida' ? 'Registrar saída' : 'Registrar entrada'}
          onClose={() => setActiveModal(null)}
        >
          <MovementForm
            product={activeModal.product}
            type={activeModal.kind}
            onSuccess={handleMovementSuccess}
            onCancel={() => setActiveModal(null)}
          />
        </Modal>
      )}
    </>
  )
}

export default Products

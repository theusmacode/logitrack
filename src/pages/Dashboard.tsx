import { useNavigate } from 'react-router-dom'
import StatCard from '../components/ui/StatCard'
import EmptyState from '../components/ui/EmptyState'
import StatusBadge from '../components/ui/StatusBadge'
import { useDashboardData } from '../hooks/useDashboardData'
import { getStockStatus } from '../lib/stock'
import { formatDateTime } from '../lib/format'

function Dashboard() {
  const navigate = useNavigate()
  const {
    stats,
    recentProducts,
    lowStockProducts,
    recentMovements,
    loading,
    error,
    refresh,
  } = useDashboardData()

  return (
    <>
      <div className="welcome">
        <div>
          <span className="eyebrow">Visão geral</span>
          <h3>Controle seu estoque de forma inteligente.</h3>
          <p>
            Acompanhe produtos, movimentações e níveis de estoque em um só
            lugar.
          </p>
        </div>

        <div className="button-row">
          <button
            className="secondary-button"
            onClick={refresh}
            disabled={loading}
          >
            {loading ? 'Atualizando…' : '↻ Atualizar'}
          </button>

          <button
            className="primary-button"
            onClick={() => navigate('/produtos/novo')}
          >
            + Cadastrar produto
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <div>
            <strong>Não foi possível carregar os dados</strong>
            <span>{error}</span>
          </div>
          <button className="secondary-button" onClick={refresh}>
            Tentar novamente
          </button>
        </div>
      )}

      <div className="stats">
        <StatCard
          label="Total de produtos"
          value={String(stats.totalProducts)}
          detail="Produtos cadastrados"
          icon="▣"
          loading={loading}
        />

        <StatCard
          label="Estoque total"
          value={String(stats.totalStock)}
          detail="Unidades disponíveis"
          icon="▤"
          loading={loading}
        />

        <StatCard
          label="Estoque baixo"
          value={String(stats.lowStockCount)}
          detail="Produtos precisam de atenção"
          icon="▲"
          loading={loading}
        />

        <StatCard
          label="Movimentações"
          value={String(stats.totalMovements)}
          detail="Entradas e saídas"
          icon="⇅"
          loading={loading}
        />
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Estoque</span>
              <h3>Produtos recentes</h3>
            </div>

            <button className="text-button" onClick={() => navigate('/produtos')}>
              Ver todos
            </button>
          </div>

          {!loading && recentProducts.length === 0 && !error && (
            <EmptyState
              icon="▣"
              title="Nenhum produto cadastrado ainda"
              message="Cadastre o primeiro produto para começar a acompanhar o estoque."
            />
          )}

          {recentProducts.map((product) => {
            const status = getStockStatus(product.quantity, product.minimum_stock)
            return (
              <div
                key={product.id}
                className="product-row"
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/produtos/${product.code}`)}
              >
                <div className="product-icon">▣</div>

                <div className="product-info">
                  <strong>{product.name}</strong>
                  <span>
                    {product.code}
                    {product.location ? ` • ${product.location}` : ''}
                  </span>
                </div>

                <div className="quantity">
                  <strong>{product.quantity}</strong>
                  <span>unidades</span>
                </div>

                <StatusBadge status={status} />
              </div>
            )
          })}
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Acesso rápido</span>
              <h3>Ações</h3>
            </div>
          </div>

          <div className="quick-actions">
            <button onClick={() => navigate('/produtos/novo')}>
              <span>▣</span>
              Cadastrar produto
            </button>

            <button onClick={() => navigate('/scanner')}>
              <span>⌖</span>
              Escanear QR Code
            </button>

            <button onClick={() => navigate('/movimentacoes')}>
              <span>⇅</span>
              Ver movimentações
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-grid dashboard-grid--secondary">
        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Alerta</span>
              <h3>Produtos com estoque baixo</h3>
            </div>
          </div>

          {!loading && lowStockProducts.length === 0 && !error && (
            <EmptyState
              icon="▲"
              title="Nenhum produto com estoque baixo"
              message="Todos os produtos estão acima do estoque mínimo definido."
            />
          )}

          {lowStockProducts.map((product) => (
            <div
              key={product.id}
              className="product-row"
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/produtos/${product.code}`)}
            >
              <div className="product-icon">▲</div>

              <div className="product-info">
                <strong>{product.name}</strong>
                <span>
                  {product.code}
                  {product.location ? ` • ${product.location}` : ''}
                </span>
              </div>

              <div className="quantity">
                <strong>{product.quantity}</strong>
                <span>mín. {product.minimum_stock}</span>
              </div>

              <StatusBadge
                status={getStockStatus(product.quantity, product.minimum_stock)}
              />
            </div>
          ))}
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Atividade</span>
              <h3>Últimas movimentações</h3>
            </div>

            <button
              className="text-button"
              onClick={() => navigate('/movimentacoes')}
            >
              Ver todas
            </button>
          </div>

          {!loading && recentMovements.length === 0 && !error && (
            <EmptyState
              icon="⇅"
              title="Nenhuma movimentação registrada"
              message="As entradas e saídas de estoque vão aparecer aqui."
            />
          )}

          {recentMovements.map((movement) => (
            <div key={movement.id} className="movement-row">
              <span
                className={`movement-type ${
                  movement.type === 'entrada'
                    ? 'movement-type--in'
                    : 'movement-type--out'
                }`}
              >
                {movement.type === 'entrada' ? 'Entrada' : 'Saída'}
              </span>

              <div className="movement-info">
                <strong>{movement.product?.name ?? 'Produto removido'}</strong>
                <span>{movement.product?.code ?? '—'}</span>
              </div>

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
      </div>
    </>
  )
}

export default Dashboard

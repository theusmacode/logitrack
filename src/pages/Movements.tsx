import { useMemo, useState } from 'react'
import { useMovements } from '../hooks/useMovements'
import type { MovementTypeFilter } from '../types'
import MovementList from '../components/movements/MovementList'
import LoadingState from '../components/ui/LoadingState'
import Button from '../components/ui/Button'

const typeOptions: { value: MovementTypeFilter; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'entrada', label: 'Entradas' },
  { value: 'saida', label: 'Saídas' },
]

function Movements() {
  const { movements, loading, error, refresh } = useMovements()
  const [search, setSearch] = useState('')
  const [type, setType] = useState<MovementTypeFilter>('todas')

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return movements.filter((m) => {
      const matchesType = type === 'todas' || m.type === type
      const matchesSearch =
        term === '' ||
        (m.product?.code ?? '').toLowerCase().includes(term) ||
        (m.product?.name ?? '').toLowerCase().includes(term) ||
        (m.operator ?? '').toLowerCase().includes(term)
      return matchesType && matchesSearch
    })
  }, [movements, search, type])

  return (
    <>
      <div className="welcome">
        <div>
          <span className="eyebrow">Histórico</span>
          <h3>Movimentações</h3>
          <p>Todas as entradas e saídas, da mais recente para a mais antiga.</p>
        </div>
        <Button variant="secondary" onClick={refresh} disabled={loading}>
          {loading ? 'Atualizando…' : '↻ Atualizar'}
        </Button>
      </div>

      {error && (
        <div className="error-banner">
          <div>
            <strong>Não foi possível carregar as movimentações</strong>
            <span>{error}</span>
          </div>
          <Button variant="secondary" onClick={refresh}>
            Tentar novamente
          </Button>
        </div>
      )}

      <div className="filters">
        <input
          type="search"
          className="filters-search"
          placeholder="Buscar por código, produto ou operador"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Buscar movimentações"
        />
        <div className="filters-tabs" role="tablist" aria-label="Filtrar por tipo">
          {typeOptions.map((o) => (
            <button
              key={o.value}
              role="tab"
              aria-selected={type === o.value}
              className={`filter-tab ${type === o.value ? 'active' : ''}`}
              onClick={() => setType(o.value)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="panel">
        {loading ? (
          <LoadingState label="Carregando movimentações…" />
        ) : (
          <MovementList
            movements={filtered}
            emptyMessage={
              movements.length === 0
                ? 'Nenhuma movimentação registrada.'
                : 'Nenhum resultado encontrado para esta busca.'
            }
          />
        )}
      </div>
    </>
  )
}

export default Movements

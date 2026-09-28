import type { ProductStatusFilter } from '../../types'

type ProductFiltersProps = {
  search: string
  onSearchChange: (value: string) => void
  status: ProductStatusFilter
  onStatusChange: (value: ProductStatusFilter) => void
}

const statusOptions: { value: ProductStatusFilter; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'em_estoque', label: 'Em estoque' },
  { value: 'estoque_baixo', label: 'Estoque baixo' },
  { value: 'sem_estoque', label: 'Sem estoque' },
]

function ProductFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: ProductFiltersProps) {
  return (
    <div className="filters">
      <input
        type="search"
        className="filters-search"
        placeholder="Buscar por nome, código ou localização"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        aria-label="Buscar produtos"
      />

      <div className="filters-tabs" role="tablist" aria-label="Filtrar por status">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            role="tab"
            aria-selected={status === option.value}
            className={`filter-tab ${status === option.value ? 'active' : ''}`}
            onClick={() => onStatusChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ProductFilters

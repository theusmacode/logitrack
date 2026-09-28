import { useLocation } from 'react-router-dom'

const titles: { match: (path: string) => boolean; label: string }[] = [
  { match: (p) => p === '/', label: 'Dashboard' },
  { match: (p) => p === '/produtos', label: 'Produtos' },
  { match: (p) => p === '/produtos/novo', label: 'Cadastrar produto' },
  { match: (p) => p.startsWith('/produtos/'), label: 'Detalhes do produto' },
  { match: (p) => p === '/scanner', label: 'Scanner QR' },
  { match: (p) => p === '/movimentacoes', label: 'Movimentações' },
]

function Topbar() {
  const location = useLocation()
  const current = titles.find((t) => t.match(location.pathname))

  return (
    <header className="topbar">
      <div>
        <span className="breadcrumb">LogiTrack /</span>
        <h2>{current?.label ?? 'LogiTrack'}</h2>
      </div>

      <div className="topbar-right">
        <span className="topbar-chip">LogInov · SEST SENAT</span>

        <div className="connection">
          <span className="status-dot" />
          Conectado
        </div>

        <div className="avatar">M</div>
      </div>
    </header>
  )
}

export default Topbar

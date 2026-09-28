import { NavLink } from 'react-router-dom'

const menuItems = [
  { to: '/', icon: '▦', label: 'Dashboard', end: true },
  { to: '/produtos', icon: '▣', label: 'Produtos' },
  { to: '/scanner', icon: '⌖', label: 'Scanner QR' },
  { to: '/movimentacoes', icon: '⇅', label: 'Movimentações' },
]

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">LT</div>
        <div>
          <h1>LogiTrack</h1>
          <span>Controle logístico</span>
        </div>
      </div>

      <nav>
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `menu-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="menu-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="status-dot" />
        <div>
          <strong>Sistema online</strong>
          <span>Supabase conectado</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar

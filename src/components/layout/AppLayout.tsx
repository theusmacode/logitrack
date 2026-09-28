import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

function AppLayout() {
  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <Topbar />

        <section className="content">
          <Outlet />
        </section>
      </main>
    </div>
  )
}

export default AppLayout

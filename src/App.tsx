import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import RegisterProduct from './pages/RegisterProduct'
import ProductDetails from './pages/ProductDetails'
import Scanner from './pages/Scanner'
import Movements from './pages/Movements'
import PrintLabel from './pages/PrintLabel'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="produtos" element={<Products />} />
        <Route path="produtos/novo" element={<RegisterProduct />} />
        <Route path="produtos/:code" element={<ProductDetails />} />
        <Route path="scanner" element={<Scanner />} />
        <Route path="movimentacoes" element={<Movements />} />
      </Route>
      {/* Fora do layout: página limpa, própria para impressão */}
      <Route path="produtos/:code/imprimir" element={<PrintLabel />} />
    </Routes>
  )
}

export default App

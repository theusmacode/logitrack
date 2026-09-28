import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchProductByCode } from '../lib/products'
import type { Product } from '../types'
import QRPrintLabel from '../components/qr/QRPrintLabel'
import LoadingState from '../components/ui/LoadingState'
import Button from '../components/ui/Button'

function PrintLabel() {
  const { code } = useParams<{ code: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!code) return
    fetchProductByCode(code)
      .then((p) => (p ? setProduct(p) : setError('Produto não encontrado.')))
      .catch((e) => setError(e instanceof Error ? e.message : 'Erro ao carregar.'))
      .finally(() => setLoading(false))
  }, [code])

  return (
    <div className="print-page">
      {loading && <LoadingState label="Preparando etiqueta…" />}
      {error && <p className="form-error">{error}</p>}

      {product && (
        <>
          <QRPrintLabel product={product} />
          <div className="print-actions">
            <Button onClick={() => window.print()}>Imprimir</Button>
            <Button variant="secondary" onClick={() => window.close()}>
              Fechar
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default PrintLabel

import QRCodeDisplay from './QRCodeDisplay'
import type { Product } from '../../types'

function QRPrintLabel({ product }: { product: Product }) {
  return (
    <div className="print-label">
      <span className="print-label-brand">LOGITRACK</span>

      <div className="print-label-qr">
        <QRCodeDisplay code={product.code} size={200} />
      </div>

      <strong className="print-label-code">{product.code}</strong>
      <span className="print-label-name">{product.name}</span>
    </div>
  )
}

export default QRPrintLabel

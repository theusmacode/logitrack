import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { buildProductQrValue } from '../../lib/qrcode'
import LoadingState from '../ui/LoadingState'

type QRCodeDisplayProps = {
  code: string
  size?: number
}

/**
 * Gera o QR Code no próprio navegador (canvas -> PNG em memória), sem
 * depender de nenhuma API externa paga. O valor codificado é a URL da
 * página do produto (veja src/lib/qrcode.ts).
 */
function QRCodeDisplay({ code, size = 220 }: QRCodeDisplayProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setDataUrl(null)
    setError(null)

    QRCode.toDataURL(buildProductQrValue(code), {
      width: size,
      margin: 1,
      color: { dark: '#090909ff', light: '#f5f5f5ff' },
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url)
      })
      .catch(() => {
        if (!cancelled) setError('Não foi possível gerar o QR Code.')
      })

    return () => {
      cancelled = true
    }
  }, [code, size])

  if (error) {
    return <p className="form-error">{error}</p>
  }

  if (!dataUrl) {
    return <LoadingState label="Gerando QR Code…" />
  }

  return (
    <div className="qr-display">
      <img src={dataUrl} width={size} height={size} alt={`QR Code do produto ${code}`} />
      <a
        className="secondary-button"
        href={dataUrl}
        download={`qrcode-${code}.png`}
      >
        ↓ Baixar QR Code
      </a>
    </div>
  )
}

export default QRCodeDisplay

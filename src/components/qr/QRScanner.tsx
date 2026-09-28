import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { extractProductCode } from '../../lib/qrcode'
import Button from '../ui/Button'

type QRScannerProps = {
  onCodeDetected: (code: string) => void
}

const SCANNER_ELEMENT_ID = 'logitrack-qr-scanner'

function QRScanner({ onCodeDetected }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [manualCode, setManualCode] = useState('')

  useEffect(() => {
    // Ao desmontar a página, garante que a câmera é liberada.
    return () => {
      scannerRef.current
        ?.stop()
        .then(() => scannerRef.current?.clear())
        .catch(() => {
          /* já parada — nada a fazer */
        })
    }
  }, [])

  async function startCamera() {
    setCameraError(null)

    try {
      const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID)
      scannerRef.current = scanner

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText) => {
          const code = extractProductCode(decodedText)
          if (code) {
            onCodeDetected(code)
            stopCamera()
          }
        },
        () => {
          // Callback de "nenhum QR encontrado neste frame" — disparado
          // continuamente durante a leitura, não é um erro real.
        }
      )

      setIsRunning(true)
    } catch {
      setCameraError(
        'Não foi possível acessar a câmera. Verifique se o navegador tem permissão e se a conexão é HTTPS (ou localhost).'
      )
      setIsRunning(false)
    }
  }

  function stopCamera() {
    scannerRef.current
      ?.stop()
      .then(() => scannerRef.current?.clear())
      .catch(() => {
        /* já parada — nada a fazer */
      })
      .finally(() => setIsRunning(false))
  }

  function handleManualSubmit(event: React.FormEvent) {
    event.preventDefault()
    const code = extractProductCode(manualCode)
    if (code) {
      onCodeDetected(code)
      setManualCode('')
    } else {
      setCameraError('Digite um código válido, por exemplo LT-00001.')
    }
  }

  return (
    <div className="scanner">
      <div id={SCANNER_ELEMENT_ID} className="scanner-viewport" />

      {!isRunning && (
        <Button onClick={startCamera}>⌖ Abrir câmera</Button>
      )}

      {isRunning && (
        <Button variant="secondary" onClick={stopCamera}>
          Parar câmera
        </Button>
      )}

      {cameraError && <p className="form-error">{cameraError}</p>}

      <div className="scanner-manual">
        <span className="eyebrow">Câmera não funcionou?</span>
        <form onSubmit={handleManualSubmit}>
          <label htmlFor="manual-code">Digite o código do produto</label>
          <div className="scanner-manual-row">
            <input
              id="manual-code"
              type="text"
              placeholder="LT-00001"
              value={manualCode}
              onChange={(event) => setManualCode(event.target.value)}
            />
            <Button type="submit" variant="secondary">
              Buscar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QRScanner

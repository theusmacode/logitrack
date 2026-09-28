import { useToast } from '../../hooks/useToast'

function ToastStack() {
  const { toasts, dismissToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.kind}`}>
          <span>{toast.message}</span>
          <button
            className="toast-close"
            onClick={() => dismissToast(toast.id)}
            aria-label="Fechar notificação"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}

export default ToastStack

import { createContext, useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { ToastKind, ToastMessage } from '../types'

type ToastContextValue = {
  toasts: ToastMessage[]
  showToast: (message: string, kind?: ToastKind) => void
  dismissToast: (id: string) => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const ToastContext = createContext<ToastContextValue | null>(null)

const AUTO_DISMISS_MS = 4500

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string, kind: ToastKind = 'info') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      setToasts((current) => [...current, { id, kind, message }])
      window.setTimeout(() => dismissToast(id), AUTO_DISMISS_MS)
    },
    [dismissToast]
  )

  const value = useMemo(
    () => ({ toasts, showToast, dismissToast }),
    [toasts, showToast, dismissToast]
  )

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  )
}

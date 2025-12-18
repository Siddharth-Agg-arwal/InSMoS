"use client";

import * as React from "react"

export type Toast = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

interface ToastContextValue {
  toasts: Toast[]
  toast: (toast: Omit<Toast, 'id'>) => void
  dismiss: (id: string) => void
  dismissAll: () => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const toast = React.useCallback((t: Omit<Toast, 'id'>) => {
    const id = crypto.randomUUID()
    setToasts(prev => [...prev, { id, ...t }])
    setTimeout(() => {
      setToasts(prev => prev.filter(pt => pt.id !== id))
    }, 4000)
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const dismissAll = React.useCallback(() => setToasts([]), [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss, dismissAll }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 w-80">
        {toasts.map(t => (
          <div key={t.id} className={`border rounded-md p-4 bg-background shadow ${t.variant==='destructive' ? 'border-destructive bg-destructive text-destructive-foreground' : ''}`}>
            {t.title && <div className="font-semibold mb-1 text-sm">{t.title}</div>}
            {t.description && <div className="text-xs opacity-90">{t.description}</div>}
            {t.action && <div className="mt-2">{t.action}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return { toast: ctx.toast, dismiss: ctx.dismiss, dismissAll: ctx.dismissAll }
}

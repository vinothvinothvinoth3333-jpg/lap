'use client'

import { useEffect, useRef } from 'react'
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  tone,
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  tone?: 'success' | 'warning' | 'danger' | 'info'
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const previous = document.activeElement as HTMLElement | null
    ref.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      previous?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  const ToneIcon = tone
    ? { success: CheckCircle2, warning: AlertTriangle, danger: XCircle, info: Info }[tone]
    : null
  const toneCls = tone
    ? {
        success: 'bg-success-soft text-success-strong',
        warning: 'bg-warning-soft text-warning-strong',
        danger: 'bg-danger-soft text-danger-strong',
        info: 'bg-info-soft text-info-strong',
      }[tone]
    : ''

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 animate-in fade-in-0 duration-150"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        tabIndex={-1}
        className={cn(
          'flex w-full flex-col rounded-lg border border-border bg-card text-card-foreground shadow-xl outline-none animate-in zoom-in-95 duration-150',
          size === 'sm' && 'max-w-sm',
          size === 'md' && 'max-w-lg',
          size === 'lg' && 'max-w-2xl',
        )}
      >
        <div className="flex items-start gap-3 border-b border-border px-5 py-4">
          {ToneIcon && (
            <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-md', toneCls)}>
              <ToneIcon className="size-5" />
            </span>
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <h2 id="dialog-title" className="text-base font-semibold">
              {title}
            </h2>
            {description && (
              <p className="text-sm text-muted-foreground text-pretty">{description}</p>
            )}
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close dialog">
            <X />
          </Button>
        </div>
        {children && (
          <div className="max-h-[70vh] overflow-y-auto px-5 py-4 scrollbar-thin">{children}</div>
        )}
        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border bg-muted/40 px-5 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  confirmVariant = 'default',
  tone,
  children,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel: string
  confirmVariant?: 'default' | 'danger' | 'success' | 'teal'
  tone?: 'success' | 'warning' | 'danger' | 'info'
  children?: React.ReactNode
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      tone={tone}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {children}
    </Dialog>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Bell, Settings, Search, ChevronDown, CalendarPlus, CheckCircle2, XCircle, Wrench, Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/kit/field'
import { notifications as seed, type Notification } from '@/lib/data'
import { cn } from '@/lib/utils'
import { readSession, type AuthSession } from '@/lib/auth'

export function TopBar() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<Notification[]>(seed)
  const [session, setSession] = useState<AuthSession | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const unread = items.filter((n) => n.unread).length

  useEffect(() => {
    setSession(readSession())
  }, [])

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const activeUser = session ?? {
    name: 'S. Weerasinghe',
    role: 'Laboratory Coordinator',
    eid: 'S00012',
    initials: 'SW',
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <span className="hidden text-[13px] font-semibold tracking-wide text-primary md:block">
          UNIVERSITY LAB MANAGEMENT
        </span>
        <span className="hidden h-5 w-px bg-border md:block" />
        <div className="w-64">
          <Input
            aria-label="Global search"
            placeholder="Search bookings, labs, users…"
            leading={<Search />}
            className="h-8 bg-background"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <div className="relative" ref={panelRef}>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Notifications, ${unread} unread`}
            aria-expanded={open}
            aria-haspopup="dialog"
            onClick={() => setOpen((o) => !o)}
            className="relative"
          >
            <Bell />
            {unread > 0 && (
              <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-danger text-[10px] font-semibold text-primary-foreground">
                {unread}
              </span>
            )}
          </Button>
          {open && (
            <NotificationPanel
              items={items}
              onMarkAll={() => setItems((p) => p.map((n) => ({ ...n, unread: false })))}
              onRead={(id) => setItems((p) => p.map((n) => (n.id === id ? { ...n, unread: false } : n)))}
            />
          )}
        </div>

        <Button variant="ghost" size="icon" aria-label="Settings" render={<Link href="/settings" />}>
          <Settings />
        </Button>

        <span className="mx-1 h-6 w-px bg-border" />

        <button
          type="button"
          className="flex items-center gap-2.5 rounded-md py-1 pr-2 pl-1 text-left hover:bg-muted"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {activeUser.initials}
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-medium">{activeUser.name}</span>
            <span className="text-[11px] text-muted-foreground">{activeUser.role}</span>
          </span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </button>
      </div>
    </header>
  )
}

const kindMeta = {
  request: { icon: CalendarPlus, cls: 'bg-warning-soft text-warning-strong' },
  approved: { icon: CheckCircle2, cls: 'bg-success-soft text-success-strong' },
  rejected: { icon: XCircle, cls: 'bg-danger-soft text-danger-strong' },
  maintenance: { icon: Wrench, cls: 'bg-info-soft text-info-strong' },
}

function NotificationPanel({
  items,
  onMarkAll,
  onRead,
}: {
  items: Notification[]
  onMarkAll: () => void
  onRead: (id: string) => void
}) {
  return (
    <div
      role="dialog"
      aria-label="Notifications"
      className="absolute right-0 top-11 z-40 flex w-[380px] flex-col overflow-hidden rounded-lg border border-border bg-popover shadow-xl animate-in fade-in-0 zoom-in-95 duration-150"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">Notifications</h2>
        <button type="button" onClick={onMarkAll} className="text-xs text-primary hover:underline">
          Mark all as read
        </button>
      </div>
      <ul className="max-h-[420px] overflow-y-auto scrollbar-thin">
        {items.length === 0 && (
          <li className="flex flex-col items-center gap-2 px-4 py-10 text-center text-sm text-muted-foreground">
            <Inbox className="size-6" />
            No notifications
          </li>
        )}
        {items.map((n) => {
          const meta = kindMeta[n.kind]
          return (
            <li key={n.id} className="border-b border-border last:border-0">
              <button
                type="button"
                onClick={() => onRead(n.id)}
                className={cn(
                  'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60',
                  n.unread && 'bg-accent/40',
                )}
              >
                <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-md', meta.cls)}>
                  <meta.icon className="size-4" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{n.title}</span>
                    <span className="shrink-0 text-[11px] text-muted-foreground">{n.time}</span>
                  </span>
                  <span className="text-xs leading-relaxed text-muted-foreground text-pretty">{n.body}</span>
                </span>
                {n.unread && <span aria-label="Unread" className="mt-2 size-2 shrink-0 rounded-full bg-info" />}
              </button>
            </li>
          )
        })}
      </ul>
      <div className="border-t border-border px-4 py-2.5 text-center">
        <Link href="/approvals" className="text-xs font-medium text-primary hover:underline">
          View all pending requests
        </Link>
      </div>
    </div>
  )
}

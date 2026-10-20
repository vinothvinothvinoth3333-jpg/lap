'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FlaskConical,
  CalendarCheck2,
  CalendarDays,
  ClipboardCheck,
  CalendarRange,
  Microscope,
  BarChart3,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Palette,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { bookings } from '@/lib/data'

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/users', label: 'Users', icon: Users },
  { href: '/labs', label: 'Laboratories', icon: FlaskConical },
  { href: '/availability', label: 'Availability', icon: CalendarCheck2 },
  { href: '/reservations', label: 'Reservations', icon: CalendarDays },
  { href: '/approvals', label: 'Pending Requests', icon: ClipboardCheck, badge: true },
  { href: '/schedule', label: 'Schedule', icon: CalendarRange },
  { href: '/equipment', label: 'Equipment', icon: Microscope },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
]

export function Sidebar({
  collapsed,
  onToggle,
  onLogout,
}: {
  collapsed: boolean
  onToggle: () => void
  onLogout: () => void
}) {
  const pathname = usePathname()
  const pendingCount = bookings.filter((b) => b.status === 'pending').length

  return (
    <aside
      className={cn(
        'flex h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      <div className={cn('flex h-14 items-center gap-3 border-b border-sidebar-border px-3', collapsed && 'justify-center')}>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <FlaskConical className="size-5" />
        </span>
        {!collapsed && (
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-[13px] font-semibold text-sidebar-accent-foreground">
              Lab Management
            </span>
            <span className="truncate text-[11px] text-sidebar-foreground/70">University Staff Console</span>
          </div>
        )}
      </div>

      <nav aria-label="Main navigation" className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2 scrollbar-thin">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              title={collapsed ? item.label : undefined}
              className={cn(
                'flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors',
                active
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_3px_0_0_0_var(--sidebar-primary)]'
                  : 'text-sidebar-foreground/85 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
                collapsed && 'justify-center px-0',
              )}
            >
              <item.icon className={cn('size-[18px] shrink-0', active && 'text-sidebar-primary')} />
              {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
              {!collapsed && item.badge && pendingCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-warning px-1.5 text-[11px] font-semibold text-foreground tabular-nums">
                  {pendingCount}
                </span>
              )}
            </Link>
          )
        })}

        <div className="my-2 border-t border-sidebar-border" />

        <Link
          href="/settings"
          aria-current={pathname.startsWith('/settings') ? 'page' : undefined}
          title={collapsed ? 'Settings' : undefined}
          className={cn(
            'flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors',
            pathname.startsWith('/settings')
              ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_3px_0_0_0_var(--sidebar-primary)]'
              : 'text-sidebar-foreground/85 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
            collapsed && 'justify-center px-0',
          )}
        >
          <Settings className="size-[18px] shrink-0" />
          {!collapsed && 'Settings'}
        </Link>
        <Link
          href="/design-system"
          aria-current={pathname.startsWith('/design-system') ? 'page' : undefined}
          title={collapsed ? 'Design System' : undefined}
          className={cn(
            'flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors',
            pathname.startsWith('/design-system')
              ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_3px_0_0_0_var(--sidebar-primary)]'
              : 'text-sidebar-foreground/85 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
            collapsed && 'justify-center px-0',
          )}
        >
          <Palette className="size-[18px] shrink-0" />
          {!collapsed && 'Design System'}
        </Link>
      </nav>

      <div className="flex flex-col gap-0.5 border-t border-sidebar-border p-2">
        <button
          type="button"
          onClick={onLogout}
          title={collapsed ? 'Logout' : undefined}
          className={cn(
            'flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-sidebar-foreground/85 transition-colors hover:bg-danger/15 hover:text-sidebar-accent-foreground',
            collapsed && 'justify-center px-0',
          )}
        >
          <LogOut className="size-[18px] shrink-0" />
          {!collapsed && 'Logout'}
        </button>
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'flex h-9 items-center gap-3 rounded-md px-3 text-xs text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
            collapsed && 'justify-center px-0',
          )}
        >
          {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          {!collapsed && 'Collapse'}
        </button>
      </div>
    </aside>
  )
}

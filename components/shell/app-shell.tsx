'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/shell/sidebar'
import { TopBar } from '@/components/shell/top-bar'
import { ConfirmDialog } from '@/components/kit/dialog'
import { useRouter } from 'next/navigation'
import { clearSession } from '@/lib/auth'

export function AppShell({ children }: { children: React.ReactNode }) {
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()

  return (
    <div className="flex h-screen min-h-[640px] w-full overflow-hidden bg-background">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        onLogout={() => setLogoutOpen(true)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 p-6 lg:p-8">{children}</div>
        </main>
      </div>

      <ConfirmDialog
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={() => {
          clearSession()
          router.push('/')
        }}
        title="Log out?"
        description="You will be returned to the staff login screen. Any unsaved form data will be lost."
        confirmLabel="Log out"
        tone="warning"
      />
    </div>
  )
}

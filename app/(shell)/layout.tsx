'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { AppShell } from '@/components/shell/app-shell'
import { ToastProvider } from '@/components/kit/toast'
import { readSession } from '@/lib/auth'

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!readSession() && pathname !== '/') {
      router.replace('/')
    }
  }, [pathname, router])

  return (
    <ToastProvider>
      <AppShell>{children}</AppShell>
    </ToastProvider>
  )
}

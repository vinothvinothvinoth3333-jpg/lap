'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, FlaskConical, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox, Field, Input } from '@/components/kit/field'
import { authenticate, readSession, saveSession } from '@/lib/auth'

export function LoginForm() {
  const router = useRouter()
  const [eid, setEid] = useState('L10000231')
  const [password, setPassword] = useState('lab-admin-2026')
  const [show, setShow] = useState(false)
  const [errors, setErrors] = useState<{ eid?: string; password?: string; form?: string }>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (readSession()) {
      router.replace('/dashboard')
    }
  }, [router])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const next: typeof errors = {}
    if (!eid.trim()) next.eid = 'University E-ID is required'
    if (!password) next.password = 'Password is required'
    setErrors(next)
    if (Object.keys(next).length) return

    const account = authenticate(eid, password)
    if (!account) {
      setErrors({ form: 'Invalid University E-ID or password. Please try again.' })
      return
    }

    saveSession(account)
    setLoading(true)
    setTimeout(() => router.push('/dashboard'), 400)
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
          <FlaskConical className="size-7" />
        </span>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold tracking-tight">Laboratory Management System</h2>
          <p className="text-sm text-muted-foreground">Staff Login</p>
        </div>
      </div>

      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        {errors.form && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-md border border-danger/30 bg-danger-soft px-3 py-2.5 text-sm text-danger-strong"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            {errors.form}
          </div>
        )}

        <Field label="University E-ID" htmlFor="eid" required error={errors.eid}>
          <Input
            id="eid"
            autoComplete="username"
            placeholder="e.g. L10000231"
            value={eid}
            onChange={(e) => setEid(e.target.value)}
            invalid={!!errors.eid}
          />
        </Field>

        <Field label="Password" htmlFor="password" required error={errors.password}>
          <Input
            id="password"
            type={show ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            invalid={!!errors.password}
            trailing={
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={show ? 'Hide password' : 'Show password'}
                aria-pressed={show}
                onClick={() => setShow((s) => !s)}
              >
                {show ? <EyeOff /> : <Eye />}
              </Button>
            }
          />
        </Field>

        <div className="flex items-center justify-between">
          <Checkbox label="Remember me" name="remember" />
          <button type="button" className="text-sm text-primary hover:underline">
            Forgot password?
          </button>
        </div>

        <div className="rounded-md border border-dashed border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          Demo staff access: <span className="font-medium text-foreground">L10000231</span> / <span className="font-medium text-foreground">lab-admin-2026</span>
        </div>

        <Button type="submit" size="lg" className="h-10 w-full text-sm font-semibold" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : null}
          {loading ? 'Signing in…' : 'Login'}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground text-pretty">
        Access is restricted to authorised laboratory staff. Contact the system administrator if
        you need an account.
      </p>
    </div>
  )
}

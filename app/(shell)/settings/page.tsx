'use client'

import { useEffect, useState } from 'react'
import { Bell, Check, Eye, EyeOff, Lock } from 'lucide-react'
import { PageHeader, Panel } from '@/components/kit/page'
import { Button } from '@/components/ui/button'
import { Field, Input, Select } from '@/components/kit/field'
import { useToast } from '@/components/kit/toast'

export default function SettingsPage() {
  const toast = useToast()
  const [displayName, setDisplayName] = useState('S. Weerasinghe')
  const [role, setRole] = useState('Laboratory Coordinator')
  const [notifications, setNotifications] = useState('important')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)

  useEffect(() => {
    const saved = window.localStorage
    setDisplayName(saved.getItem('lab-display-name') ?? 'S. Weerasinghe')
    setRole(saved.getItem('lab-role') ?? 'Laboratory Coordinator')
    setNotifications(saved.getItem('lab-notifications') ?? 'important')
  }, [])

  function savePreferences(e: React.FormEvent) {
    e.preventDefault()
    window.localStorage.setItem('lab-display-name', displayName.trim() || 'S. Weerasinghe')
    window.localStorage.setItem('lab-role', role.trim() || 'Laboratory Coordinator')
    window.localStorage.setItem('lab-notifications', notifications)
    toast({ tone: 'success', title: 'Preferences saved', body: 'Your settings are saved in this browser.' })
  }

  function changePassword(e: React.FormEvent) {
    e.preventDefault()
    const savedPassword = window.localStorage.getItem('lab-password') ?? 'demo-password'
    if (currentPassword !== savedPassword) {
      toast({ tone: 'danger', title: 'Current password is incorrect' })
      return
    }
    if (newPassword.length < 8) {
      toast({ tone: 'danger', title: 'Password is too short', body: 'Use at least 8 characters.' })
      return
    }
    if (newPassword !== confirmPassword) {
      toast({ tone: 'danger', title: 'Passwords do not match' })
      return
    }
    window.localStorage.setItem('lab-password', newPassword)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    toast({ tone: 'success', title: 'Password changed', body: 'Use your new password the next time you sign in.' })
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Settings" subtitle="Manage your console preferences" />
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Profile" description="Details displayed to other laboratory staff">
          <form onSubmit={savePreferences} className="grid gap-4">
            <Field label="Display name" htmlFor="display-name"><Input id="display-name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} /></Field>
            <Field label="Role" htmlFor="role"><Input id="role" value={role} onChange={(e) => setRole(e.target.value)} /></Field>
            <Field label="Email notifications" htmlFor="notifications"><Select id="notifications" value={notifications} onChange={(e) => setNotifications(e.target.value)}><option value="all">All activity</option><option value="important">Important activity only</option><option value="none">Disabled</option></Select></Field>
            <Button type="submit" className="w-fit"><Check /> Save preferences</Button>
          </form>
        </Panel>
        <Panel title="Security" description="Account access and sign-in options">
          <form onSubmit={changePassword} className="flex flex-col gap-4">
            <div className="flex items-start gap-3 rounded-md border border-border p-4 text-sm"><Lock className="mt-0.5 size-5 text-muted-foreground" /><div><p className="font-medium">Change password</p><p className="text-muted-foreground">Choose a new password for this browser.</p></div></div>
            <Field label="Current password" htmlFor="current-password" required><Input id="current-password" type={showPasswords ? 'text' : 'password'} autoComplete="current-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} /></Field>
            <Field label="New password" htmlFor="new-password" required hint="At least 8 characters"><Input id="new-password" type={showPasswords ? 'text' : 'password'} autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} trailing={<Button type="button" variant="ghost" size="icon-sm" aria-label={showPasswords ? 'Hide passwords' : 'Show passwords'} onClick={() => setShowPasswords((value) => !value)}>{showPasswords ? <EyeOff /> : <Eye />}</Button>} /></Field>
            <Field label="Confirm new password" htmlFor="confirm-password" required><Input id="confirm-password" type={showPasswords ? 'text' : 'password'} autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></Field>
            <Button type="submit" className="w-fit"><Lock /> Change password</Button>
            <div className="flex items-start gap-3 rounded-md border border-border p-4 text-sm"><Bell className="mt-0.5 size-5 text-muted-foreground" /><div><p className="font-medium">Notification delivery</p><p className="text-muted-foreground">Choose which activity appears in your console from the Profile settings.</p></div></div>
          </form>
        </Panel>
      </div>
    </div>
  )
}

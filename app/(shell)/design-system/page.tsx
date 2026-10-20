import { CheckCircle2, Palette, Type } from 'lucide-react'
import { PageHeader, Panel } from '@/components/kit/page'
import { StatusBadge } from '@/components/kit/status-badge'
import { Button } from '@/components/ui/button'

export default function DesignSystemPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Design System" subtitle="Shared interface patterns used across the console" />
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Buttons and status" description="Common action and state styles">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary action</Button>
            <Button variant="outline">Secondary</Button>
            <Button variant="ghost">Quiet action</Button>
            <StatusBadge tone="success">Approved</StatusBadge>
            <StatusBadge tone="warning">Pending</StatusBadge>
            <StatusBadge tone="danger">Unavailable</StatusBadge>
          </div>
        </Panel>
        <Panel title="Visual language" description="The console uses restrained colour, clear hierarchy, and compact controls">
          <div className="grid gap-4 text-sm">
            <div className="flex items-start gap-3"><Palette className="size-5 text-primary" /><span>Colour communicates state and action priority.</span></div>
            <div className="flex items-start gap-3"><Type className="size-5 text-primary" /><span>Typography is optimised for scanning dense operational data.</span></div>
            <div className="flex items-start gap-3"><CheckCircle2 className="size-5 text-success" /><span>Components share consistent spacing and focus states.</span></div>
          </div>
        </Panel>
      </div>
    </div>
  )
}

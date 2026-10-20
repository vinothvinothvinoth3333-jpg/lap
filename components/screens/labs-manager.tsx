'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, Plus, FlaskConical, MapPin, Users, LayoutGrid, List, Eye, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Panel, EmptyState } from '@/components/kit/page'
import { Field, Input, Select, Textarea } from '@/components/kit/field'
import { Table, THead, TH, TBody, TR, TD, TableFooter } from '@/components/kit/table'
import { LabStatusBadge } from '@/components/kit/status-badge'
import { Dialog, ConfirmDialog } from '@/components/kit/dialog'
import { useToast } from '@/components/kit/toast'
import { labs as seed, equipment, type Laboratory, type LabStatus } from '@/lib/data'
import { cn } from '@/lib/utils'

type FormState = Omit<Laboratory, 'capacity' | 'status'> & { capacity: string; status: LabStatus | '' }
const emptyForm: FormState = { id: '', name: '', number: '', location: '', capacity: '', status: '', description: '' }

export function LabsManager() {
  const toast = useToast()
  const [labs, setLabs] = useState<Laboratory[]>(seed)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | LabStatus>('all')
  const [location, setLocation] = useState('all')
  const [view, setView] = useState<'grid' | 'table'>('grid')
  const [editing, setEditing] = useState<Laboratory | 'new' | null>(null)
  const [deleting, setDeleting] = useState<Laboratory | null>(null)

  const buildings = useMemo(() => Array.from(new Set(seed.map((l) => l.location.split(',')[0]))), [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return labs.filter(
      (l) =>
        (status === 'all' || l.status === status) &&
        (location === 'all' || l.location.startsWith(location)) &&
        (!q || l.name.toLowerCase().includes(q) || l.id.toLowerCase().includes(q) || l.number.toLowerCase().includes(q)),
    )
  }, [labs, query, status, location])

  function save(l: Laboratory) {
    setLabs((prev) => (prev.some((p) => p.id === l.id) ? prev.map((p) => (p.id === l.id ? l : p)) : [l, ...prev]))
    toast({ tone: 'success', title: editing === 'new' ? 'Laboratory added' : 'Laboratory updated', body: `${l.name} saved successfully.` })
    setEditing(null)
  }

  function remove() {
    if (!deleting) return
    setLabs((prev) => prev.filter((p) => p.id !== deleting.id))
    toast({ tone: 'info', title: 'Laboratory deleted', body: `${deleting.name} was removed.` })
    setDeleting(null)
  }

  return (
    <>
      <Panel flush>
        <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="w-full sm:w-72">
              <Input
                aria-label="Search laboratory"
                placeholder="Search laboratory"
                leading={<Search />}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-44">
              <Select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
                <option value="all">All statuses</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
                <option value="maintenance">Under Maintenance</option>
              </Select>
            </div>
            <div className="w-full sm:w-52">
              <Select aria-label="Filter by location" value={location} onChange={(e) => setLocation(e.target.value)}>
                <option value="all">All locations</option>
                {buildings.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div role="group" aria-label="View mode" className="inline-flex rounded-md border border-border bg-muted p-0.5">
              <button
                type="button"
                aria-pressed={view === 'grid'}
                onClick={() => setView('grid')}
                className={cn('flex size-8 items-center justify-center rounded-[5px]', view === 'grid' ? 'bg-card shadow-sm' : 'text-muted-foreground')}
                aria-label="Card view"
              >
                <LayoutGrid className="size-4" />
              </button>
              <button
                type="button"
                aria-pressed={view === 'table'}
                onClick={() => setView('table')}
                className={cn('flex size-8 items-center justify-center rounded-[5px]', view === 'table' ? 'bg-card shadow-sm' : 'text-muted-foreground')}
                aria-label="Table view"
              >
                <List className="size-4" />
              </button>
            </div>
            <Button onClick={() => setEditing('new')}>
              <Plus />
              Add Laboratory
            </Button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<FlaskConical />}
            title="No laboratories available"
            description="No laboratories match the current filters."
            action={
              <Button variant="outline" onClick={() => setEditing('new')}>
                <Plus /> Add Laboratory
              </Button>
            }
          />
        ) : view === 'grid' ? (
          <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((l) => {
              const eqCount = equipment.filter((e) => e.labId === l.id).length
              return (
                <article key={l.id} className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
                        <FlaskConical className="size-5" />
                      </span>
                      <div className="flex min-w-0 flex-col">
                        <Link href={`/labs/${l.id}`} className="truncate text-sm font-semibold hover:underline">
                          {l.name}
                        </Link>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {l.id} · Room {l.number}
                        </span>
                      </div>
                    </div>
                    <LabStatusBadge status={l.status} />
                  </div>
                  <dl className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="size-3.5" />
                      <dd className="truncate">{l.location}</dd>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="size-3.5" />
                      <dd>Capacity {l.capacity}</dd>
                    </div>
                  </dl>
                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <span className="text-xs text-muted-foreground">{eqCount} equipment types</span>
                    <div className="flex items-center gap-0.5">
                      <Button variant="ghost" size="icon-sm" aria-label="View" render={<Link href={`/labs/${l.id}`} />}>
                        <Eye />
                      </Button>
                      <Button variant="ghost" size="icon-sm" aria-label="Edit" onClick={() => setEditing(l)}>
                        <Pencil />
                      </Button>
                      <Button variant="ghost" size="icon-sm" aria-label="Delete" className="text-danger hover:bg-danger-soft hover:text-danger-strong" onClick={() => setDeleting(l)}>
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <>
            <Table>
              <THead>
                <tr>
                  <TH sortable>Lab ID</TH>
                  <TH sortable>Laboratory Name</TH>
                  <TH>Number</TH>
                  <TH>Location</TH>
                  <TH align="right">Capacity</TH>
                  <TH>Status</TH>
                  <TH align="right">Actions</TH>
                </tr>
              </THead>
              <TBody>
                {filtered.map((l) => (
                  <TR key={l.id}>
                    <TD className="font-mono text-xs">{l.id}</TD>
                    <TD className="font-medium">
                      <Link href={`/labs/${l.id}`} className="hover:underline">
                        {l.name}
                      </Link>
                    </TD>
                    <TD muted>{l.number}</TD>
                    <TD muted>{l.location}</TD>
                    <TD align="right" className="tabular-nums">
                      {l.capacity}
                    </TD>
                    <TD>
                      <LabStatusBadge status={l.status} />
                    </TD>
                    <TD align="right">
                      <div className="inline-flex items-center gap-0.5">
                        <Button variant="ghost" size="icon-sm" aria-label="View" render={<Link href={`/labs/${l.id}`} />}>
                          <Eye />
                        </Button>
                        <Button variant="ghost" size="icon-sm" aria-label="Edit" onClick={() => setEditing(l)}>
                          <Pencil />
                        </Button>
                        <Button variant="ghost" size="icon-sm" aria-label="Delete" className="text-danger hover:bg-danger-soft hover:text-danger-strong" onClick={() => setDeleting(l)}>
                          <Trash2 />
                        </Button>
                      </div>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
            <TableFooter shown={filtered.length} total={labs.length} label="laboratories" />
          </>
        )}
      </Panel>

      <LabFormDialog
        open={editing !== null}
        initial={editing === 'new' || editing === null ? null : editing}
        nextId={`LAB-${String(labs.length + 1).padStart(3, '0')}`}
        onClose={() => setEditing(null)}
        onSave={save}
      />

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
        title="Delete laboratory?"
        description={`Are you sure you want to delete ${deleting?.name ?? ''}? Equipment assigned to this laboratory will become unassigned.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        tone="danger"
      />
    </>
  )
}

export function LabFormDialog({
  open,
  initial,
  nextId,
  onClose,
  onSave,
}: {
  open: boolean
  initial: Laboratory | null
  nextId: string
  onClose: () => void
  onSave: (l: Laboratory) => void
}) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [key, setKey] = useState<string | null>(null)

  const currentKey = open ? (initial?.id ?? 'new') : null
  if (currentKey !== key) {
    setKey(currentKey)
    setForm(initial ? { ...initial, capacity: String(initial.capacity) } : { ...emptyForm, id: nextId })
    setErrors({})
  }

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const next: typeof errors = {}
    if (!form.name.trim()) next.name = 'Laboratory name is required'
    if (!form.number.trim()) next.number = 'Laboratory number is required'
    if (!form.location.trim()) next.location = 'Location is required'
    const cap = Number(form.capacity)
    if (!form.capacity) next.capacity = 'Capacity is required'
    else if (!Number.isInteger(cap) || cap <= 0) next.capacity = 'Capacity must be a positive whole number'
    if (!form.status) next.status = 'Please select a status'
    setErrors(next)
    if (Object.keys(next).length) return
    onSave({ ...form, capacity: cap, status: form.status as LabStatus })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={initial ? 'Edit Laboratory' : 'Add Laboratory'}
      description={initial ? `Update the details for ${initial.name}.` : 'Register a new laboratory that staff can reserve.'}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="lab-form">
            {initial ? 'Save Changes' : 'Add Laboratory'}
          </Button>
        </>
      }
    >
      <form id="lab-form" onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
        <Field label="Laboratory ID" htmlFor="l-id" hint="Generated automatically">
          <Input id="l-id" value={form.id} disabled readOnly />
        </Field>
        <Field label="Laboratory Number" htmlFor="l-number" required error={errors.number}>
          <Input id="l-number" value={form.number} onChange={set('number')} placeholder="e.g. B2-104" invalid={!!errors.number} />
        </Field>
        <Field label="Laboratory Name" htmlFor="l-name" required error={errors.name} className="sm:col-span-2">
          <Input id="l-name" value={form.name} onChange={set('name')} placeholder="e.g. Nanotechnology Laboratory" invalid={!!errors.name} />
        </Field>
        <Field label="Location" htmlFor="l-location" required error={errors.location} className="sm:col-span-2">
          <Input id="l-location" value={form.location} onChange={set('location')} placeholder="Building, Level" invalid={!!errors.location} />
        </Field>
        <Field label="Capacity" htmlFor="l-capacity" required error={errors.capacity}>
          <Input id="l-capacity" type="number" min={1} value={form.capacity} onChange={set('capacity')} placeholder="e.g. 30" invalid={!!errors.capacity} />
        </Field>
        <Field label="Status" htmlFor="l-status" required error={errors.status}>
          <Select id="l-status" value={form.status} onChange={set('status')} invalid={!!errors.status}>
            <option value="">Select status</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
            <option value="maintenance">Under Maintenance</option>
          </Select>
        </Field>
        <Field label="Description" htmlFor="l-desc" hint="Optional" className="sm:col-span-2">
          <Textarea id="l-desc" value={form.description} onChange={set('description')} placeholder="Facilities, safety requirements, notes for staff…" />
        </Field>
      </form>
    </Dialog>
  )
}

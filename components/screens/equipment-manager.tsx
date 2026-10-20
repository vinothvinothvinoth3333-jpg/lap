'use client'

import { useMemo, useState } from 'react'
import { Search, Plus, Microscope } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Panel, EmptyState } from '@/components/kit/page'
import { Field, Input, Select, Textarea } from '@/components/kit/field'
import { Table, THead, TH, TBody, TR, TD, TableFooter } from '@/components/kit/table'
import { EquipmentStatusBadge } from '@/components/kit/status-badge'
import { Dialog, ConfirmDialog } from '@/components/kit/dialog'
import { useToast } from '@/components/kit/toast'
import { RowActions } from '@/components/screens/users-manager'
import { equipment as seed, labs, labById, type Equipment, type EquipmentStatus } from '@/lib/data'

type FormState = Omit<Equipment, 'total' | 'available' | 'status' | 'condition'> & {
  total: string
  available: string
  status: EquipmentStatus | ''
  condition: Equipment['condition'] | ''
}
const emptyForm: FormState = { id: '', name: '', labId: '', total: '', available: '', condition: '', status: '', notes: '' }

export function EquipmentManager() {
  const toast = useToast()
  const [items, setItems] = useState<Equipment[]>(seed)
  const [query, setQuery] = useState('')
  const [lab, setLab] = useState('all')
  const [status, setStatus] = useState<'all' | EquipmentStatus>('all')
  const [editing, setEditing] = useState<Equipment | 'new' | null>(null)
  const [viewing, setViewing] = useState<Equipment | null>(null)
  const [deleting, setDeleting] = useState<Equipment | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter(
      (e) =>
        (lab === 'all' || e.labId === lab) &&
        (status === 'all' || e.status === status) &&
        (!q || e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q)),
    )
  }, [items, query, lab, status])

  function save(e: Equipment) {
    setItems((prev) => (prev.some((p) => p.id === e.id) ? prev.map((p) => (p.id === e.id ? e : p)) : [e, ...prev]))
    toast({ tone: 'success', title: editing === 'new' ? 'Equipment added' : 'Equipment updated', body: `${e.name} saved successfully.` })
    setEditing(null)
  }

  function remove() {
    if (!deleting) return
    setItems((prev) => prev.filter((p) => p.id !== deleting.id))
    toast({ tone: 'info', title: 'Equipment deleted', body: `${deleting.name} was removed.` })
    setDeleting(null)
  }

  return (
    <>
      <Panel flush>
        <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="w-full sm:w-72">
              <Input aria-label="Search equipment" placeholder="Search equipment" leading={<Search />} value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <div className="w-full sm:w-60">
              <Select aria-label="Filter by laboratory" value={lab} onChange={(e) => setLab(e.target.value)}>
                <option value="all">All laboratories</option>
                {labs.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="w-full sm:w-44">
              <Select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
                <option value="all">All statuses</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
                <option value="maintenance">Maintenance</option>
              </Select>
            </div>
          </div>
          <Button onClick={() => setEditing('new')}>
            <Plus /> Add Equipment
          </Button>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Microscope />}
            title="No equipment records found"
            description="Try changing your search or filters, or add new equipment."
            action={
              <Button variant="outline" onClick={() => setEditing('new')}>
                <Plus /> Add Equipment
              </Button>
            }
          />
        ) : (
          <>
            <Table>
              <THead>
                <tr>
                  <TH sortable>Equipment ID</TH>
                  <TH sortable>Equipment Name</TH>
                  <TH>Laboratory</TH>
                  <TH align="right">Total</TH>
                  <TH align="right">Available</TH>
                  <TH>Condition</TH>
                  <TH>Status</TH>
                  <TH>Notes</TH>
                  <TH align="right">Actions</TH>
                </tr>
              </THead>
              <TBody>
                {filtered.map((e) => (
                  <TR key={e.id}>
                    <TD className="font-mono text-xs">{e.id}</TD>
                    <TD className="font-medium">{e.name}</TD>
                    <TD muted>{labById(e.labId)?.name ?? 'Unassigned'}</TD>
                    <TD align="right" className="tabular-nums">
                      {e.total}
                    </TD>
                    <TD align="right" className="tabular-nums">
                      <span className={e.available === 0 ? 'font-medium text-danger-strong' : 'font-medium text-success-strong'}>{e.available}</span>
                    </TD>
                    <TD muted>{e.condition}</TD>
                    <TD>
                      <EquipmentStatusBadge status={e.status} />
                    </TD>
                    <TD muted className="max-w-[220px] truncate">
                      {e.notes || '—'}
                    </TD>
                    <TD align="right">
                      <RowActions onView={() => setViewing(e)} onEdit={() => setEditing(e)} onDelete={() => setDeleting(e)} />
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
            <TableFooter shown={filtered.length} total={items.length} label="equipment records" />
          </>
        )}
      </Panel>

      <EquipmentFormDialog
        open={editing !== null}
        initial={editing === 'new' || editing === null ? null : editing}
        nextId={`EQ-${String(items.length + 1).padStart(3, '0')}`}
        onClose={() => setEditing(null)}
        onSave={save}
      />

      <Dialog
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing?.name ?? ''}
        description={viewing ? `${viewing.id} · ${labById(viewing.labId)?.name ?? 'Unassigned'}` : ''}
        size="sm"
        footer={
          <Button variant="outline" onClick={() => setViewing(null)}>
            Close
          </Button>
        }
      >
        {viewing && (
          <dl className="grid grid-cols-[140px_1fr] gap-y-3 text-sm">
            <dt className="text-muted-foreground">Total Quantity</dt>
            <dd className="tabular-nums">{viewing.total}</dd>
            <dt className="text-muted-foreground">Available</dt>
            <dd className="tabular-nums">{viewing.available}</dd>
            <dt className="text-muted-foreground">Condition</dt>
            <dd>{viewing.condition}</dd>
            <dt className="text-muted-foreground">Status</dt>
            <dd>
              <EquipmentStatusBadge status={viewing.status} />
            </dd>
            <dt className="text-muted-foreground">Notes</dt>
            <dd className="text-pretty">{viewing.notes || '—'}</dd>
          </dl>
        )}
      </Dialog>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
        title="Delete equipment?"
        description={`Are you sure you want to delete ${deleting?.name ?? ''} (${deleting?.id ?? ''})? This cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        tone="danger"
      />
    </>
  )
}

export function EquipmentFormDialog({
  open,
  initial,
  nextId,
  fixedLabId,
  onClose,
  onSave,
}: {
  open: boolean
  initial: Equipment | null
  nextId: string
  fixedLabId?: string
  onClose: () => void
  onSave: (e: Equipment) => void
}) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [key, setKey] = useState<string | null>(null)

  const currentKey = open ? (initial?.id ?? 'new') : null
  if (currentKey !== key) {
    setKey(currentKey)
    setForm(
      initial
        ? { ...initial, total: String(initial.total), available: String(initial.available) }
        : { ...emptyForm, id: nextId, labId: fixedLabId ?? '' },
    )
    setErrors({})
  }

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const next: typeof errors = {}
    const total = Number(form.total)
    const available = Number(form.available)
    if (!form.name.trim()) next.name = 'Equipment name is required'
    if (!form.labId) next.labId = 'Please select a laboratory'
    if (!form.total) next.total = 'Total quantity is required'
    else if (!Number.isInteger(total) || total < 0) next.total = 'Enter a whole number of 0 or more'
    if (!form.available) next.available = 'Available quantity is required'
    else if (!Number.isInteger(available) || available < 0) next.available = 'Enter a whole number of 0 or more'
    else if (available > total) next.available = 'Available quantity cannot exceed total quantity'
    if (!form.condition) next.condition = 'Please select a condition'
    if (!form.status) next.status = 'Please select a status'
    setErrors(next)
    if (Object.keys(next).length) return
    onSave({ ...form, total, available, condition: form.condition as Equipment['condition'], status: form.status as EquipmentStatus })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={initial ? 'Edit Equipment' : 'Add Equipment'}
      description={initial ? `Update the record for ${initial.name}.` : 'Register equipment so it can be requested with a reservation.'}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="equipment-form">
            {initial ? 'Save Changes' : 'Add Equipment'}
          </Button>
        </>
      }
    >
      <form id="equipment-form" onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
        <Field label="Equipment ID" htmlFor="e-id" hint="Generated automatically">
          <Input id="e-id" value={form.id} disabled readOnly />
        </Field>
        <Field label="Laboratory" htmlFor="e-lab" required error={errors.labId}>
          <Select id="e-lab" value={form.labId} onChange={set('labId')} disabled={!!fixedLabId} invalid={!!errors.labId}>
            <option value="">Select laboratory</option>
            {labs.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Equipment Name" htmlFor="e-name" required error={errors.name} className="sm:col-span-2">
          <Input id="e-name" value={form.name} onChange={set('name')} placeholder="e.g. Microscope" invalid={!!errors.name} />
        </Field>
        <Field label="Total Quantity" htmlFor="e-total" required error={errors.total}>
          <Input id="e-total" type="number" min={0} value={form.total} onChange={set('total')} invalid={!!errors.total} />
        </Field>
        <Field label="Available Quantity" htmlFor="e-avail" required error={errors.available}>
          <Input id="e-avail" type="number" min={0} value={form.available} onChange={set('available')} invalid={!!errors.available} />
        </Field>
        <Field label="Condition" htmlFor="e-cond" required error={errors.condition}>
          <Select id="e-cond" value={form.condition} onChange={set('condition')} invalid={!!errors.condition}>
            <option value="">Select condition</option>
            <option>Good</option>
            <option>Fair</option>
            <option>Poor</option>
          </Select>
        </Field>
        <Field label="Status" htmlFor="e-status" required error={errors.status}>
          <Select id="e-status" value={form.status} onChange={set('status')} invalid={!!errors.status}>
            <option value="">Select status</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
            <option value="maintenance">Maintenance</option>
          </Select>
        </Field>
        <Field label="Notes" htmlFor="e-notes" hint="Optional" className="sm:col-span-2">
          <Textarea id="e-notes" value={form.notes} onChange={set('notes')} placeholder="Service history, restrictions, supervisor requirements…" className="min-h-20" />
        </Field>
      </form>
    </Dialog>
  )
}

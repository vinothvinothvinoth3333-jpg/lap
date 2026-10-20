import 'server-only'

import type { RowDataPacket } from 'mysql2/promise'
import { query } from '@/lib/db'
import type { AppUser, Booking, Equipment, Laboratory, Notification } from '@/lib/data'

type LabRow = RowDataPacket & Laboratory
type UserRow = RowDataPacket & AppUser
type EquipmentRow = RowDataPacket & {
  id: string
  name: string
  lab_id: string
  total: number
  available: number
  condition_name: Equipment['condition']
  status: Equipment['status']
  notes: string
}
type BookingRow = RowDataPacket & {
  id: string
  user_eid: string
  lab_id: string
  booking_date: string
  start_time: string
  end_time: string
  purpose: string
  status: Booking['status']
  created_at: string
}
type NotificationRow = RowDataPacket & {
  id: string
  kind: Notification['kind']
  title: string
  body: string
  notification_time: string
  unread: number
}

export async function getLabs(): Promise<Laboratory[]> {
  return query<LabRow[]>('SELECT id, name, number, location, capacity, status, description FROM laboratories ORDER BY id')
}

export async function getUsers(): Promise<AppUser[]> {
  return query<UserRow[]>('SELECT eid, name, type, faculty, department, contact FROM users ORDER BY name')
}

export async function getEquipment(): Promise<Equipment[]> {
  const rows = await query<EquipmentRow[]>('SELECT id, name, lab_id, total, available, condition_name, status, notes FROM equipment ORDER BY id')
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    labId: row.lab_id,
    total: row.total,
    available: row.available,
    condition: row.condition_name,
    status: row.status,
    notes: row.notes,
  }))
}

export async function getBookings(): Promise<Booking[]> {
  const rows = await query<BookingRow[]>('SELECT id, user_eid, lab_id, DATE_FORMAT(booking_date, \'%Y-%m-%d\') AS booking_date, TIME_FORMAT(start_time, \'%H:%i\') AS start_time, TIME_FORMAT(end_time, \'%H:%i\') AS end_time, purpose, status, DATE_FORMAT(created_at, \'%Y-%m-%d %H:%i\') AS created_at FROM bookings ORDER BY booking_date, start_time')
  const equipmentRows = await query<(RowDataPacket & { booking_id: string; equipment_id: string; quantity: number })[]>('SELECT booking_id, equipment_id, quantity FROM booking_equipment')
  const equipmentByBooking = new Map<string, Booking['equipment']>()
  for (const row of equipmentRows) {
    const items = equipmentByBooking.get(row.booking_id) ?? []
    items.push({ equipmentId: row.equipment_id, qty: row.quantity })
    equipmentByBooking.set(row.booking_id, items)
  }
  return rows.map((row) => ({
    id: row.id,
    userEid: row.user_eid,
    labId: row.lab_id,
    date: row.booking_date,
    start: row.start_time,
    end: row.end_time,
    purpose: row.purpose,
    status: row.status,
    equipment: equipmentByBooking.get(row.id) ?? [],
    createdAt: row.created_at,
  }))
}

export async function getNotifications(): Promise<Notification[]> {
  const rows = await query<NotificationRow[]>('SELECT id, kind, title, body, notification_time, unread FROM notifications ORDER BY id')
  return rows.map((row) => ({
    id: row.id,
    kind: row.kind,
    title: row.title,
    body: row.body,
    time: row.notification_time,
    unread: Boolean(row.unread),
  }))
}

export async function findBookingConflicts(labId: string, date: string, start: string, end: string) {
  return query<BookingRow[]>(`SELECT id, user_eid, lab_id, DATE_FORMAT(booking_date, '%Y-%m-%d') AS booking_date, TIME_FORMAT(start_time, '%H:%i') AS start_time, TIME_FORMAT(end_time, '%H:%i') AS end_time, purpose, status, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS created_at
    FROM bookings
    WHERE lab_id = :labId AND booking_date = :date
      AND status IN ('approved', 'pending')
      AND start_time < :end AND end_time > :start
    ORDER BY start_time`, { labId, date, start, end })
}

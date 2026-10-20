export type LabStatus = 'available' | 'unavailable' | 'maintenance'
export type BookingStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'completed'
export type EquipmentStatus = 'available' | 'unavailable' | 'maintenance'
export type UserType = 'student' | 'lecturer'

export interface Laboratory {
  id: string
  name: string
  number: string
  location: string
  capacity: number
  status: LabStatus
  description: string
}

export interface AppUser {
  eid: string
  name: string
  type: UserType
  faculty: string
  department: string
  contact: string
}

export interface Equipment {
  id: string
  name: string
  labId: string
  total: number
  available: number
  condition: 'Good' | 'Fair' | 'Poor'
  status: EquipmentStatus
  notes: string
}

export interface Booking {
  id: string
  userEid: string
  labId: string
  date: string // YYYY-MM-DD
  start: string // HH:MM 24h
  end: string
  purpose: string
  status: BookingStatus
  equipment: { equipmentId: string; qty: number }[]
  createdAt: string
}

export interface Notification {
  id: string
  kind: 'request' | 'approved' | 'rejected' | 'maintenance'
  title: string
  body: string
  time: string
  unread: boolean
}

export const TODAY = '2026-09-08'

export const labs: Laboratory[] = [
  {
    id: 'LAB-001',
    name: 'Nanotechnology Laboratory',
    number: 'B2-104',
    location: 'Science Block B, Level 2',
    capacity: 24,
    status: 'available',
    description:
      'Equipped for nanoscale materials characterisation, with a clean bench and fume hood.',
  },
  {
    id: 'LAB-002',
    name: 'Biology Laboratory',
    number: 'A1-012',
    location: 'Science Block A, Ground Floor',
    capacity: 40,
    status: 'available',
    description:
      'General biology teaching laboratory used for undergraduate practical sessions.',
  },
  {
    id: 'LAB-003',
    name: 'Organic Chemistry Laboratory',
    number: 'C3-301',
    location: 'Chemistry Wing C, Level 3',
    capacity: 32,
    status: 'maintenance',
    description:
      'Wet chemistry laboratory. Currently closed for ventilation system servicing.',
  },
  {
    id: 'LAB-004',
    name: 'Physics Laboratory',
    number: 'D1-110',
    location: 'Engineering Block D, Level 1',
    capacity: 30,
    status: 'available',
    description: 'Mechanics, optics and electromagnetism experiments.',
  },
  {
    id: 'LAB-005',
    name: 'Computer Laboratory 1',
    number: 'E2-205',
    location: 'IT Building E, Level 2',
    capacity: 60,
    status: 'available',
    description: '60 workstations with development and simulation software.',
  },
  {
    id: 'LAB-006',
    name: 'Microbiology Laboratory',
    number: 'A2-118',
    location: 'Science Block A, Level 2',
    capacity: 20,
    status: 'unavailable',
    description: 'Biosafety Level 2 laboratory. Reserved for research use only this week.',
  },
  {
    id: 'LAB-007',
    name: 'Electronics Laboratory',
    number: 'D2-214',
    location: 'Engineering Block D, Level 2',
    capacity: 36,
    status: 'available',
    description: 'Circuit design, PCB prototyping and embedded systems benches.',
  },
  {
    id: 'LAB-008',
    name: 'Analytical Chemistry Laboratory',
    number: 'C2-210',
    location: 'Chemistry Wing C, Level 2',
    capacity: 28,
    status: 'available',
    description: 'Spectroscopy and chromatography instruments for analytical work.',
  },
  {
    id: 'LAB-009',
    name: 'Robotics Laboratory',
    number: 'E3-310',
    location: 'IT Building E, Level 3',
    capacity: 18,
    status: 'available',
    description: 'Robot arms, mobile platforms and a motion-capture test area.',
  },
  {
    id: 'LAB-010',
    name: 'Environmental Science Laboratory',
    number: 'B1-020',
    location: 'Science Block B, Ground Floor',
    capacity: 26,
    status: 'available',
    description: 'Soil, water and air quality testing.',
  },
]

export const users: AppUser[] = [
  { eid: 'E20210451', name: 'Amara Perera', type: 'student', faculty: 'Faculty of Science', department: 'Chemistry', contact: '+94 77 123 4567' },
  { eid: 'E20200132', name: 'Kasun Jayasinghe', type: 'student', faculty: 'Faculty of Engineering', department: 'Electrical Engineering', contact: '+94 71 987 6543' },
  { eid: 'L10000231', name: 'Dr. Nirmala Fernando', type: 'lecturer', faculty: 'Faculty of Science', department: 'Biology', contact: '+94 11 234 5678' },
  { eid: 'L10000087', name: 'Prof. Ranjith Silva', type: 'lecturer', faculty: 'Faculty of Science', department: 'Physics', contact: '+94 11 876 5432' },
  { eid: 'E20220874', name: 'Dilini Wickramasinghe', type: 'student', faculty: 'Faculty of Science', department: 'Microbiology', contact: '+94 76 555 0192' },
  { eid: 'E20190319', name: 'Tharindu Bandara', type: 'student', faculty: 'Faculty of Computing', department: 'Computer Science', contact: '+94 70 220 3311' },
  { eid: 'L10000412', name: 'Dr. Sanduni Rathnayake', type: 'lecturer', faculty: 'Faculty of Computing', department: 'Robotics & AI', contact: '+94 11 445 6677' },
  { eid: 'E20230015', name: 'Ishara Gunawardena', type: 'student', faculty: 'Faculty of Engineering', department: 'Electronics', contact: '+94 75 334 8890' },
  { eid: 'L10000158', name: 'Dr. Mahesh Kumara', type: 'lecturer', faculty: 'Faculty of Science', department: 'Environmental Science', contact: '+94 11 998 7766' },
  { eid: 'E20210902', name: 'Nethmi Abeysekara', type: 'student', faculty: 'Faculty of Science', department: 'Nanotechnology', contact: '+94 72 110 4455' },
]

export const equipment: Equipment[] = [
  { id: 'EQ-001', name: 'Microscope', labId: 'LAB-002', total: 5, available: 4, condition: 'Good', status: 'available', notes: 'One unit reserved for demonstration.' },
  { id: 'EQ-002', name: 'Centrifuge', labId: 'LAB-002', total: 2, available: 2, condition: 'Good', status: 'available', notes: '' },
  { id: 'EQ-003', name: 'Spectrophotometer', labId: 'LAB-008', total: 1, available: 0, condition: 'Fair', status: 'maintenance', notes: 'Lamp replacement scheduled 12 Sep.' },
  { id: 'EQ-004', name: 'Analytical Balance', labId: 'LAB-008', total: 3, available: 3, condition: 'Good', status: 'available', notes: '' },
  { id: 'EQ-005', name: 'Atomic Force Microscope', labId: 'LAB-001', total: 1, available: 1, condition: 'Good', status: 'available', notes: 'Requires trained supervisor.' },
  { id: 'EQ-006', name: 'Fume Hood', labId: 'LAB-001', total: 2, available: 2, condition: 'Good', status: 'available', notes: '' },
  { id: 'EQ-007', name: 'Oscilloscope', labId: 'LAB-007', total: 12, available: 10, condition: 'Good', status: 'available', notes: '' },
  { id: 'EQ-008', name: 'Soldering Station', labId: 'LAB-007', total: 15, available: 15, condition: 'Fair', status: 'available', notes: '' },
  { id: 'EQ-009', name: 'Autoclave', labId: 'LAB-006', total: 1, available: 0, condition: 'Poor', status: 'unavailable', notes: 'Pressure valve fault reported.' },
  { id: 'EQ-010', name: 'Laser Interferometer', labId: 'LAB-004', total: 2, available: 2, condition: 'Good', status: 'available', notes: '' },
  { id: 'EQ-011', name: 'Robotic Arm (6-DOF)', labId: 'LAB-009', total: 4, available: 3, condition: 'Good', status: 'available', notes: '' },
  { id: 'EQ-012', name: 'Water Quality Kit', labId: 'LAB-010', total: 6, available: 6, condition: 'Good', status: 'available', notes: '' },
  { id: 'EQ-013', name: 'Rotary Evaporator', labId: 'LAB-003', total: 2, available: 0, condition: 'Fair', status: 'maintenance', notes: 'Lab under maintenance.' },
]

export const bookings: Booking[] = [
  { id: 'B001', userEid: 'E20210902', labId: 'LAB-001', date: TODAY, start: '10:00', end: '12:00', purpose: 'Nanoparticle synthesis research', status: 'approved', equipment: [{ equipmentId: 'EQ-005', qty: 1 }], createdAt: '2026-09-05 09:12' },
  { id: 'B002', userEid: 'L10000231', labId: 'LAB-002', date: TODAY, start: '14:00', end: '16:00', purpose: 'BIO 201 practical: cell staining', status: 'approved', equipment: [{ equipmentId: 'EQ-001', qty: 4 }], createdAt: '2026-09-04 15:40' },
  { id: 'B003', userEid: 'E20200132', labId: 'LAB-007', date: TODAY, start: '09:00', end: '11:00', purpose: 'Final year project: sensor calibration', status: 'pending', equipment: [{ equipmentId: 'EQ-007', qty: 2 }], createdAt: '2026-09-07 18:05' },
  { id: 'B004', userEid: 'E20190319', labId: 'LAB-005', date: TODAY, start: '13:00', end: '15:00', purpose: 'Distributed systems assignment testing', status: 'completed', equipment: [], createdAt: '2026-09-02 11:30' },
  { id: 'B005', userEid: 'L10000087', labId: 'LAB-004', date: '2026-09-09', start: '08:00', end: '10:00', purpose: 'PHY 102 optics demonstration', status: 'approved', equipment: [{ equipmentId: 'EQ-010', qty: 1 }], createdAt: '2026-09-03 10:00' },
  { id: 'B006', userEid: 'E20220874', labId: 'LAB-006', date: '2026-09-09', start: '10:00', end: '13:00', purpose: 'Bacterial culture growth observation', status: 'pending', equipment: [{ equipmentId: 'EQ-009', qty: 1 }], createdAt: '2026-09-08 07:45' },
  { id: 'B007', userEid: 'L10000412', labId: 'LAB-009', date: '2026-09-10', start: '09:00', end: '12:00', purpose: 'Robotics workshop for second-year students', status: 'pending', equipment: [{ equipmentId: 'EQ-011', qty: 3 }], createdAt: '2026-09-08 08:20' },
  { id: 'B008', userEid: 'E20230015', labId: 'LAB-007', date: '2026-09-10', start: '14:00', end: '16:00', purpose: 'PCB soldering practice', status: 'pending', equipment: [{ equipmentId: 'EQ-008', qty: 4 }], createdAt: '2026-09-08 08:55' },
  { id: 'B009', userEid: 'E20210451', labId: 'LAB-003', date: '2026-09-11', start: '10:00', end: '12:00', purpose: 'Esterification experiment', status: 'rejected', equipment: [{ equipmentId: 'EQ-013', qty: 1 }], createdAt: '2026-09-06 12:10' },
  { id: 'B010', userEid: 'L10000158', labId: 'LAB-010', date: '2026-09-11', start: '13:00', end: '17:00', purpose: 'Field sample analysis', status: 'approved', equipment: [{ equipmentId: 'EQ-012', qty: 4 }], createdAt: '2026-09-05 16:00' },
  { id: 'B011', userEid: 'E20190319', labId: 'LAB-005', date: '2026-09-07', start: '09:00', end: '11:00', purpose: 'Database lab exercise', status: 'cancelled', equipment: [], createdAt: '2026-09-01 09:00' },
  { id: 'B012', userEid: 'E20200132', labId: 'LAB-007', date: '2026-09-12', start: '09:00', end: '12:00', purpose: 'Embedded systems demo rehearsal', status: 'approved', equipment: [{ equipmentId: 'EQ-007', qty: 3 }], createdAt: '2026-09-06 14:20' },
  { id: 'B013', userEid: 'L10000231', labId: 'LAB-002', date: '2026-09-10', start: '08:00', end: '10:00', purpose: 'BIO 101 introductory microscopy', status: 'approved', equipment: [{ equipmentId: 'EQ-001', qty: 5 }], createdAt: '2026-09-04 15:50' },
  { id: 'B014', userEid: 'E20210902', labId: 'LAB-001', date: '2026-09-10', start: '13:00', end: '15:00', purpose: 'AFM imaging session', status: 'approved', equipment: [{ equipmentId: 'EQ-005', qty: 1 }], createdAt: '2026-09-07 09:30' },
  { id: 'B015', userEid: 'E20210451', labId: 'LAB-008', date: TODAY, start: '11:00', end: '13:00', purpose: 'Titration accuracy study', status: 'approved', equipment: [{ equipmentId: 'EQ-004', qty: 1 }], createdAt: '2026-09-06 10:00' },
]

export const notifications: Notification[] = [
  { id: 'N1', kind: 'request', title: 'New booking request', body: 'Ishara Gunawardena requested Electronics Laboratory on 10 Sep, 14:00–16:00.', time: '5 min ago', unread: true },
  { id: 'N2', kind: 'request', title: 'New booking request', body: 'Dr. Sanduni Rathnayake requested Robotics Laboratory on 10 Sep, 09:00–12:00.', time: '38 min ago', unread: true },
  { id: 'N3', kind: 'maintenance', title: 'Laboratory maintenance update', body: 'Organic Chemistry Laboratory ventilation servicing extended to 12 Sep.', time: '2 h ago', unread: true },
  { id: 'N4', kind: 'approved', title: 'Booking approved', body: 'B015 for Analytical Chemistry Laboratory was approved by S. Weerasinghe.', time: 'Yesterday', unread: false },
  { id: 'N5', kind: 'rejected', title: 'Booking rejected', body: 'B009 was rejected: laboratory under maintenance.', time: 'Yesterday', unread: false },
]

export const currentStaff = {
  name: 'S. Weerasinghe',
  role: 'Laboratory Coordinator',
  eid: 'S00012',
  initials: 'SW',
}

/* ---------- helpers ---------- */

export const labById = (id: string) => labs.find((l) => l.id === id)
export const userByEid = (eid: string) => users.find((u) => u.eid === eid)
export const equipmentById = (id: string) => equipment.find((e) => e.id === id)

export function formatTime(t: string) {
  const [h, m] = t.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${hour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${suffix}`
}

export function formatDate(d: string) {
  const [y, m, day] = d.split('-').map(Number)
  return new Date(y, m - 1, day).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function toMinutes(t: string) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

/** Returns bookings that overlap the requested period (double-booking check). */
export function findConflicts(labId: string, date: string, start: string, end: string) {
  const s = toMinutes(start)
  const e = toMinutes(end)
  return bookings.filter(
    (b) =>
      b.labId === labId &&
      b.date === date &&
      (b.status === 'approved' || b.status === 'pending') &&
      toMinutes(b.start) < e &&
      toMinutes(b.end) > s,
  )
}

export const labStatusLabel: Record<LabStatus, string> = {
  available: 'Available',
  unavailable: 'Unavailable',
  maintenance: 'Under Maintenance',
}

export const bookingStatusLabel: Record<BookingStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
  completed: 'Completed',
}
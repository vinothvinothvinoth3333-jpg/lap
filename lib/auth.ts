export type AuthSession = {
  eid: string
  name: string
  role: string
  initials: string
}

const AUTH_KEY = 'lab-auth-session'

const DEFAULT_CREDENTIALS: Record<string, string> = {
  S00012: 'lab-admin-2026',
  L10000231: 'lab-admin-2026',
  L10000087: 'lab-admin-2026',
  L10000412: 'lab-admin-2026',
  L10000158: 'lab-admin-2026',
}

const fallbackUsers: Record<string, Omit<AuthSession, 'initials'>> = {
  S00012: { eid: 'S00012', name: 'S. Weerasinghe', role: 'Laboratory Coordinator' },
  L10000231: { eid: 'L10000231', name: 'Dr. Nirmala Fernando', role: 'Biology Lecturer' },
  L10000087: { eid: 'L10000087', name: 'Prof. Ranjith Silva', role: 'Physics Lecturer' },
  L10000412: { eid: 'L10000412', name: 'Dr. Sanduni Rathnayake', role: 'Robotics & AI Lecturer' },
  L10000158: { eid: 'L10000158', name: 'Dr. Mahesh Kumara', role: 'Environmental Science Lecturer' },
}

export function authenticate(eid: string, password: string): AuthSession | null {
  const normalizedEid = eid.trim()
  if (!normalizedEid || !DEFAULT_CREDENTIALS[normalizedEid]) return null
  if (password !== DEFAULT_CREDENTIALS[normalizedEid]) return null

  const user = fallbackUsers[normalizedEid]
  return {
    eid: user.eid,
    name: user.name,
    role: user.role,
    initials: user.name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase(),
  }
}

export function readSession(): AuthSession | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(AUTH_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as AuthSession
    if (!parsed?.eid || !parsed?.name || !parsed?.role) return null
    return parsed
  } catch {
    return null
  }
}

export function saveSession(session: AuthSession) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(AUTH_KEY, JSON.stringify(session))
}

export function clearSession() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(AUTH_KEY)
}

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toSqlDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`Invalid SQL date: ${value}`)
  }
  return value
}

export function toSqlTime(value: string) {
  if (!/^\d{2}:\d{2}$/.test(value)) {
    throw new Error(`Invalid SQL time: ${value}`)
  }
  return `${value}:00`
}

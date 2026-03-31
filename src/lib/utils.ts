import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { EstadoCamion, EstadoViaje } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string | null): string {
  if (!dateString) return '—'
  try {
    return format(parseISO(dateString), 'dd/MM/yyyy HH:mm', { locale: es })
  } catch {
    return dateString
  }
}

export function formatDateOnly(dateString: string | null): string {
  if (!dateString) return '—'
  try {
    return format(parseISO(dateString), 'dd/MM/yyyy', { locale: es })
  } catch {
    return dateString
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

export function estadoViajeLabel(estado: EstadoViaje): string {
  const labels: Record<EstadoViaje, string> = {
    pendiente: 'Pendiente',
    completado: 'Completado',
    cancelado: 'Cancelado',
  }
  return labels[estado]
}

export function estadoCamionLabel(estado: EstadoCamion): string {
  const labels: Record<EstadoCamion, string> = {
    disponible: 'Disponible',
    en_viaje: 'En viaje',
    inactivo: 'Inactivo',
  }
  return labels[estado]
}

export function estadoViajeColor(estado: EstadoViaje): string {
  const colors: Record<EstadoViaje, string> = {
    pendiente: 'bg-amber-100 text-amber-800',
    completado: 'bg-green-100 text-green-800',
    cancelado: 'bg-red-100 text-red-800',
  }
  return colors[estado]
}

export function estadoCamionColor(estado: EstadoCamion): string {
  const colors: Record<EstadoCamion, string> = {
    disponible: 'bg-green-100 text-green-800',
    en_viaje: 'bg-blue-100 text-blue-800',
    inactivo: 'bg-gray-100 text-gray-600',
  }
  return colors[estado]
}

export function exportToCSV(data: Record<string, unknown>[], filename: string): void {
  if (data.length === 0) return
  const headers = Object.keys(data[0])
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers.map(h => {
        const val = String(row[h] ?? '')
        return val.includes(',') ? `"${val}"` : val
      }).join(',')
    ),
  ]
  const blob = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export const TIPOS_CARGA = [
  'Carga general',
  'Alimentos refrigerados',
  'Alimentos secos',
  'Materiales de construcción',
  'Materiales peligrosos',
  'Maquinaria',
  'Bebidas',
  'Farmacéuticos',
  'Electrónica',
  'Textiles',
]

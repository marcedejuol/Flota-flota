'use client'

import { useApp } from '@/lib/store'
import {
  formatCurrency,
  formatDate,
  estadoViajeColor,
  estadoViajeLabel,
  estadoCamionColor,
  estadoCamionLabel,
} from '@/lib/utils'
import { MapPin, AlertCircle, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import Link from 'next/link'

function greeting(): string {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return 'Buenos días'
  if (h >= 12 && h < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string | number
  sub?: string
  accent: string
}) {
  return (
    <div className="stat-card relative overflow-hidden">
      <div className={`absolute top-0 inset-x-0 h-0.5 ${accent}`} />
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">{label}</p>
      <p className="text-4xl font-bold text-gray-900 mt-3 tabular-nums leading-none">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-2.5 leading-relaxed">{sub}</p>}
    </div>
  )
}

export default function Dashboard() {
  const { state, isLoaded } = useApp()

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-200 border-t-blue-600" />
      </div>
    )
  }

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const viajesHoy = state.viajes.filter(v => new Date(v.createdAt) >= startOfToday)
  const completadosHoy = viajesHoy.filter(v => v.estado === 'completado').length
  const enCursoHoy = viajesHoy.filter(v => v.estado === 'pendiente').length
  const pendienteTotal = state.viajes.filter(v => v.estado === 'pendiente').length

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

  const facturadoMes = state.viajes
    .filter(v => v.estado === 'completado' && new Date(v.fechaSalida) >= startOfMonth)
    .reduce((sum, v) => sum + v.tarifa, 0)

  const facturadoMesAnterior = state.viajes
    .filter(v =>
      v.estado === 'completado' &&
      new Date(v.fechaSalida) >= startOfPrevMonth &&
      new Date(v.fechaSalida) <= endOfPrevMonth
    )
    .reduce((sum, v) => sum + v.tarifa, 0)

  const diff = facturadoMesAnterior > 0
    ? Math.round(((facturadoMes - facturadoMesAnterior) / facturadoMesAnterior) * 100)
    : 0

  const ultimosViajes = [...state.viajes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)

  const dateLabel = now.toLocaleDateString('es-PY', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
            {dateLabel}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">{greeting()}</h1>
          <p className="text-gray-400 mt-1.5 text-sm">
            Aquí está el resumen de operaciones de hoy.
          </p>
        </div>
        <Link href="/viajes/nuevo" className="btn-primary shrink-0">
          <MapPin size={15} />
          Nuevo viaje
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Viajes hoy"
          value={viajesHoy.length}
          sub={`${completadosHoy} completado${completadosHoy !== 1 ? 's' : ''} · ${enCursoHoy} en curso`}
          accent="bg-blue-500"
        />
        <StatCard
          label="En ruta ahora"
          value={pendienteTotal}
          sub="Viajes activos en este momento"
          accent="bg-amber-400"
        />
        <StatCard
          label="Completados hoy"
          value={completadosHoy}
          sub="Llegaron a destino"
          accent="bg-emerald-500"
        />
        <StatCard
          label="Camiones activos"
          value={state.camiones.filter(c => c.estado === 'en_viaje').length}
          sub={`de ${state.camiones.length} unidades en flota`}
          accent="bg-violet-500"
        />
      </div>

      {/* Billing comparison */}
      <div className="card p-6">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-5">Facturación mensual</p>
        <div className="flex flex-col sm:flex-row sm:items-end gap-6">
          <div>
            <p className="text-xs text-gray-400 mb-1">Mes actual</p>
            <p className="text-4xl font-bold text-gray-900 tabular-nums leading-none">{formatCurrency(facturadoMes)}</p>
          </div>
          <div className="sm:border-l sm:border-gray-100 sm:pl-6">
            <p className="text-xs text-gray-400 mb-1">Mes anterior</p>
            <p className="text-2xl font-semibold text-gray-300 tabular-nums leading-none">{formatCurrency(facturadoMesAnterior)}</p>
          </div>
          <div className="sm:ml-auto">
            {diff === 0 ? (
              <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
                <Minus size={14} />
                Sin variación
              </div>
            ) : diff > 0 ? (
              <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
                <ArrowUpRight size={14} />
                +{diff}% vs mes anterior
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-full">
                <ArrowDownRight size={14} />
                {diff}% vs mes anterior
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Truck grid */}
      <div>
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4">Estado de flota</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {state.camiones.map(camion => {
            const chofer = state.choferes.find(ch => ch.camionAsignadoId === camion.id)
            const viajeActivo = state.viajes.find(v => v.camionId === camion.id && v.estado === 'pendiente')

            return (
              <div
                key={camion.id}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-sm text-gray-900">{camion.patente}</span>
                  <span className={`badge ${estadoCamionColor(camion.estado)}`}>
                    {estadoCamionLabel(camion.estado)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{camion.modelo}</p>
                {chofer && (
                  <p className="text-xs text-gray-500 mt-2 truncate">{chofer.nombre}</p>
                )}
                {viajeActivo && (
                  <p className="text-xs text-blue-500 mt-1.5 font-medium truncate">
                    → {viajeActivo.destino}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent trips */}
      <div className="card">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Últimos viajes</p>
          <Link href="/viajes" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
            Ver todos →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/70">
              <tr>
                <th className="table-header">Camión</th>
                <th className="table-header">Chofer</th>
                <th className="table-header">Ruta</th>
                <th className="table-header">Cliente</th>
                <th className="table-header">Salida</th>
                <th className="table-header text-right">Tarifa</th>
                <th className="table-header">Estado</th>
              </tr>
            </thead>
            <tbody>
              {ultimosViajes.map(viaje => {
                const camion = state.camiones.find(c => c.id === viaje.camionId)
                const chofer = state.choferes.find(ch => ch.id === viaje.choferId)
                const cliente = state.clientes.find(cl => cl.id === viaje.clienteId)
                return (
                  <tr key={viaje.id} className="table-row">
                    <td className="table-cell font-semibold text-gray-800">{camion?.patente || '—'}</td>
                    <td className="table-cell text-gray-500">{chofer?.nombre || '—'}</td>
                    <td className="table-cell">
                      <span className="text-gray-400 text-xs">{viaje.origen}</span>
                      <span className="text-gray-300 mx-1.5 text-xs">→</span>
                      <span className="text-sm">{viaje.destino}</span>
                    </td>
                    <td className="table-cell text-gray-400 text-xs max-w-[130px] truncate">
                      {cliente?.nombre.split(' ').slice(0, 2).join(' ') || '—'}
                    </td>
                    <td className="table-cell text-gray-400 text-xs whitespace-nowrap">{formatDate(viaje.fechaSalida)}</td>
                    <td className="table-cell text-right font-semibold tabular-nums">{formatCurrency(viaje.tarifa)}</td>
                    <td className="table-cell">
                      <span className={`badge ${estadoViajeColor(viaje.estado)}`}>
                        {estadoViajeLabel(viaje.estado)}
                      </span>
                    </td>
                  </tr>
                )
              })}
              {ultimosViajes.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-300">
                    <AlertCircle size={18} className="mx-auto mb-2" />
                    Sin viajes registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

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
import { Truck, MapPin, CheckCircle, Clock, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import Link from 'next/link'

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string
  value: string | number
  sub?: string
  icon: React.ElementType
  color: string
}) {
  return (
    <div className="stat-card flex items-start gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { state, isLoaded } = useApp()

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // Today stats
  const viajesHoy = state.viajes.filter(v => new Date(v.createdAt) >= startOfToday)
  const completadosHoy = viajesHoy.filter(v => v.estado === 'completado').length
  const enCursoHoy = viajesHoy.filter(v => v.estado === 'pendiente').length
  const pendientesHoy = state.viajes.filter(v => v.estado === 'pendiente').length

  // Billing: current month vs previous month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

  const facturadoMes = state.viajes
    .filter(v => v.estado === 'completado' && new Date(v.fechaSalida) >= startOfMonth)
    .reduce((sum, v) => sum + v.tarifa, 0)

  const facturadoMesAnterior = state.viajes
    .filter(
      v =>
        v.estado === 'completado' &&
        new Date(v.fechaSalida) >= startOfPrevMonth &&
        new Date(v.fechaSalida) <= endOfPrevMonth
    )
    .reduce((sum, v) => sum + v.tarifa, 0)

  const diff = facturadoMesAnterior > 0
    ? Math.round(((facturadoMes - facturadoMesAnterior) / facturadoMesAnterior) * 100)
    : 0
  const diffPositive = diff >= 0

  // Last 5 trips
  const ultimosViajes = [...state.viajes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            {now.toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link href="/viajes/nuevo" className="btn-primary">
          <MapPin size={16} />
          Registrar viaje
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Viajes hoy"
          value={viajesHoy.length}
          sub={`${completadosHoy} completados · ${enCursoHoy} en curso`}
          icon={MapPin}
          color="bg-blue-600"
        />
        <StatCard
          label="Viajes pendientes"
          value={pendientesHoy}
          sub="En curso actualmente"
          icon={Clock}
          color="bg-amber-500"
        />
        <StatCard
          label="Completados hoy"
          value={completadosHoy}
          sub="Viajes finalizados"
          icon={CheckCircle}
          color="bg-green-600"
        />
        <StatCard
          label="Camiones activos"
          value={state.camiones.filter(c => c.estado === 'en_viaje').length}
          sub={`de ${state.camiones.length} en flota`}
          icon={Truck}
          color="bg-slate-700"
        />
      </div>

      {/* Billing comparison */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Facturación mensual</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500">Mes actual</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(facturadoMes)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Mes anterior</p>
            <p className="text-3xl font-bold text-gray-400 mt-1">{formatCurrency(facturadoMesAnterior)}</p>
          </div>
          <div className="flex items-start gap-2">
            <div className={`mt-5 flex items-center gap-1 text-sm font-semibold ${diffPositive ? 'text-green-600' : 'text-red-600'}`}>
              {diffPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
              {diffPositive ? '+' : ''}{diff}% vs mes anterior
            </div>
          </div>
        </div>
      </div>

      {/* Truck status grid */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Estado de flota</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {state.camiones.map(camion => {
            const chofer = state.choferes.find(ch => ch.camionAsignadoId === camion.id)
            const viajeActivo = state.viajes.find(
              v => v.camionId === camion.id && v.estado === 'pendiente'
            )
            const clienteActivo = viajeActivo
              ? state.clientes.find(cl => cl.id === viajeActivo.clienteId)
              : null

            return (
              <div
                key={camion.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Truck size={16} className="text-slate-600" />
                  </div>
                  <span className={`badge ${estadoCamionColor(camion.estado)}`}>
                    {estadoCamionLabel(camion.estado)}
                  </span>
                </div>
                <p className="font-semibold text-gray-900 text-sm">{camion.patente}</p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{camion.modelo}</p>
                {chofer && (
                  <p className="text-xs text-gray-400 mt-2 truncate">{chofer.nombre}</p>
                )}
                {viajeActivo && (
                  <p className="text-xs text-blue-600 mt-1 truncate">
                    → {viajeActivo.destino}
                  </p>
                )}
                {clienteActivo && (
                  <p className="text-xs text-gray-400 truncate">{clienteActivo.nombre.split(' ')[0]}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent trips */}
      <div className="card">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Últimos viajes</h2>
          <Link href="/viajes" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Ver todos →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Camión</th>
                <th className="table-header">Chofer</th>
                <th className="table-header">Ruta</th>
                <th className="table-header">Cliente</th>
                <th className="table-header">Fecha</th>
                <th className="table-header">Tarifa</th>
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
                    <td className="table-cell font-medium">{camion?.patente || '—'}</td>
                    <td className="table-cell">{chofer?.nombre || '—'}</td>
                    <td className="table-cell">
                      <span className="text-gray-500">{viaje.origen}</span>
                      <span className="text-gray-300 mx-1">→</span>
                      <span>{viaje.destino}</span>
                    </td>
                    <td className="table-cell text-gray-500 max-w-[140px] truncate">
                      {cliente?.nombre || '—'}
                    </td>
                    <td className="table-cell text-gray-500">{formatDate(viaje.fechaSalida)}</td>
                    <td className="table-cell font-medium">{formatCurrency(viaje.tarifa)}</td>
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
                  <td colSpan={7} className="table-cell text-center text-gray-400 py-8">
                    <AlertCircle size={20} className="mx-auto mb-2" />
                    No hay viajes registrados
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

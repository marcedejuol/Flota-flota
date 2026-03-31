'use client'

import { useState, useMemo } from 'react'
import { useApp } from '@/lib/store'
import {
  formatDate,
  formatCurrency,
  estadoViajeColor,
  estadoViajeLabel,
  exportToCSV,
  TIPOS_CARGA,
} from '@/lib/utils'
import { EstadoViaje, Viaje } from '@/types'
import {
  Plus,
  Search,
  Download,
  Filter,
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
  X,
  Save,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'

type SortKey = keyof Viaje | 'camionPatente' | 'choferNombre' | 'clienteNombre'
type SortDir = 'asc' | 'desc'

function today() {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
}

function EditModal({
  viaje,
  onClose,
  onSave,
  state,
}: {
  viaje: Viaje
  onClose: () => void
  onSave: (data: Partial<Viaje>) => void
  state: ReturnType<typeof useApp>['state']
}) {
  const [form, setForm] = useState({
    camionId: viaje.camionId,
    choferId: viaje.choferId,
    fechaSalida: viaje.fechaSalida ? viaje.fechaSalida.slice(0, 16) : '',
    fechaLlegada: viaje.fechaLlegada ? viaje.fechaLlegada.slice(0, 16) : '',
    origen: viaje.origen,
    destino: viaje.destino,
    tipoCarga: viaje.tipoCarga,
    clienteId: viaje.clienteId,
    distanciaKm: String(viaje.distanciaKm),
    tarifa: String(viaje.tarifa),
    estado: viaje.estado as EstadoViaje,
    observaciones: viaje.observaciones,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleSave() {
    onSave({
      camionId: form.camionId,
      choferId: form.choferId,
      fechaSalida: new Date(form.fechaSalida).toISOString(),
      fechaLlegada: form.fechaLlegada ? new Date(form.fechaLlegada).toISOString() : null,
      origen: form.origen,
      destino: form.destino,
      tipoCarga: form.tipoCarga,
      clienteId: form.clienteId,
      distanciaKm: Number(form.distanciaKm),
      tarifa: Number(form.tarifa),
      estado: form.estado,
      observaciones: form.observaciones,
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Editar viaje</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Camión</label>
              <select name="camionId" value={form.camionId} onChange={handleChange} className="form-select">
                {state.camiones.map(c => (
                  <option key={c.id} value={c.id}>{c.patente} — {c.modelo}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Chofer</label>
              <select name="choferId" value={form.choferId} onChange={handleChange} className="form-select">
                {state.choferes.map(ch => (
                  <option key={ch.id} value={ch.id}>{ch.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Fecha salida</label>
              <input type="datetime-local" name="fechaSalida" value={form.fechaSalida} onChange={handleChange} className="form-input" />
            </div>
            <div>
              <label className="form-label">Fecha llegada</label>
              <input type="datetime-local" name="fechaLlegada" value={form.fechaLlegada} onChange={handleChange} className="form-input" />
            </div>
            <div>
              <label className="form-label">Origen</label>
              <input type="text" name="origen" value={form.origen} onChange={handleChange} className="form-input" />
            </div>
            <div>
              <label className="form-label">Destino</label>
              <input type="text" name="destino" value={form.destino} onChange={handleChange} className="form-input" />
            </div>
            <div>
              <label className="form-label">Tipo de carga</label>
              <select name="tipoCarga" value={form.tipoCarga} onChange={handleChange} className="form-select">
                {TIPOS_CARGA.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Cliente</label>
              <select name="clienteId" value={form.clienteId} onChange={handleChange} className="form-select">
                {state.clientes.map(cl => (
                  <option key={cl.id} value={cl.id}>{cl.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Distancia (km)</label>
              <input type="number" name="distanciaKm" value={form.distanciaKm} onChange={handleChange} className="form-input" />
            </div>
            <div>
              <label className="form-label">Tarifa (CLP)</label>
              <input type="number" name="tarifa" value={form.tarifa} onChange={handleChange} className="form-input" />
            </div>
            <div className="col-span-2">
              <label className="form-label">Estado</label>
              <select name="estado" value={form.estado} onChange={handleChange} className="form-select">
                <option value="pendiente">Pendiente</option>
                <option value="completado">Completado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="form-label">Observaciones</label>
              <textarea name="observaciones" value={form.observaciones} onChange={handleChange} rows={2} className="form-textarea" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-100">
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button onClick={handleSave} className="btn-primary">
            <Save size={14} />
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ListadoViajes() {
  const { state, dispatch } = useApp()

  const [search, setSearch] = useState('')
  const [filterCamion, setFilterCamion] = useState('')
  const [filterChofer, setFilterChofer] = useState('')
  const [filterCliente, setFilterCliente] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [filterTipoCarga, setFilterTipoCarga] = useState('')
  const [filterFechaDesde, setFilterFechaDesde] = useState('')
  const [filterFechaHasta, setFilterFechaHasta] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey>('fechaSalida')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [editingViaje, setEditingViaje] = useState<Viaje | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let result = [...state.viajes]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(v => {
        const camion = state.camiones.find(c => c.id === v.camionId)
        const chofer = state.choferes.find(ch => ch.id === v.choferId)
        const cliente = state.clientes.find(cl => cl.id === v.clienteId)
        return (
          camion?.patente.toLowerCase().includes(q) ||
          chofer?.nombre.toLowerCase().includes(q) ||
          cliente?.nombre.toLowerCase().includes(q) ||
          v.origen.toLowerCase().includes(q) ||
          v.destino.toLowerCase().includes(q) ||
          v.tipoCarga.toLowerCase().includes(q)
        )
      })
    }
    if (filterCamion) result = result.filter(v => v.camionId === filterCamion)
    if (filterChofer) result = result.filter(v => v.choferId === filterChofer)
    if (filterCliente) result = result.filter(v => v.clienteId === filterCliente)
    if (filterEstado) result = result.filter(v => v.estado === filterEstado)
    if (filterTipoCarga) result = result.filter(v => v.tipoCarga === filterTipoCarga)
    if (filterFechaDesde) result = result.filter(v => new Date(v.fechaSalida) >= new Date(filterFechaDesde))
    if (filterFechaHasta) result = result.filter(v => new Date(v.fechaSalida) <= new Date(filterFechaHasta + 'T23:59:59'))

    result.sort((a, b) => {
      let av: string | number = ''
      let bv: string | number = ''
      if (sortKey === 'camionPatente') {
        av = state.camiones.find(c => c.id === a.camionId)?.patente || ''
        bv = state.camiones.find(c => c.id === b.camionId)?.patente || ''
      } else if (sortKey === 'choferNombre') {
        av = state.choferes.find(c => c.id === a.choferId)?.nombre || ''
        bv = state.choferes.find(c => c.id === b.choferId)?.nombre || ''
      } else if (sortKey === 'clienteNombre') {
        av = state.clientes.find(c => c.id === a.clienteId)?.nombre || ''
        bv = state.clientes.find(c => c.id === b.clienteId)?.nombre || ''
      } else {
        av = (a as unknown as Record<string, unknown>)[sortKey] as string | number || ''
        bv = (b as unknown as Record<string, unknown>)[sortKey] as string | number || ''
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [state, search, filterCamion, filterChofer, filterCliente, filterEstado, filterTipoCarga, filterFechaDesde, filterFechaHasta, sortKey, sortDir])

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ChevronDown size={12} className="text-gray-300" />
    return sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
  }

  function handleExport() {
    const rows = filtered.map(v => ({
      Camion: state.camiones.find(c => c.id === v.camionId)?.patente || '',
      Chofer: state.choferes.find(c => c.id === v.choferId)?.nombre || '',
      Cliente: state.clientes.find(c => c.id === v.clienteId)?.nombre || '',
      Origen: v.origen,
      Destino: v.destino,
      TipoCarga: v.tipoCarga,
      FechaSalida: formatDate(v.fechaSalida),
      FechaLlegada: formatDate(v.fechaLlegada),
      DistanciaKm: v.distanciaKm,
      Tarifa: v.tarifa,
      Estado: estadoViajeLabel(v.estado),
      Observaciones: v.observaciones,
    }))
    exportToCSV(rows as Record<string, unknown>[], 'viajes')
  }

  const hasActiveFilters = filterCamion || filterChofer || filterCliente || filterEstado || filterTipoCarga || filterFechaDesde || filterFechaHasta

  function clearFilters() {
    setFilterCamion(''); setFilterChofer(''); setFilterCliente('')
    setFilterEstado(''); setFilterTipoCarga(''); setFilterFechaDesde(''); setFilterFechaHasta('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Viajes</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} viaje{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/viajes/nuevo" className="btn-primary">
          <Plus size={16} />
          Nuevo viaje
        </Link>
      </div>

      {/* Search and filters bar */}
      <div className="card p-4 space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por camión, chofer, cliente, ruta..."
              className="form-input pl-9"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary ${hasActiveFilters ? 'border-blue-400 text-blue-600' : ''}`}
          >
            <Filter size={14} />
            Filtros
            {hasActiveFilters && (
              <span className="ml-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {[filterCamion, filterChofer, filterCliente, filterEstado, filterTipoCarga, filterFechaDesde, filterFechaHasta].filter(Boolean).length}
              </span>
            )}
          </button>
          <button onClick={handleExport} className="btn-secondary">
            <Download size={14} />
            Exportar CSV
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-3 border-t border-gray-100">
            <div>
              <label className="form-label text-xs">Camión</label>
              <select value={filterCamion} onChange={e => setFilterCamion(e.target.value)} className="form-select text-xs py-1.5">
                <option value="">Todos</option>
                {state.camiones.map(c => <option key={c.id} value={c.id}>{c.patente}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label text-xs">Chofer</label>
              <select value={filterChofer} onChange={e => setFilterChofer(e.target.value)} className="form-select text-xs py-1.5">
                <option value="">Todos</option>
                {state.choferes.map(ch => <option key={ch.id} value={ch.id}>{ch.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label text-xs">Cliente</label>
              <select value={filterCliente} onChange={e => setFilterCliente(e.target.value)} className="form-select text-xs py-1.5">
                <option value="">Todos</option>
                {state.clientes.map(cl => <option key={cl.id} value={cl.id}>{cl.nombre.split(' ').slice(0, 2).join(' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label text-xs">Estado</label>
              <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)} className="form-select text-xs py-1.5">
                <option value="">Todos</option>
                <option value="pendiente">Pendiente</option>
                <option value="completado">Completado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            <div>
              <label className="form-label text-xs">Tipo de carga</label>
              <select value={filterTipoCarga} onChange={e => setFilterTipoCarga(e.target.value)} className="form-select text-xs py-1.5">
                <option value="">Todos</option>
                {TIPOS_CARGA.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label text-xs">Desde</label>
              <input type="date" value={filterFechaDesde} onChange={e => setFilterFechaDesde(e.target.value)} className="form-input text-xs py-1.5" />
            </div>
            <div>
              <label className="form-label text-xs">Hasta</label>
              <input type="date" value={filterFechaHasta} onChange={e => setFilterFechaHasta(e.target.value)} className="form-input text-xs py-1.5" />
            </div>
            {hasActiveFilters && (
              <div className="flex items-end">
                <button onClick={clearFilters} className="btn-secondary text-xs py-1.5">
                  <X size={12} />
                  Limpiar
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header cursor-pointer hover:text-gray-700" onClick={() => handleSort('camionPatente')}>
                  <div className="flex items-center gap-1">Camión <SortIcon k="camionPatente" /></div>
                </th>
                <th className="table-header cursor-pointer hover:text-gray-700" onClick={() => handleSort('choferNombre')}>
                  <div className="flex items-center gap-1">Chofer <SortIcon k="choferNombre" /></div>
                </th>
                <th className="table-header">Ruta</th>
                <th className="table-header cursor-pointer hover:text-gray-700" onClick={() => handleSort('clienteNombre')}>
                  <div className="flex items-center gap-1">Cliente <SortIcon k="clienteNombre" /></div>
                </th>
                <th className="table-header">Tipo carga</th>
                <th className="table-header cursor-pointer hover:text-gray-700" onClick={() => handleSort('fechaSalida')}>
                  <div className="flex items-center gap-1">Salida <SortIcon k="fechaSalida" /></div>
                </th>
                <th className="table-header text-right cursor-pointer hover:text-gray-700" onClick={() => handleSort('distanciaKm')}>
                  <div className="flex items-center justify-end gap-1">Km <SortIcon k="distanciaKm" /></div>
                </th>
                <th className="table-header text-right cursor-pointer hover:text-gray-700" onClick={() => handleSort('tarifa')}>
                  <div className="flex items-center justify-end gap-1">Tarifa <SortIcon k="tarifa" /></div>
                </th>
                <th className="table-header cursor-pointer hover:text-gray-700" onClick={() => handleSort('estado')}>
                  <div className="flex items-center gap-1">Estado <SortIcon k="estado" /></div>
                </th>
                <th className="table-header">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(viaje => {
                const camion = state.camiones.find(c => c.id === viaje.camionId)
                const chofer = state.choferes.find(ch => ch.id === viaje.choferId)
                const cliente = state.clientes.find(cl => cl.id === viaje.clienteId)
                return (
                  <tr key={viaje.id} className="table-row">
                    <td className="table-cell font-medium">{camion?.patente || '—'}</td>
                    <td className="table-cell">{chofer?.nombre || '—'}</td>
                    <td className="table-cell">
                      <div className="text-xs text-gray-400">{viaje.origen}</div>
                      <div className="font-medium text-gray-800">{viaje.destino}</div>
                    </td>
                    <td className="table-cell max-w-[150px]">
                      <div className="truncate text-sm">{cliente?.nombre || '—'}</div>
                    </td>
                    <td className="table-cell text-gray-500 text-xs">{viaje.tipoCarga}</td>
                    <td className="table-cell text-gray-500 text-xs whitespace-nowrap">{formatDate(viaje.fechaSalida)}</td>
                    <td className="table-cell text-right">{viaje.distanciaKm.toLocaleString('es-CL')}</td>
                    <td className="table-cell text-right font-medium">{formatCurrency(viaje.tarifa)}</td>
                    <td className="table-cell">
                      <span className={`badge ${estadoViajeColor(viaje.estado)}`}>
                        {estadoViajeLabel(viaje.estado)}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingViaje(viaje)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(viaje.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-gray-400">
                    <AlertCircle size={24} className="mx-auto mb-2" />
                    No se encontraron viajes con los filtros aplicados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500">{filtered.length} viaje{filtered.length !== 1 ? 's' : ''}</p>
            <p className="text-xs text-gray-500 font-medium">
              Total: {formatCurrency(filtered.reduce((s, v) => s + v.tarifa, 0))}
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingViaje && (
        <EditModal
          viaje={editingViaje}
          state={state}
          onClose={() => setEditingViaje(null)}
          onSave={data => {
            dispatch({ type: 'UPDATE_VIAJE', payload: { id: editingViaje.id, data } })
            setEditingViaje(null)
          }}
        />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="font-semibold text-gray-900 mb-2">¿Eliminar viaje?</h3>
            <p className="text-sm text-gray-500 mb-5">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="btn-secondary">Cancelar</button>
              <button
                onClick={() => {
                  dispatch({ type: 'DELETE_VIAJE', payload: deleteId })
                  setDeleteId(null)
                }}
                className="btn-danger"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useMemo } from 'react'
import { useApp } from '@/lib/store'
import { formatCurrency, formatDateOnly, formatDate, estadoViajeColor, estadoViajeLabel } from '@/lib/utils'
import { Viaje } from '@/types'
import { FileText, X, CheckSquare, Square, AlertCircle, Printer, ChevronDown } from 'lucide-react'

const IVA = 0.19

function InvoicePreviewModal({
  clienteId,
  viajesSeleccionados,
  state,
  onClose,
  onConfirm,
}: {
  clienteId: string
  viajesSeleccionados: string[]
  state: ReturnType<typeof useApp>['state']
  onClose: () => void
  onConfirm: () => void
}) {
  const cliente = state.clientes.find(cl => cl.id === clienteId)!
  const viajes = state.viajes.filter(v => viajesSeleccionados.includes(v.id))
  const subtotal = viajes.reduce((s, v) => s + v.tarifa, 0)
  const impuesto = Math.round(subtotal * IVA)
  const total = subtotal + impuesto
  const now = new Date()

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Vista previa de factura</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        {/* Invoice body */}
        <div className="p-6 space-y-6" id="invoice-preview">
          {/* Company + client header */}
          <div className="flex justify-between">
            <div>
              <div className="font-bold text-blue-700 text-xl">FlotaFlota</div>
              <div className="text-xs text-gray-500 mt-1">Empresa de Logística y Transporte</div>
              <div className="text-xs text-gray-500">RUT: 76.000.000-0</div>
              <div className="text-xs text-gray-500">Av. Industrial 1234, Santiago</div>
            </div>
            <div className="text-right">
              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg inline-block">
                <div className="text-xs font-medium opacity-80">FACTURA N°</div>
                <div className="font-bold text-lg">F-{now.getFullYear()}-{String(state.facturaCounter).padStart(4, '0')}</div>
              </div>
              <div className="text-xs text-gray-500 mt-2">Fecha emisión: {now.toLocaleDateString('es-CL')}</div>
            </div>
          </div>

          {/* Client data */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-xs text-gray-500 font-medium uppercase mb-2">Cliente</div>
            <div className="font-semibold text-gray-900">{cliente.nombre}</div>
            <div className="text-sm text-gray-600 mt-1">RUT: {cliente.rut}</div>
            <div className="text-sm text-gray-600">{cliente.email}</div>
            <div className="text-sm text-gray-600">{cliente.direccion}</div>
          </div>

          {/* Trips table */}
          <div>
            <div className="text-xs text-gray-500 font-medium uppercase mb-2">Detalle de servicios</div>
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Fecha</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Ruta</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Tipo carga</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">Km</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">Valor</th>
                </tr>
              </thead>
              <tbody>
                {viajes.map(v => {
                  const camion = state.camiones.find(c => c.id === v.camionId)
                  return (
                    <tr key={v.id} className="border-t border-gray-100">
                      <td className="px-3 py-2 text-xs text-gray-500 whitespace-nowrap">{formatDateOnly(v.fechaSalida)}</td>
                      <td className="px-3 py-2">
                        <div className="text-xs">{v.origen} → {v.destino}</div>
                        <div className="text-xs text-gray-400">{camion?.patente}</div>
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-500">{v.tipoCarga}</td>
                      <td className="px-3 py-2 text-right text-xs">{v.distanciaKm.toLocaleString('es-CL')}</td>
                      <td className="px-3 py-2 text-right font-medium">{formatCurrency(v.tarifa)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">IVA (19%)</span>
                <span className="font-medium">{formatCurrency(impuesto)}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2">
                <span>Total</span>
                <span className="text-blue-700">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between p-5 border-t border-gray-100">
          <button
            onClick={() => window.print()}
            className="btn-secondary"
          >
            <Printer size={14} />
            Imprimir
          </button>
          <div className="flex gap-3">
            <button onClick={onClose} className="btn-secondary">Cancelar</button>
            <button onClick={onConfirm} className="btn-primary">
              <FileText size={14} />
              Confirmar y generar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Facturacion() {
  const { state, dispatch } = useApp()

  const [clienteId, setClienteId] = useState('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showPreview, setShowPreview] = useState(false)
  const [generatedFactura, setGeneratedFactura] = useState<string | null>(null)

  const viajesFiltrados = useMemo(() => {
    if (!clienteId) return []
    let result = state.viajes.filter(
      v => v.clienteId === clienteId && v.estado === 'completado'
    )
    if (fechaDesde) result = result.filter(v => new Date(v.fechaSalida) >= new Date(fechaDesde))
    if (fechaHasta) result = result.filter(v => new Date(v.fechaSalida) <= new Date(fechaHasta + 'T23:59:59'))
    // Exclude already invoiced trips
    const invoicedIds = new Set(state.facturas.flatMap(f => f.viajesIds))
    result = result.filter(v => !invoicedIds.has(v.id))
    return result.sort((a, b) => new Date(b.fechaSalida).getTime() - new Date(a.fechaSalida).getTime())
  }, [state, clienteId, fechaDesde, fechaHasta])

  const allSelected = viajesFiltrados.length > 0 && viajesFiltrados.every(v => selectedIds.has(v.id))

  function toggleAll() {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(viajesFiltrados.map(v => v.id)))
    }
  }

  function toggleOne(id: string) {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  const selectedViajes = viajesFiltrados.filter(v => selectedIds.has(v.id))
  const subtotalSel = selectedViajes.reduce((s, v) => s + v.tarifa, 0)
  const ivaSel = Math.round(subtotalSel * IVA)
  const totalSel = subtotalSel + ivaSel

  function handleConfirm() {
    dispatch({
      type: 'GENERATE_FACTURA',
      payload: { clienteId, viajesIds: Array.from(selectedIds) },
    })
    const num = String(state.facturaCounter).padStart(4, '0')
    const year = new Date().getFullYear()
    setGeneratedFactura(`F-${year}-${num}`)
    setShowPreview(false)
    setSelectedIds(new Set())
  }

  // Group invoiced trips by client for the history section
  const facturasOrdenadas = [...state.facturas].sort(
    (a, b) => new Date(b.fechaEmision).getTime() - new Date(a.fechaEmision).getTime()
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Facturación</h1>
        <p className="text-sm text-gray-500 mt-0.5">Genera facturas agrupando viajes por cliente</p>
      </div>

      {/* Success banner */}
      {generatedFactura && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <FileText size={16} className="text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-green-800">¡Factura generada exitosamente!</p>
              <p className="text-sm text-green-600">Número: {generatedFactura}</p>
            </div>
          </div>
          <button onClick={() => setGeneratedFactura(null)} className="text-green-400 hover:text-green-600">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="card p-6 space-y-5">
        <h2 className="font-semibold text-gray-900">Selección de viajes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="form-label">Cliente</label>
            <select
              value={clienteId}
              onChange={e => { setClienteId(e.target.value); setSelectedIds(new Set()) }}
              className="form-select"
            >
              <option value="">Seleccione cliente...</option>
              {state.clientes.map(cl => (
                <option key={cl.id} value={cl.id}>{cl.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Desde</label>
            <input
              type="date"
              value={fechaDesde}
              onChange={e => setFechaDesde(e.target.value)}
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Hasta</label>
            <input
              type="date"
              value={fechaHasta}
              onChange={e => setFechaHasta(e.target.value)}
              className="form-input"
            />
          </div>
        </div>
      </div>

      {/* Trips selection */}
      {clienteId && (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <h2 className="font-semibold text-gray-900">
                Viajes disponibles
              </h2>
              {viajesFiltrados.length > 0 && (
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {viajesFiltrados.length} viaje{viajesFiltrados.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            {viajesFiltrados.length > 0 && (
              <button
                onClick={toggleAll}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {allSelected ? 'Deseleccionar todo' : 'Seleccionar todo'}
              </button>
            )}
          </div>

          {viajesFiltrados.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <AlertCircle size={24} className="mx-auto mb-2" />
              <p>No hay viajes completados disponibles para este cliente</p>
              <p className="text-xs mt-1">Los viajes ya facturados no aparecen aquí</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 w-10">
                      <button onClick={toggleAll} className="text-gray-400 hover:text-blue-600">
                        {allSelected ? <CheckSquare size={16} className="text-blue-600" /> : <Square size={16} />}
                      </button>
                    </th>
                    <th className="table-header">Fecha salida</th>
                    <th className="table-header">Camión</th>
                    <th className="table-header">Ruta</th>
                    <th className="table-header">Tipo carga</th>
                    <th className="table-header text-right">Km</th>
                    <th className="table-header text-right">Tarifa</th>
                  </tr>
                </thead>
                <tbody>
                  {viajesFiltrados.map(v => {
                    const camion = state.camiones.find(c => c.id === v.camionId)
                    const checked = selectedIds.has(v.id)
                    return (
                      <tr
                        key={v.id}
                        className={`table-row cursor-pointer ${checked ? 'bg-blue-50' : ''}`}
                        onClick={() => toggleOne(v.id)}
                      >
                        <td className="px-4 py-3">
                          <div className={`text-${checked ? 'blue-600' : 'gray-400'}`}>
                            {checked ? <CheckSquare size={16} className="text-blue-600" /> : <Square size={16} />}
                          </div>
                        </td>
                        <td className="table-cell text-gray-500 whitespace-nowrap text-xs">{formatDateOnly(v.fechaSalida)}</td>
                        <td className="table-cell font-medium">{camion?.patente || '—'}</td>
                        <td className="table-cell">
                          <div className="text-xs text-gray-400">{v.origen}</div>
                          <div>{v.destino}</div>
                        </td>
                        <td className="table-cell text-gray-500 text-xs">{v.tipoCarga}</td>
                        <td className="table-cell text-right">{v.distanciaKm.toLocaleString('es-CL')}</td>
                        <td className="table-cell text-right font-medium">{formatCurrency(v.tarifa)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Summary bar */}
          {selectedIds.size > 0 && (
            <div className="bg-blue-50 border-t border-blue-100 p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-blue-500 font-medium">Viajes seleccionados</p>
                    <p className="text-lg font-bold text-blue-900">{selectedIds.size}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-500 font-medium">Subtotal</p>
                    <p className="text-lg font-bold text-blue-900">{formatCurrency(subtotalSel)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-500 font-medium">Total con IVA</p>
                    <p className="text-lg font-bold text-blue-900">{formatCurrency(totalSel)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPreview(true)}
                  className="btn-primary shrink-0"
                >
                  <FileText size={16} />
                  Generar factura
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Invoice history */}
      {facturasOrdenadas.length > 0 && (
        <div className="card overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Historial de facturas</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Número</th>
                  <th className="table-header">Cliente</th>
                  <th className="table-header">Fecha emisión</th>
                  <th className="table-header text-right">Viajes</th>
                  <th className="table-header text-right">Subtotal</th>
                  <th className="table-header text-right">IVA</th>
                  <th className="table-header text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {facturasOrdenadas.map(f => {
                  const cliente = state.clientes.find(cl => cl.id === f.clienteId)
                  return (
                    <tr key={f.id} className="table-row">
                      <td className="table-cell font-medium text-blue-600">{f.numero}</td>
                      <td className="table-cell">{cliente?.nombre || '—'}</td>
                      <td className="table-cell text-gray-500 text-xs">{formatDate(f.fechaEmision)}</td>
                      <td className="table-cell text-right">{f.viajesIds.length}</td>
                      <td className="table-cell text-right">{formatCurrency(f.subtotal)}</td>
                      <td className="table-cell text-right text-gray-500">{formatCurrency(f.impuesto)}</td>
                      <td className="table-cell text-right font-bold">{formatCurrency(f.total)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Preview modal */}
      {showPreview && (
        <InvoicePreviewModal
          clienteId={clienteId}
          viajesSeleccionados={Array.from(selectedIds)}
          state={state}
          onClose={() => setShowPreview(false)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  )
}

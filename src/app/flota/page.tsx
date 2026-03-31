'use client'

import { useState } from 'react'
import { useApp } from '@/lib/store'
import { estadoCamionColor, estadoCamionLabel } from '@/lib/utils'
import { Camion, Chofer, EstadoCamion } from '@/types'
import { Plus, Pencil, Trash2, X, Save, Truck, User, AlertCircle } from 'lucide-react'

// ─── Camiones ────────────────────────────────────────────────────────────────

function CamionModal({
  camion,
  onClose,
  onSave,
}: {
  camion?: Camion
  onClose: () => void
  onSave: (data: Omit<Camion, 'id'>) => void
}) {
  const [form, setForm] = useState({
    patente: camion?.patente || '',
    modelo: camion?.modelo || '',
    anio: camion?.anio ? String(camion.anio) : '',
    estado: (camion?.estado || 'disponible') as EstadoCamion,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!form.patente.trim()) e.patente = 'Requerido'
    if (!form.modelo.trim()) e.modelo = 'Requerido'
    if (!form.anio || isNaN(Number(form.anio))) e.anio = 'Año inválido'
    return e
  }

  function handleSave() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    onSave({ patente: form.patente.trim().toUpperCase(), modelo: form.modelo.trim(), anio: Number(form.anio), estado: form.estado })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">{camion ? 'Editar camión' : 'Agregar camión'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="form-label">Patente <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.patente}
              onChange={e => setForm(p => ({ ...p, patente: e.target.value }))}
              placeholder="Ej: AB-1234"
              className="form-input"
            />
            {errors.patente && <p className="text-xs text-red-500 mt-1">{errors.patente}</p>}
          </div>
          <div>
            <label className="form-label">Modelo <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.modelo}
              onChange={e => setForm(p => ({ ...p, modelo: e.target.value }))}
              placeholder="Ej: Volvo FH 500"
              className="form-input"
            />
            {errors.modelo && <p className="text-xs text-red-500 mt-1">{errors.modelo}</p>}
          </div>
          <div>
            <label className="form-label">Año <span className="text-red-500">*</span></label>
            <input
              type="number"
              value={form.anio}
              onChange={e => setForm(p => ({ ...p, anio: e.target.value }))}
              placeholder="Ej: 2022"
              min="1990"
              max="2030"
              className="form-input"
            />
            {errors.anio && <p className="text-xs text-red-500 mt-1">{errors.anio}</p>}
          </div>
          <div>
            <label className="form-label">Estado</label>
            <select
              value={form.estado}
              onChange={e => setForm(p => ({ ...p, estado: e.target.value as EstadoCamion }))}
              className="form-select"
            >
              <option value="disponible">Disponible</option>
              <option value="en_viaje">En viaje</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button onClick={handleSave} className="btn-primary">
            <Save size={14} />
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Choferes ────────────────────────────────────────────────────────────────

function ChoferModal({
  chofer,
  camiones,
  onClose,
  onSave,
}: {
  chofer?: Chofer
  camiones: Camion[]
  onClose: () => void
  onSave: (data: Omit<Chofer, 'id'>) => void
}) {
  const [form, setForm] = useState({
    nombre: chofer?.nombre || '',
    licencia: chofer?.licencia || '',
    telefono: chofer?.telefono || '',
    camionAsignadoId: chofer?.camionAsignadoId || '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!form.nombre.trim()) e.nombre = 'Requerido'
    if (!form.licencia.trim()) e.licencia = 'Requerido'
    return e
  }

  function handleSave() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    onSave({
      nombre: form.nombre.trim(),
      licencia: form.licencia.trim(),
      telefono: form.telefono.trim(),
      camionAsignadoId: form.camionAsignadoId || null,
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">{chofer ? 'Editar chofer' : 'Agregar chofer'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="form-label">Nombre completo <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.nombre}
              onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
              placeholder="Ej: Carlos Mendoza"
              className="form-input"
            />
            {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
          </div>
          <div>
            <label className="form-label">N° de licencia <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.licencia}
              onChange={e => setForm(p => ({ ...p, licencia: e.target.value }))}
              placeholder="Ej: A2-001234"
              className="form-input"
            />
            {errors.licencia && <p className="text-xs text-red-500 mt-1">{errors.licencia}</p>}
          </div>
          <div>
            <label className="form-label">Teléfono</label>
            <input
              type="tel"
              value={form.telefono}
              onChange={e => setForm(p => ({ ...p, telefono: e.target.value }))}
              placeholder="Ej: +56 9 8765 4321"
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Camión asignado</label>
            <select
              value={form.camionAsignadoId}
              onChange={e => setForm(p => ({ ...p, camionAsignadoId: e.target.value }))}
              className="form-select"
            >
              <option value="">Sin asignar</option>
              {camiones.map(c => (
                <option key={c.id} value={c.id}>{c.patente} — {c.modelo}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button onClick={handleSave} className="btn-primary">
            <Save size={14} />
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Delete confirm ───────────────────────────────────────────────────────────

function DeleteModal({ message, onClose, onConfirm }: {
  message: string
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
        <h3 className="font-semibold text-gray-900 mb-2">¿Eliminar?</h3>
        <p className="text-sm text-gray-500 mb-5">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button onClick={onConfirm} className="btn-danger">Eliminar</button>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Flota() {
  const { state, dispatch } = useApp()
  const [tab, setTab] = useState<'camiones' | 'choferes'>('camiones')

  // Camiones
  const [camionModal, setCamionModal] = useState<{ open: boolean; data?: Camion }>({ open: false })
  const [deleteCamionId, setDeleteCamionId] = useState<string | null>(null)

  // Choferes
  const [choferModal, setChoferModal] = useState<{ open: boolean; data?: Chofer }>({ open: false })
  const [deleteChoferId, setDeleteChoferId] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Flota</h1>
        <p className="text-sm text-gray-500 mt-0.5">Gestión de camiones y choferes</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(['camiones', 'choferes'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'camiones' ? <Truck size={15} /> : <User size={15} />}
            {t.charAt(0).toUpperCase() + t.slice(1)}
            <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
              {t === 'camiones' ? state.camiones.length : state.choferes.length}
            </span>
          </button>
        ))}
      </div>

      {/* Camiones tab */}
      {tab === 'camiones' && (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Camiones</h2>
            <button onClick={() => setCamionModal({ open: true })} className="btn-primary">
              <Plus size={15} />
              Agregar camión
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Patente</th>
                  <th className="table-header">Modelo</th>
                  <th className="table-header">Año</th>
                  <th className="table-header">Chofer asignado</th>
                  <th className="table-header">Viajes totales</th>
                  <th className="table-header">Estado</th>
                  <th className="table-header">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {state.camiones.map(c => {
                  const chofer = state.choferes.find(ch => ch.camionAsignadoId === c.id)
                  const viajesTotales = state.viajes.filter(v => v.camionId === c.id).length
                  return (
                    <tr key={c.id} className="table-row">
                      <td className="table-cell font-bold text-blue-700">{c.patente}</td>
                      <td className="table-cell font-medium">{c.modelo}</td>
                      <td className="table-cell text-gray-500">{c.anio}</td>
                      <td className="table-cell text-gray-500">{chofer?.nombre || <span className="text-gray-300">Sin asignar</span>}</td>
                      <td className="table-cell text-center">{viajesTotales}</td>
                      <td className="table-cell">
                        <span className={`badge ${estadoCamionColor(c.estado)}`}>
                          {estadoCamionLabel(c.estado)}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="flex gap-1">
                          <button
                            onClick={() => setCamionModal({ open: true, data: c })}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteCamionId(c.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {state.camiones.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-gray-400">
                      <AlertCircle size={20} className="mx-auto mb-2" />
                      No hay camiones registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Choferes tab */}
      {tab === 'choferes' && (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Choferes</h2>
            <button onClick={() => setChoferModal({ open: true })} className="btn-primary">
              <Plus size={15} />
              Agregar chofer
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Nombre</th>
                  <th className="table-header">Licencia</th>
                  <th className="table-header">Teléfono</th>
                  <th className="table-header">Camión asignado</th>
                  <th className="table-header">Viajes totales</th>
                  <th className="table-header">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {state.choferes.map(ch => {
                  const camion = state.camiones.find(c => c.id === ch.camionAsignadoId)
                  const viajesTotales = state.viajes.filter(v => v.choferId === ch.id).length
                  return (
                    <tr key={ch.id} className="table-row">
                      <td className="table-cell font-medium">{ch.nombre}</td>
                      <td className="table-cell text-gray-500 font-mono text-xs">{ch.licencia}</td>
                      <td className="table-cell text-gray-500">{ch.telefono || <span className="text-gray-300">—</span>}</td>
                      <td className="table-cell">
                        {camion ? (
                          <span className="font-medium text-blue-700">{camion.patente}</span>
                        ) : (
                          <span className="text-gray-300">Sin asignar</span>
                        )}
                      </td>
                      <td className="table-cell text-center">{viajesTotales}</td>
                      <td className="table-cell">
                        <div className="flex gap-1">
                          <button
                            onClick={() => setChoferModal({ open: true, data: ch })}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteChoferId(ch.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {state.choferes.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-400">
                      <AlertCircle size={20} className="mx-auto mb-2" />
                      No hay choferes registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals: Camiones */}
      {camionModal.open && (
        <CamionModal
          camion={camionModal.data}
          onClose={() => setCamionModal({ open: false })}
          onSave={data => {
            if (camionModal.data) {
              dispatch({ type: 'UPDATE_CAMION', payload: { id: camionModal.data.id, data } })
            } else {
              dispatch({ type: 'ADD_CAMION', payload: data })
            }
            setCamionModal({ open: false })
          }}
        />
      )}
      {deleteCamionId && (
        <DeleteModal
          message="¿Estás seguro que deseas eliminar este camión? El chofer asignado quedará sin camión."
          onClose={() => setDeleteCamionId(null)}
          onConfirm={() => {
            dispatch({ type: 'DELETE_CAMION', payload: deleteCamionId })
            setDeleteCamionId(null)
          }}
        />
      )}

      {/* Modals: Choferes */}
      {choferModal.open && (
        <ChoferModal
          chofer={choferModal.data}
          camiones={state.camiones}
          onClose={() => setChoferModal({ open: false })}
          onSave={data => {
            if (choferModal.data) {
              dispatch({ type: 'UPDATE_CHOFER', payload: { id: choferModal.data.id, data } })
            } else {
              dispatch({ type: 'ADD_CHOFER', payload: data })
            }
            setChoferModal({ open: false })
          }}
        />
      )}
      {deleteChoferId && (
        <DeleteModal
          message="¿Estás seguro que deseas eliminar este chofer?"
          onClose={() => setDeleteChoferId(null)}
          onConfirm={() => {
            dispatch({ type: 'DELETE_CHOFER', payload: deleteChoferId })
            setDeleteChoferId(null)
          }}
        />
      )}
    </div>
  )
}

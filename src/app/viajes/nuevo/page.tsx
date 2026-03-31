'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/store'
import { TIPOS_CARGA } from '@/lib/utils'
import { EstadoViaje } from '@/types'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

function today() {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
}

export default function NuevoViaje() {
  const router = useRouter()
  const { state, dispatch } = useApp()

  const [form, setForm] = useState({
    camionId: '',
    choferId: '',
    fechaSalida: today(),
    fechaLlegada: '',
    origen: '',
    destino: '',
    tipoCarga: '',
    clienteId: '',
    distanciaKm: '',
    tarifa: '',
    estado: 'pendiente' as EstadoViaje,
    observaciones: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  function validate() {
    const e: Record<string, string> = {}
    if (!form.camionId) e.camionId = 'Seleccione un camión'
    if (!form.choferId) e.choferId = 'Seleccione un chofer'
    if (!form.fechaSalida) e.fechaSalida = 'Ingrese la fecha de salida'
    if (!form.origen.trim()) e.origen = 'Ingrese el origen'
    if (!form.destino.trim()) e.destino = 'Ingrese el destino'
    if (!form.tipoCarga) e.tipoCarga = 'Seleccione el tipo de carga'
    if (!form.clienteId) e.clienteId = 'Seleccione un cliente'
    if (!form.distanciaKm || Number(form.distanciaKm) <= 0) e.distanciaKm = 'Ingrese la distancia'
    if (!form.tarifa || Number(form.tarifa) <= 0) e.tarifa = 'Ingrese la tarifa'
    return e
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length > 0) {
      setErrors(e2)
      return
    }
    setSaving(true)
    setTimeout(() => {
      dispatch({
        type: 'ADD_VIAJE',
        payload: {
          camionId: form.camionId,
          choferId: form.choferId,
          fechaSalida: new Date(form.fechaSalida).toISOString(),
          fechaLlegada: form.fechaLlegada ? new Date(form.fechaLlegada).toISOString() : null,
          origen: form.origen.trim(),
          destino: form.destino.trim(),
          tipoCarga: form.tipoCarga,
          clienteId: form.clienteId,
          distanciaKm: Number(form.distanciaKm),
          tarifa: Number(form.tarifa),
          estado: form.estado,
          observaciones: form.observaciones.trim(),
        },
      })
      router.push('/viajes')
    }, 400)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/viajes" className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Registrar viaje</h1>
          <p className="text-sm text-gray-500 mt-0.5">Complete los datos del nuevo viaje</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Camión y Chofer */}
        <div className="card p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 border-b border-gray-100 pb-3">Vehículo y conductor</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="form-label">
                Camión <span className="text-red-500">*</span>
              </label>
              <select
                name="camionId"
                value={form.camionId}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Seleccione camión...</option>
                {state.camiones.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.patente} — {c.modelo}
                  </option>
                ))}
              </select>
              {errors.camionId && <p className="text-xs text-red-500 mt-1">{errors.camionId}</p>}
            </div>
            <div>
              <label className="form-label">
                Chofer <span className="text-red-500">*</span>
              </label>
              <select
                name="choferId"
                value={form.choferId}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Seleccione chofer...</option>
                {state.choferes.map(ch => (
                  <option key={ch.id} value={ch.id}>
                    {ch.nombre}
                  </option>
                ))}
              </select>
              {errors.choferId && <p className="text-xs text-red-500 mt-1">{errors.choferId}</p>}
            </div>
          </div>
        </div>

        {/* Fechas */}
        <div className="card p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 border-b border-gray-100 pb-3">Horarios</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="form-label">
                Fecha y hora de salida <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="fechaSalida"
                value={form.fechaSalida}
                onChange={handleChange}
                className="form-input"
              />
              {errors.fechaSalida && <p className="text-xs text-red-500 mt-1">{errors.fechaSalida}</p>}
            </div>
            <div>
              <label className="form-label">Fecha y hora de llegada</label>
              <input
                type="datetime-local"
                name="fechaLlegada"
                value={form.fechaLlegada}
                onChange={handleChange}
                className="form-input"
              />
              <p className="text-xs text-gray-400 mt-1">Dejar vacío si aún no ha llegado</p>
            </div>
          </div>
        </div>

        {/* Ruta */}
        <div className="card p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 border-b border-gray-100 pb-3">Ruta y carga</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="form-label">
                Origen <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="origen"
                value={form.origen}
                onChange={handleChange}
                placeholder="Ej: Santiago Centro"
                className="form-input"
              />
              {errors.origen && <p className="text-xs text-red-500 mt-1">{errors.origen}</p>}
            </div>
            <div>
              <label className="form-label">
                Destino <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="destino"
                value={form.destino}
                onChange={handleChange}
                placeholder="Ej: Valparaíso"
                className="form-input"
              />
              {errors.destino && <p className="text-xs text-red-500 mt-1">{errors.destino}</p>}
            </div>
            <div>
              <label className="form-label">
                Tipo de carga <span className="text-red-500">*</span>
              </label>
              <select
                name="tipoCarga"
                value={form.tipoCarga}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Seleccione tipo...</option>
                {TIPOS_CARGA.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.tipoCarga && <p className="text-xs text-red-500 mt-1">{errors.tipoCarga}</p>}
            </div>
            <div>
              <label className="form-label">
                Distancia recorrida (km) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="distanciaKm"
                value={form.distanciaKm}
                onChange={handleChange}
                placeholder="Ej: 250"
                min="0"
                className="form-input"
              />
              {errors.distanciaKm && <p className="text-xs text-red-500 mt-1">{errors.distanciaKm}</p>}
            </div>
          </div>
        </div>

        {/* Cliente y facturación */}
        <div className="card p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 border-b border-gray-100 pb-3">Cliente y tarifa</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="form-label">
                Cliente / destinatario <span className="text-red-500">*</span>
              </label>
              <select
                name="clienteId"
                value={form.clienteId}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Seleccione cliente...</option>
                {state.clientes.map(cl => (
                  <option key={cl.id} value={cl.id}>{cl.nombre}</option>
                ))}
              </select>
              {errors.clienteId && <p className="text-xs text-red-500 mt-1">{errors.clienteId}</p>}
            </div>
            <div>
              <label className="form-label">
                Tarifa aplicada (CLP) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="tarifa"
                value={form.tarifa}
                onChange={handleChange}
                placeholder="Ej: 150000"
                min="0"
                className="form-input"
              />
              {errors.tarifa && <p className="text-xs text-red-500 mt-1">{errors.tarifa}</p>}
            </div>
            <div>
              <label className="form-label">Estado</label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className="form-select"
              >
                <option value="pendiente">Pendiente</option>
                <option value="completado">Completado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>
          <div>
            <label className="form-label">Observaciones</label>
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              rows={3}
              placeholder="Notas adicionales sobre el viaje..."
              className="form-textarea"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/viajes" className="btn-secondary">
            Cancelar
          </Link>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Guardando...
              </>
            ) : (
              <>
                <Save size={16} />
                Guardar viaje
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

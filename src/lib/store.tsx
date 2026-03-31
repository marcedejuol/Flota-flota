'use client'

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react'
import { AppState, Camion, Chofer, Viaje, Factura } from '@/types'
import { initialData } from './mockData'
import { generateId } from './utils'

type Action =
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'ADD_VIAJE'; payload: Omit<Viaje, 'id' | 'createdAt'> }
  | { type: 'UPDATE_VIAJE'; payload: { id: string; data: Partial<Viaje> } }
  | { type: 'DELETE_VIAJE'; payload: string }
  | { type: 'ADD_CAMION'; payload: Omit<Camion, 'id'> }
  | { type: 'UPDATE_CAMION'; payload: { id: string; data: Partial<Camion> } }
  | { type: 'DELETE_CAMION'; payload: string }
  | { type: 'ADD_CHOFER'; payload: Omit<Chofer, 'id'> }
  | { type: 'UPDATE_CHOFER'; payload: { id: string; data: Partial<Chofer> } }
  | { type: 'DELETE_CHOFER'; payload: string }
  | { type: 'GENERATE_FACTURA'; payload: { clienteId: string; viajesIds: string[] } }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload

    case 'ADD_VIAJE': {
      const newViaje: Viaje = {
        ...action.payload,
        id: generateId(),
        createdAt: new Date().toISOString(),
      }
      // Update camion state
      const updatedCamiones = state.camiones.map(c =>
        c.id === newViaje.camionId && newViaje.estado === 'pendiente'
          ? { ...c, estado: 'en_viaje' as const }
          : c
      )
      return {
        ...state,
        viajes: [newViaje, ...state.viajes],
        camiones: updatedCamiones,
      }
    }

    case 'UPDATE_VIAJE': {
      const updatedViajes = state.viajes.map(v =>
        v.id === action.payload.id ? { ...v, ...action.payload.data } : v
      )
      // Recalculate camion states
      const updatedCamiones = state.camiones.map(camion => {
        const activeTrip = updatedViajes.find(
          v => v.camionId === camion.id && v.estado === 'pendiente'
        )
        if (activeTrip) return { ...camion, estado: 'en_viaje' as const }
        if (camion.estado === 'en_viaje') return { ...camion, estado: 'disponible' as const }
        return camion
      })
      return { ...state, viajes: updatedViajes, camiones: updatedCamiones }
    }

    case 'DELETE_VIAJE':
      return { ...state, viajes: state.viajes.filter(v => v.id !== action.payload) }

    case 'ADD_CAMION': {
      const newCamion: Camion = { ...action.payload, id: generateId() }
      return { ...state, camiones: [...state.camiones, newCamion] }
    }

    case 'UPDATE_CAMION':
      return {
        ...state,
        camiones: state.camiones.map(c =>
          c.id === action.payload.id ? { ...c, ...action.payload.data } : c
        ),
      }

    case 'DELETE_CAMION':
      return {
        ...state,
        camiones: state.camiones.filter(c => c.id !== action.payload),
        choferes: state.choferes.map(ch =>
          ch.camionAsignadoId === action.payload ? { ...ch, camionAsignadoId: null } : ch
        ),
      }

    case 'ADD_CHOFER': {
      const newChofer: Chofer = { ...action.payload, id: generateId() }
      return { ...state, choferes: [...state.choferes, newChofer] }
    }

    case 'UPDATE_CHOFER':
      return {
        ...state,
        choferes: state.choferes.map(ch =>
          ch.id === action.payload.id ? { ...ch, ...action.payload.data } : ch
        ),
      }

    case 'DELETE_CHOFER':
      return { ...state, choferes: state.choferes.filter(ch => ch.id !== action.payload) }

    case 'GENERATE_FACTURA': {
      const { clienteId, viajesIds } = action.payload
      const viajesFactura = state.viajes.filter(v => viajesIds.includes(v.id))
      const subtotal = viajesFactura.reduce((sum, v) => sum + v.tarifa, 0)
      const impuesto = Math.round(subtotal * 0.19)
      const total = subtotal + impuesto
      const year = new Date().getFullYear()
      const num = String(state.facturaCounter).padStart(4, '0')
      const nuevaFactura: Factura = {
        id: generateId(),
        numero: `F-${year}-${num}`,
        clienteId,
        viajesIds,
        fechaEmision: new Date().toISOString(),
        subtotal,
        impuesto,
        total,
      }
      return {
        ...state,
        facturas: [...state.facturas, nuevaFactura],
        facturaCounter: state.facturaCounter + 1,
      }
    }

    default:
      return state
  }
}

interface AppContextType {
  state: AppState
  isLoaded: boolean
  dispatch: React.Dispatch<Action>
}

const AppContext = createContext<AppContextType | null>(null)

const STORAGE_KEY = 'flota-flota-data'

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialData)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as AppState
        dispatch({ type: 'LOAD_STATE', payload: parsed })
      }
    } catch {
      // ignore parse errors
    }
    setIsLoaded(true)
  }, [])

  // Persist to localStorage on state change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
  }, [state, isLoaded])

  return (
    <AppContext.Provider value={{ state, dispatch, isLoaded }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

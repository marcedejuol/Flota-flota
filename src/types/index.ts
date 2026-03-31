export type EstadoViaje = 'pendiente' | 'completado' | 'cancelado'
export type EstadoCamion = 'disponible' | 'en_viaje' | 'inactivo'

export interface Camion {
  id: string
  patente: string
  modelo: string
  anio: number
  estado: EstadoCamion
}

export interface Chofer {
  id: string
  nombre: string
  licencia: string
  telefono: string
  camionAsignadoId: string | null
}

export interface Cliente {
  id: string
  nombre: string
  rut: string
  email: string
  direccion: string
}

export interface Viaje {
  id: string
  camionId: string
  choferId: string
  fechaSalida: string
  fechaLlegada: string | null
  origen: string
  destino: string
  tipoCarga: string
  clienteId: string
  distanciaKm: number
  tarifa: number
  estado: EstadoViaje
  observaciones: string
  createdAt: string
}

export interface Factura {
  id: string
  numero: string
  clienteId: string
  viajesIds: string[]
  fechaEmision: string
  subtotal: number
  impuesto: number
  total: number
}

export interface AppState {
  camiones: Camion[]
  choferes: Chofer[]
  clientes: Cliente[]
  viajes: Viaje[]
  facturas: Factura[]
  facturaCounter: number
}

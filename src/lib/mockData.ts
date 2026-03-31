import { AppState, Camion, Chofer, Cliente, Viaje } from '@/types'

const camiones: Camion[] = [
  { id: 'c1', patente: 'ABD 123', modelo: 'Volvo FH 500', anio: 2021, estado: 'en_viaje' },
  { id: 'c2', patente: 'CDF 456', modelo: 'Mercedes Actros 1845', anio: 2020, estado: 'disponible' },
  { id: 'c3', patente: 'EGH 789', modelo: 'Scania R 450', anio: 2022, estado: 'en_viaje' },
  { id: 'c4', patente: 'IJK 012', modelo: 'DAF XF 480', anio: 2019, estado: 'disponible' },
  { id: 'c5', patente: 'LMN 345', modelo: 'Volvo FH 460', anio: 2021, estado: 'inactivo' },
  { id: 'c6', patente: 'OPQ 678', modelo: 'Mercedes Actros 1836', anio: 2020, estado: 'disponible' },
  { id: 'c7', patente: 'RST 901', modelo: 'Scania G 410', anio: 2018, estado: 'en_viaje' },
  { id: 'c8', patente: 'UVW 234', modelo: 'MAN TGX 18.440', anio: 2022, estado: 'disponible' },
]

const choferes: Chofer[] = [
  { id: 'ch1', nombre: 'Diego Acosta', licencia: 'D-00123456', telefono: '+595 981 234 567', camionAsignadoId: 'c1' },
  { id: 'ch2', nombre: 'Ramón Giménez', licencia: 'D-00234567', telefono: '+595 971 345 678', camionAsignadoId: 'c2' },
  { id: 'ch3', nombre: 'Nelson Benítez', licencia: 'D-00345678', telefono: '+595 991 456 789', camionAsignadoId: 'c3' },
  { id: 'ch4', nombre: 'Carlos Villalba', licencia: 'D-00456789', telefono: '+595 982 567 890', camionAsignadoId: 'c4' },
  { id: 'ch5', nombre: 'Jorge Rojas', licencia: 'D-00567890', telefono: '+595 972 678 901', camionAsignadoId: 'c5' },
  { id: 'ch6', nombre: 'Miguel Bareiro', licencia: 'D-00678901', telefono: '+595 992 789 012', camionAsignadoId: 'c6' },
  { id: 'ch7', nombre: 'Andrés González', licencia: 'D-00789012', telefono: '+595 981 890 123', camionAsignadoId: 'c7' },
  { id: 'ch8', nombre: 'Luis Martínez', licencia: 'D-00890123', telefono: '+595 971 901 234', camionAsignadoId: 'c8' },
]

const clientes: Cliente[] = [
  { id: 'cl1', nombre: 'Cooperativa Colonias Unidas Ltda.', rut: '80.012.345-6', email: 'logistica@coloniasunidas.com.py', direccion: 'Ruta PY02 km 220, Capitán Miranda' },
  { id: 'cl2', nombre: 'Constructora Americana S.A.', rut: '80.123.456-7', email: 'compras@constructoraamericana.com.py', direccion: 'Av. España 1845, Asunción' },
  { id: 'cl3', nombre: 'Distribuidora Central S.R.L.', rut: '80.234.567-8', email: 'operaciones@distriCentral.com.py', direccion: 'Ruta Transchaco km 12, Mariano Roque Alonso' },
  { id: 'cl4', nombre: 'Frigorífico San Marcos S.A.', rut: '80.345.678-9', email: 'despacho@frigosanmarcos.com.py', direccion: 'Av. Mcal. López 3456, Asunción' },
  { id: 'cl5', nombre: 'Agroganadera del Este S.A.', rut: '80.456.789-0', email: 'supply@agroeste.com.py', direccion: 'Ruta PY07 km 4, Ciudad del Este' },
]

function daysAgo(days: number, hour = 8, minute = 0): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

const viajes: Viaje[] = [
  // Hoy
  {
    id: 'v1', camionId: 'c1', choferId: 'ch1', fechaSalida: daysAgo(0, 5, 30), fechaLlegada: null,
    origen: 'Asunción', destino: 'Ciudad del Este', tipoCarga: 'Alimentos secos', clienteId: 'cl3',
    distanciaKm: 330, tarifa: 4200000, estado: 'pendiente', observaciones: '', createdAt: daysAgo(0, 5, 0),
  },
  {
    id: 'v2', camionId: 'c3', choferId: 'ch3', fechaSalida: daysAgo(0, 6, 0), fechaLlegada: null,
    origen: 'Asunción', destino: 'Encarnación', tipoCarga: 'Materiales de construcción', clienteId: 'cl2',
    distanciaKm: 370, tarifa: 4800000, estado: 'pendiente', observaciones: 'Carga extra ancho, permiso de tránsito adjunto', createdAt: daysAgo(0, 5, 30),
  },
  {
    id: 'v3', camionId: 'c7', choferId: 'ch7', fechaSalida: daysAgo(0, 4, 0), fechaLlegada: daysAgo(0, 12, 30),
    origen: 'Asunción', destino: 'Coronel Oviedo', tipoCarga: 'Bebidas', clienteId: 'cl3',
    distanciaKm: 130, tarifa: 1650000, estado: 'completado', observaciones: '', createdAt: daysAgo(0, 3, 30),
  },
  // Ayer
  {
    id: 'v4', camionId: 'c2', choferId: 'ch2', fechaSalida: daysAgo(1, 5, 0), fechaLlegada: daysAgo(1, 14, 30),
    origen: 'Asunción', destino: 'Pedro Juan Caballero', tipoCarga: 'Soja y cereales', clienteId: 'cl1',
    distanciaKm: 550, tarifa: 7200000, estado: 'completado', observaciones: '', createdAt: daysAgo(1, 4, 30),
  },
  {
    id: 'v5', camionId: 'c4', choferId: 'ch4', fechaSalida: daysAgo(1, 6, 30), fechaLlegada: daysAgo(1, 16, 0),
    origen: 'Asunción', destino: 'Concepción', tipoCarga: 'Materiales de construcción', clienteId: 'cl2',
    distanciaKm: 320, tarifa: 4100000, estado: 'completado', observaciones: 'Descarga en depósito norte', createdAt: daysAgo(1, 6, 0),
  },
  {
    id: 'v6', camionId: 'c6', choferId: 'ch6', fechaSalida: daysAgo(1, 7, 0), fechaLlegada: null,
    origen: 'Asunción', destino: 'Villarrica', tipoCarga: 'Carne y derivados', clienteId: 'cl4',
    distanciaKm: 160, tarifa: 2100000, estado: 'cancelado', observaciones: 'Cancelado por cliente — carga reprogramada', createdAt: daysAgo(1, 6, 45),
  },
  // Hace 2 días
  {
    id: 'v7', camionId: 'c1', choferId: 'ch1', fechaSalida: daysAgo(2, 5, 0), fechaLlegada: daysAgo(2, 15, 15),
    origen: 'Asunción', destino: 'Ciudad del Este', tipoCarga: 'Maquinaria agrícola', clienteId: 'cl5',
    distanciaKm: 330, tarifa: 5500000, estado: 'completado', observaciones: '', createdAt: daysAgo(2, 4, 30),
  },
  {
    id: 'v8', camionId: 'c8', choferId: 'ch8', fechaSalida: daysAgo(2, 4, 30), fechaLlegada: daysAgo(2, 17, 0),
    origen: 'Asunción', destino: 'Pedro Juan Caballero', tipoCarga: 'Soja y cereales', clienteId: 'cl1',
    distanciaKm: 550, tarifa: 7000000, estado: 'completado', observaciones: 'Conductor descansó en Concepción (parada técnica)', createdAt: daysAgo(2, 4, 0),
  },
  // Hace 3 días
  {
    id: 'v9', camionId: 'c3', choferId: 'ch3', fechaSalida: daysAgo(3, 6, 0), fechaLlegada: daysAgo(3, 11, 30),
    origen: 'Asunción', destino: 'Coronel Oviedo', tipoCarga: 'Alimentos secos', clienteId: 'cl3',
    distanciaKm: 130, tarifa: 1600000, estado: 'completado', observaciones: '', createdAt: daysAgo(3, 5, 30),
  },
  {
    id: 'v10', camionId: 'c5', choferId: 'ch5', fechaSalida: daysAgo(3, 7, 0), fechaLlegada: daysAgo(3, 14, 0),
    origen: 'Asunción', destino: 'San Ignacio', tipoCarga: 'Bebidas', clienteId: 'cl3',
    distanciaKm: 220, tarifa: 2800000, estado: 'completado', observaciones: '', createdAt: daysAgo(3, 6, 30),
  },
  // Hace 5 días
  {
    id: 'v11', camionId: 'c2', choferId: 'ch2', fechaSalida: daysAgo(5, 5, 0), fechaLlegada: daysAgo(5, 16, 30),
    origen: 'Asunción', destino: 'Filadelfia', tipoCarga: 'Alimentos refrigerados', clienteId: 'cl4',
    distanciaKm: 480, tarifa: 6300000, estado: 'completado', observaciones: '', createdAt: daysAgo(5, 4, 30),
  },
  {
    id: 'v12', camionId: 'c6', choferId: 'ch6', fechaSalida: daysAgo(5, 7, 0), fechaLlegada: daysAgo(5, 11, 30),
    origen: 'Asunción', destino: 'Caacupé', tipoCarga: 'Productos farmacéuticos', clienteId: 'cl4',
    distanciaKm: 54, tarifa: 680000, estado: 'completado', observaciones: 'Cadena de frío requerida', createdAt: daysAgo(5, 6, 30),
  },
  // Hace 7 días
  {
    id: 'v13', camionId: 'c4', choferId: 'ch4', fechaSalida: daysAgo(7, 4, 30), fechaLlegada: daysAgo(7, 17, 0),
    origen: 'Asunción', destino: 'Salto del Guairá', tipoCarga: 'Carga general', clienteId: 'cl5',
    distanciaKm: 380, tarifa: 5000000, estado: 'completado', observaciones: '', createdAt: daysAgo(7, 4, 0),
  },
  {
    id: 'v14', camionId: 'c7', choferId: 'ch7', fechaSalida: daysAgo(7, 6, 0), fechaLlegada: daysAgo(7, 11, 30),
    origen: 'Asunción', destino: 'Villarrica', tipoCarga: 'Materiales de construcción', clienteId: 'cl2',
    distanciaKm: 160, tarifa: 2050000, estado: 'completado', observaciones: '', createdAt: daysAgo(7, 5, 30),
  },
  // Hace 10 días
  {
    id: 'v15', camionId: 'c1', choferId: 'ch1', fechaSalida: daysAgo(10, 5, 30), fechaLlegada: daysAgo(10, 15, 0),
    origen: 'Asunción', destino: 'Ciudad del Este', tipoCarga: 'Maquinaria agrícola', clienteId: 'cl5',
    distanciaKm: 330, tarifa: 5200000, estado: 'completado', observaciones: '', createdAt: daysAgo(10, 5, 0),
  },
  {
    id: 'v16', camionId: 'c8', choferId: 'ch8', fechaSalida: daysAgo(10, 4, 0), fechaLlegada: daysAgo(10, 18, 0),
    origen: 'Asunción', destino: 'Pedro Juan Caballero', tipoCarga: 'Soja y cereales', clienteId: 'cl1',
    distanciaKm: 550, tarifa: 7100000, estado: 'completado', observaciones: 'Documentación fitosanitaria incluida', createdAt: daysAgo(10, 3, 30),
  },
  // Hace 12 días
  {
    id: 'v17', camionId: 'c3', choferId: 'ch3', fechaSalida: daysAgo(12, 6, 0), fechaLlegada: daysAgo(12, 11, 30),
    origen: 'Asunción', destino: 'Coronel Oviedo', tipoCarga: 'Alimentos secos', clienteId: 'cl3',
    distanciaKm: 130, tarifa: 1580000, estado: 'completado', observaciones: '', createdAt: daysAgo(12, 5, 30),
  },
  {
    id: 'v18', camionId: 'c5', choferId: 'ch5', fechaSalida: daysAgo(12, 7, 0), fechaLlegada: daysAgo(12, 15, 30),
    origen: 'Asunción', destino: 'Encarnación', tipoCarga: 'Bebidas', clienteId: 'cl3',
    distanciaKm: 370, tarifa: 4750000, estado: 'completado', observaciones: '', createdAt: daysAgo(12, 6, 30),
  },
  // Hace 15 días
  {
    id: 'v19', camionId: 'c2', choferId: 'ch2', fechaSalida: daysAgo(15, 6, 0), fechaLlegada: daysAgo(15, 9, 30),
    origen: 'Asunción', destino: 'Caacupé', tipoCarga: 'Productos farmacéuticos', clienteId: 'cl4',
    distanciaKm: 54, tarifa: 660000, estado: 'completado', observaciones: '', createdAt: daysAgo(15, 5, 30),
  },
  {
    id: 'v20', camionId: 'c6', choferId: 'ch6', fechaSalida: daysAgo(15, 5, 0), fechaLlegada: daysAgo(15, 16, 0),
    origen: 'Asunción', destino: 'Concepción', tipoCarga: 'Carne y derivados', clienteId: 'cl4',
    distanciaKm: 320, tarifa: 4200000, estado: 'completado', observaciones: '', createdAt: daysAgo(15, 4, 30),
  },
  // Mes anterior
  {
    id: 'v21', camionId: 'c4', choferId: 'ch4', fechaSalida: daysAgo(35, 5, 0), fechaLlegada: daysAgo(35, 15, 30),
    origen: 'Asunción', destino: 'Ciudad del Este', tipoCarga: 'Materiales de construcción', clienteId: 'cl2',
    distanciaKm: 330, tarifa: 4300000, estado: 'completado', observaciones: '', createdAt: daysAgo(35, 4, 30),
  },
  {
    id: 'v22', camionId: 'c7', choferId: 'ch7', fechaSalida: daysAgo(38, 6, 0), fechaLlegada: daysAgo(38, 12, 0),
    origen: 'Asunción', destino: 'Coronel Oviedo', tipoCarga: 'Bebidas', clienteId: 'cl3',
    distanciaKm: 130, tarifa: 1620000, estado: 'completado', observaciones: '', createdAt: daysAgo(38, 5, 30),
  },
  {
    id: 'v23', camionId: 'c1', choferId: 'ch1', fechaSalida: daysAgo(40, 4, 30), fechaLlegada: daysAgo(40, 16, 0),
    origen: 'Asunción', destino: 'Pedro Juan Caballero', tipoCarga: 'Soja y cereales', clienteId: 'cl1',
    distanciaKm: 550, tarifa: 7050000, estado: 'completado', observaciones: '', createdAt: daysAgo(40, 4, 0),
  },
  {
    id: 'v24', camionId: 'c8', choferId: 'ch8', fechaSalida: daysAgo(42, 6, 0), fechaLlegada: daysAgo(42, 11, 0),
    origen: 'Asunción', destino: 'San Ignacio', tipoCarga: 'Maquinaria agrícola', clienteId: 'cl5',
    distanciaKm: 220, tarifa: 2900000, estado: 'completado', observaciones: '', createdAt: daysAgo(42, 5, 30),
  },
  {
    id: 'v25', camionId: 'c3', choferId: 'ch3', fechaSalida: daysAgo(45, 5, 0), fechaLlegada: daysAgo(45, 14, 30),
    origen: 'Asunción', destino: 'Filadelfia', tipoCarga: 'Carga general', clienteId: 'cl5',
    distanciaKm: 480, tarifa: 6100000, estado: 'completado', observaciones: '', createdAt: daysAgo(45, 4, 30),
  },
]

export const initialData: AppState = {
  camiones,
  choferes,
  clientes,
  viajes,
  facturas: [],
  facturaCounter: 1,
}

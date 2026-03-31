import { AppState, Camion, Chofer, Cliente, Viaje } from '@/types'

const camiones: Camion[] = [
  { id: 'c1', patente: 'AB-1234', modelo: 'Volvo FH 500', anio: 2021, estado: 'en_viaje' },
  { id: 'c2', patente: 'CD-5678', modelo: 'Mercedes Actros 1845', anio: 2020, estado: 'disponible' },
  { id: 'c3', patente: 'EF-9012', modelo: 'Scania R 450', anio: 2022, estado: 'en_viaje' },
  { id: 'c4', patente: 'GH-3456', modelo: 'DAF XF 480', anio: 2019, estado: 'disponible' },
  { id: 'c5', patente: 'IJ-7890', modelo: 'Volvo FH 460', anio: 2021, estado: 'inactivo' },
  { id: 'c6', patente: 'KL-2345', modelo: 'Mercedes Actros 1836', anio: 2020, estado: 'disponible' },
  { id: 'c7', patente: 'MN-6789', modelo: 'Scania G 410', anio: 2018, estado: 'en_viaje' },
  { id: 'c8', patente: 'OP-0123', modelo: 'MAN TGX 18.440', anio: 2022, estado: 'disponible' },
]

const choferes: Chofer[] = [
  { id: 'ch1', nombre: 'Carlos Mendoza', licencia: 'A2-001234', telefono: '+56 9 8765 4321', camionAsignadoId: 'c1' },
  { id: 'ch2', nombre: 'Pedro Ramírez', licencia: 'A2-002345', telefono: '+56 9 7654 3210', camionAsignadoId: 'c2' },
  { id: 'ch3', nombre: 'Juan Contreras', licencia: 'A2-003456', telefono: '+56 9 6543 2109', camionAsignadoId: 'c3' },
  { id: 'ch4', nombre: 'Miguel Torres', licencia: 'A2-004567', telefono: '+56 9 5432 1098', camionAsignadoId: 'c4' },
  { id: 'ch5', nombre: 'Roberto Silva', licencia: 'A2-005678', telefono: '+56 9 4321 0987', camionAsignadoId: 'c5' },
  { id: 'ch6', nombre: 'Diego Fuentes', licencia: 'A2-006789', telefono: '+56 9 3210 9876', camionAsignadoId: 'c6' },
  { id: 'ch7', nombre: 'Andrés Morales', licencia: 'A2-007890', telefono: '+56 9 2109 8765', camionAsignadoId: 'c7' },
  { id: 'ch8', nombre: 'Luis Vargas', licencia: 'A2-008901', telefono: '+56 9 1098 7654', camionAsignadoId: 'c8' },
]

const clientes: Cliente[] = [
  { id: 'cl1', nombre: 'Supermercados La Estrella S.A.', rut: '76.123.456-7', email: 'logistica@laestrella.cl', direccion: 'Av. Providencia 1234, Santiago' },
  { id: 'cl2', nombre: 'Constructora Norte Ltda.', rut: '77.234.567-8', email: 'compras@constructoranorte.cl', direccion: 'Av. Matta 567, Santiago' },
  { id: 'cl3', nombre: 'Distribuidora Bebidas del Sur', rut: '78.345.678-9', email: 'operaciones@bebidasdelsur.cl', direccion: 'Calle Los Alerces 890, Concepción' },
  { id: 'cl4', nombre: 'Laboratorios MediFarma', rut: '79.456.789-0', email: 'bodega@medifarma.cl', direccion: 'Av. Las Condes 2345, Santiago' },
  { id: 'cl5', nombre: 'Retail TechStore Chile', rut: '80.567.890-1', email: 'supply@techstore.cl', direccion: 'Av. Vitacura 6789, Santiago' },
]

// Helper to generate ISO date strings relative to today
function daysAgo(days: number, hour = 8, minute = 0): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

function daysAgoEnd(days: number, hour = 16, minute = 30): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

const viajes: Viaje[] = [
  // Hoy
  {
    id: 'v1', camionId: 'c1', choferId: 'ch1', fechaSalida: daysAgo(0, 7, 0), fechaLlegada: null,
    origen: 'Santiago Centro', destino: 'Valparaíso', tipoCarga: 'Alimentos secos', clienteId: 'cl1',
    distanciaKm: 120, tarifa: 185000, estado: 'pendiente', observaciones: '', createdAt: daysAgo(0, 6, 30),
  },
  {
    id: 'v2', camionId: 'c3', choferId: 'ch3', fechaSalida: daysAgo(0, 8, 30), fechaLlegada: null,
    origen: 'Santiago Centro', destino: 'Rancagua', tipoCarga: 'Materiales de construcción', clienteId: 'cl2',
    distanciaKm: 87, tarifa: 145000, estado: 'pendiente', observaciones: 'Carga frágil, manejar con cuidado', createdAt: daysAgo(0, 8, 0),
  },
  {
    id: 'v3', camionId: 'c7', choferId: 'ch7', fechaSalida: daysAgo(0, 6, 0), fechaLlegada: daysAgo(0, 13, 45),
    origen: 'Santiago Centro', destino: 'San Antonio', tipoCarga: 'Bebidas', clienteId: 'cl3',
    distanciaKm: 96, tarifa: 160000, estado: 'completado', observaciones: '', createdAt: daysAgo(0, 5, 30),
  },
  // Ayer
  {
    id: 'v4', camionId: 'c2', choferId: 'ch2', fechaSalida: daysAgo(1, 7, 15), fechaLlegada: daysAgo(1, 15, 0),
    origen: 'Santiago Centro', destino: 'Talca', tipoCarga: 'Alimentos refrigerados', clienteId: 'cl1',
    distanciaKm: 255, tarifa: 320000, estado: 'completado', observaciones: '', createdAt: daysAgo(1, 7, 0),
  },
  {
    id: 'v5', camionId: 'c4', choferId: 'ch4', fechaSalida: daysAgo(1, 9, 0), fechaLlegada: daysAgo(1, 18, 30),
    origen: 'Santiago Centro', destino: 'Concepción', tipoCarga: 'Materiales de construcción', clienteId: 'cl2',
    distanciaKm: 510, tarifa: 580000, estado: 'completado', observaciones: 'Descarga en bodega B', createdAt: daysAgo(1, 8, 45),
  },
  {
    id: 'v6', camionId: 'c6', choferId: 'ch6', fechaSalida: daysAgo(1, 8, 0), fechaLlegada: null,
    origen: 'Santiago Centro', destino: 'Curicó', tipoCarga: 'Farmacéuticos', clienteId: 'cl4',
    distanciaKm: 195, tarifa: 290000, estado: 'cancelado', observaciones: 'Cancelado por cliente', createdAt: daysAgo(1, 7, 45),
  },
  // Hace 2 días
  {
    id: 'v7', camionId: 'c1', choferId: 'ch1', fechaSalida: daysAgo(2, 6, 30), fechaLlegada: daysAgo(2, 14, 0),
    origen: 'Santiago Centro', destino: 'Valparaíso', tipoCarga: 'Electrónica', clienteId: 'cl5',
    distanciaKm: 120, tarifa: 210000, estado: 'completado', observaciones: '', createdAt: daysAgo(2, 6, 0),
  },
  {
    id: 'v8', camionId: 'c8', choferId: 'ch8', fechaSalida: daysAgo(2, 7, 0), fechaLlegada: daysAgo(2, 16, 45),
    origen: 'Santiago Centro', destino: 'Antofagasta', tipoCarga: 'Maquinaria', clienteId: 'cl2',
    distanciaKm: 1355, tarifa: 1250000, estado: 'completado', observaciones: 'Viaje largo, conductor descansó en Copiapó', createdAt: daysAgo(2, 6, 30),
  },
  // Hace 3 días
  {
    id: 'v9', camionId: 'c3', choferId: 'ch3', fechaSalida: daysAgo(3, 8, 0), fechaLlegada: daysAgo(3, 12, 30),
    origen: 'Santiago Centro', destino: 'Rancagua', tipoCarga: 'Alimentos secos', clienteId: 'cl1',
    distanciaKm: 87, tarifa: 130000, estado: 'completado', observaciones: '', createdAt: daysAgo(3, 7, 45),
  },
  {
    id: 'v10', camionId: 'c5', choferId: 'ch5', fechaSalida: daysAgo(3, 9, 30), fechaLlegada: daysAgo(3, 15, 0),
    origen: 'Santiago Centro', destino: 'San Fernando', tipoCarga: 'Bebidas', clienteId: 'cl3',
    distanciaKm: 140, tarifa: 195000, estado: 'completado', observaciones: '', createdAt: daysAgo(3, 9, 0),
  },
  // Hace 5 días
  {
    id: 'v11', camionId: 'c2', choferId: 'ch2', fechaSalida: daysAgo(5, 7, 30), fechaLlegada: daysAgo(5, 16, 0),
    origen: 'Santiago Centro', destino: 'Temuco', tipoCarga: 'Alimentos refrigerados', clienteId: 'cl1',
    distanciaKm: 675, tarifa: 750000, estado: 'completado', observaciones: '', createdAt: daysAgo(5, 7, 0),
  },
  {
    id: 'v12', camionId: 'c6', choferId: 'ch6', fechaSalida: daysAgo(5, 8, 0), fechaLlegada: daysAgo(5, 11, 45),
    origen: 'Santiago Centro', destino: 'Melipilla', tipoCarga: 'Farmacéuticos', clienteId: 'cl4',
    distanciaKm: 65, tarifa: 95000, estado: 'completado', observaciones: 'Temperatura controlada', createdAt: daysAgo(5, 7, 30),
  },
  // Hace 7 días
  {
    id: 'v13', camionId: 'c4', choferId: 'ch4', fechaSalida: daysAgo(7, 6, 0), fechaLlegada: daysAgo(7, 18, 30),
    origen: 'Santiago Centro', destino: 'Puerto Montt', tipoCarga: 'Carga general', clienteId: 'cl2',
    distanciaKm: 1015, tarifa: 980000, estado: 'completado', observaciones: '', createdAt: daysAgo(7, 5, 30),
  },
  {
    id: 'v14', camionId: 'c7', choferId: 'ch7', fechaSalida: daysAgo(7, 9, 0), fechaLlegada: daysAgo(7, 13, 0),
    origen: 'Santiago Centro', destino: 'Los Andes', tipoCarga: 'Materiales de construcción', clienteId: 'cl2',
    distanciaKm: 80, tarifa: 125000, estado: 'completado', observaciones: '', createdAt: daysAgo(7, 8, 30),
  },
  // Hace 10 días
  {
    id: 'v15', camionId: 'c1', choferId: 'ch1', fechaSalida: daysAgo(10, 7, 0), fechaLlegada: daysAgo(10, 14, 30),
    origen: 'Santiago Centro', destino: 'Viña del Mar', tipoCarga: 'Electrónica', clienteId: 'cl5',
    distanciaKm: 125, tarifa: 220000, estado: 'completado', observaciones: '', createdAt: daysAgo(10, 6, 30),
  },
  {
    id: 'v16', camionId: 'c8', choferId: 'ch8', fechaSalida: daysAgo(10, 8, 0), fechaLlegada: daysAgo(10, 17, 0),
    origen: 'Santiago Centro', destino: 'Iquique', tipoCarga: 'Textiles', clienteId: 'cl5',
    distanciaKm: 1850, tarifa: 1680000, estado: 'completado', observaciones: 'Carga importada, documentación adjunta', createdAt: daysAgo(10, 7, 30),
  },
  // Hace 12 días
  {
    id: 'v17', camionId: 'c3', choferId: 'ch3', fechaSalida: daysAgo(12, 7, 30), fechaLlegada: daysAgo(12, 12, 0),
    origen: 'Santiago Centro', destino: 'Rancagua', tipoCarga: 'Alimentos secos', clienteId: 'cl1',
    distanciaKm: 87, tarifa: 130000, estado: 'completado', observaciones: '', createdAt: daysAgo(12, 7, 0),
  },
  {
    id: 'v18', camionId: 'c5', choferId: 'ch5', fechaSalida: daysAgo(12, 9, 0), fechaLlegada: daysAgo(12, 16, 0),
    origen: 'Santiago Centro', destino: 'Chillán', tipoCarga: 'Bebidas', clienteId: 'cl3',
    distanciaKm: 400, tarifa: 445000, estado: 'completado', observaciones: '', createdAt: daysAgo(12, 8, 30),
  },
  // Hace 15 días
  {
    id: 'v19', camionId: 'c2', choferId: 'ch2', fechaSalida: daysAgo(15, 8, 0), fechaLlegada: daysAgo(15, 10, 30),
    origen: 'Santiago Centro', destino: 'Pudahuel', tipoCarga: 'Farmacéuticos', clienteId: 'cl4',
    distanciaKm: 25, tarifa: 65000, estado: 'completado', observaciones: '', createdAt: daysAgo(15, 7, 30),
  },
  {
    id: 'v20', camionId: 'c6', choferId: 'ch6', fechaSalida: daysAgo(15, 7, 0), fechaLlegada: daysAgo(15, 15, 30),
    origen: 'Santiago Centro', destino: 'La Serena', tipoCarga: 'Carga general', clienteId: 'cl1',
    distanciaKm: 470, tarifa: 520000, estado: 'completado', observaciones: '', createdAt: daysAgo(15, 6, 30),
  },
  // Mes anterior (hace 35-50 días)
  {
    id: 'v21', camionId: 'c4', choferId: 'ch4', fechaSalida: daysAgo(35, 7, 0), fechaLlegada: daysAgo(35, 15, 0),
    origen: 'Santiago Centro', destino: 'Concepción', tipoCarga: 'Materiales de construcción', clienteId: 'cl2',
    distanciaKm: 510, tarifa: 580000, estado: 'completado', observaciones: '', createdAt: daysAgo(35, 6, 30),
  },
  {
    id: 'v22', camionId: 'c7', choferId: 'ch7', fechaSalida: daysAgo(38, 8, 0), fechaLlegada: daysAgo(38, 13, 0),
    origen: 'Santiago Centro', destino: 'San Antonio', tipoCarga: 'Bebidas', clienteId: 'cl3',
    distanciaKm: 96, tarifa: 160000, estado: 'completado', observaciones: '', createdAt: daysAgo(38, 7, 30),
  },
  {
    id: 'v23', camionId: 'c1', choferId: 'ch1', fechaSalida: daysAgo(40, 7, 30), fechaLlegada: daysAgo(40, 16, 0),
    origen: 'Santiago Centro', destino: 'Temuco', tipoCarga: 'Alimentos refrigerados', clienteId: 'cl1',
    distanciaKm: 675, tarifa: 750000, estado: 'completado', observaciones: '', createdAt: daysAgo(40, 7, 0),
  },
  {
    id: 'v24', camionId: 'c8', choferId: 'ch8', fechaSalida: daysAgo(42, 9, 0), fechaLlegada: daysAgo(42, 12, 0),
    origen: 'Santiago Centro', destino: 'Maipú', tipoCarga: 'Electrónica', clienteId: 'cl5',
    distanciaKm: 30, tarifa: 75000, estado: 'completado', observaciones: '', createdAt: daysAgo(42, 8, 30),
  },
  {
    id: 'v25', camionId: 'c3', choferId: 'ch3', fechaSalida: daysAgo(45, 7, 0), fechaLlegada: daysAgo(45, 14, 0),
    origen: 'Santiago Centro', destino: 'Valparaíso', tipoCarga: 'Textiles', clienteId: 'cl5',
    distanciaKm: 120, tarifa: 195000, estado: 'completado', observaciones: '', createdAt: daysAgo(45, 6, 30),
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

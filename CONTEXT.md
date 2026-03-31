# FlotaFlota — Documento de Contexto del Proyecto

## 1. Descripción general

**FlotaFlota** es un prototipo funcional de aplicación SaaS web para la gestión de viajes y facturación de una empresa de logística con flota de 8 camiones. El sistema está orientado a personal administrativo no técnico.

### Problema que resuelve
- Los 8 camiones hacen viajes diarios que necesitan ser registrados con datos clave
- Los viajes deben poder clasificarse y filtrarse para generar facturación mensual a clientes
- Se necesita visibilidad del estado actual de cada camión y métricas del negocio

### Flujo principal
```
Registrar viaje → Ver en listado → Seleccionar para facturación → Generar factura
```

---

## 2. Stack tecnológico

| Tecnología | Rol |
|---|---|
| **Next.js 14** (App Router) | Framework web principal |
| **TypeScript** | Tipado estático |
| **Tailwind CSS** | Estilos utilitarios |
| **lucide-react** | Iconografía |
| **date-fns** | Manejo de fechas con localización española |
| **clsx + tailwind-merge** | Composición de clases CSS |
| **localStorage** | Persistencia de datos en el cliente |

> No hay backend real. Todo el estado vive en memoria (React Context + useReducer) y se persiste en `localStorage` bajo la clave `flota-flota-data`.

---

## 3. Estructura del proyecto

```
/
├── src/
│   ├── types/
│   │   └── index.ts          # Todos los tipos TypeScript
│   ├── lib/
│   │   ├── utils.ts           # Helpers: formateo, exportCSV, colores, constantes
│   │   ├── mockData.ts        # Datos iniciales: 8 camiones, 8 choferes, 5 clientes, 25 viajes
│   │   └── store.tsx          # Context + useReducer (AppProvider, useApp hook)
│   ├── components/
│   │   └── Sidebar.tsx        # Navegación lateral responsive (desktop + mobile)
│   └── app/
│       ├── layout.tsx         # Root layout: fuente, AppProvider, Sidebar
│       ├── globals.css        # Tailwind + clases de componentes reutilizables
│       ├── page.tsx           # Dashboard principal
│       ├── viajes/
│       │   ├── page.tsx       # Listado de viajes con filtros, búsqueda, export CSV
│       │   └── nuevo/
│       │       └── page.tsx   # Formulario de registro de viaje
│       ├── facturacion/
│       │   └── page.tsx       # Módulo de facturación con vista previa
│       └── flota/
│           └── page.tsx       # CRUD de camiones y choferes (tabs)
├── package.json
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## 4. Entidades del dominio

### Camión (`Camion`)
```typescript
{
  id: string
  patente: string        // Ej: "AB-1234"
  modelo: string         // Ej: "Volvo FH 500"
  anio: number
  estado: 'disponible' | 'en_viaje' | 'inactivo'
}
```

### Chofer (`Chofer`)
```typescript
{
  id: string
  nombre: string
  licencia: string       // N° de licencia de conducir
  telefono: string
  camionAsignadoId: string | null
}
```

### Cliente (`Cliente`)
```typescript
{
  id: string
  nombre: string
  rut: string            // Formato chileno: XX.XXX.XXX-X
  email: string
  direccion: string
}
```

### Viaje (`Viaje`)
```typescript
{
  id: string
  camionId: string
  choferId: string
  fechaSalida: string    // ISO 8601
  fechaLlegada: string | null
  origen: string
  destino: string
  tipoCarga: string      // Ver TIPOS_CARGA en utils.ts
  clienteId: string
  distanciaKm: number
  tarifa: number         // En CLP (pesos chilenos)
  estado: 'pendiente' | 'completado' | 'cancelado'
  observaciones: string
  createdAt: string      // ISO 8601
}
```

### Factura (`Factura`)
```typescript
{
  id: string
  numero: string         // Formato: "F-YYYY-NNNN"
  clienteId: string
  viajesIds: string[]
  fechaEmision: string
  subtotal: number       // Suma de tarifas de viajes
  impuesto: number       // 19% IVA
  total: number          // subtotal + impuesto
}
```

---

## 5. Gestión del estado

### Clave de almacenamiento
`localStorage` → `flota-flota-data`

### AppProvider y useApp
El estado global se gestiona en `src/lib/store.tsx` con el patrón Context + useReducer:

```typescript
const { state, dispatch, isLoaded } = useApp()
```

### Acciones disponibles
| Acción | Payload |
|---|---|
| `LOAD_STATE` | `AppState` completo |
| `ADD_VIAJE` | Viaje sin id/createdAt |
| `UPDATE_VIAJE` | `{ id, data: Partial<Viaje> }` |
| `DELETE_VIAJE` | id |
| `ADD_CAMION` | Camión sin id |
| `UPDATE_CAMION` | `{ id, data: Partial<Camion> }` |
| `DELETE_CAMION` | id (también desasigna choferes) |
| `ADD_CHOFER` | Chofer sin id |
| `UPDATE_CHOFER` | `{ id, data: Partial<Chofer> }` |
| `DELETE_CHOFER` | id |
| `GENERATE_FACTURA` | `{ clienteId, viajesIds[] }` |

### Lógica de negocio automática
- Al agregar un viaje con estado `'pendiente'`, el camión asociado cambia a `'en_viaje'`
- Al actualizar un viaje, los estados de camiones se recalculan automáticamente
- Al eliminar un camión, los choferes asignados quedan con `camionAsignadoId = null`
- Las facturas excluyen viajes ya facturados (cross-check por `viajesIds`)

---

## 6. Pantallas

### Dashboard (`/`)
- Cards de resumen: viajes hoy (completados / en curso), camiones activos
- Comparativa de facturación: mes actual vs mes anterior con tendencia %
- Grid de 8 camiones con estado en tiempo real
- Tabla de últimos 5 viajes

### Listado de viajes (`/viajes`)
- Tabla con todos los viajes, ordenable por cualquier columna
- Búsqueda libre (camión, chofer, cliente, ruta, tipo de carga)
- Filtros avanzados: camión, chofer, cliente, estado, tipo de carga, rango de fechas
- Exportar a CSV (incluye todos los campos, con BOM para Excel en Windows)
- Modal de edición inline
- Confirmación de eliminación

### Registro de viaje (`/viajes/nuevo`)
- Formulario completo con validación
- Campos obligatorios marcados con asterisco
- Redirección al listado tras guardar

### Facturación (`/facturacion`)
- Selector de cliente + rango de fechas
- Solo muestra viajes `completados` no facturados previamente
- Selección individual o masiva de viajes
- Barra de resumen con subtotal y total con IVA en tiempo real
- Modal de vista previa de factura (imprimible)
- Historial de facturas generadas
- IVA: 19% fijo

### Flota (`/flota`)
- Tabs: Camiones | Choferes
- CRUD completo para ambas entidades
- Camiones: muestra chofer asignado y total de viajes realizados
- Choferes: muestra camión asignado y total de viajes realizados

---

## 7. Datos iniciales (mock data)

El sistema se inicializa con datos pre-cargados en `src/lib/mockData.ts`:

- **8 camiones**: Volvo, Mercedes, Scania, DAF, MAN en estados variados
- **8 choferes**: Con licencias A2 y camiones asignados
- **5 clientes**: Empresas ficticias con RUT y datos de contacto chilenos
- **25 viajes**: Distribuidos entre los últimos 50 días (incluyendo viajes de hoy, ayer, y del mes anterior) para mostrar métricas reales en el dashboard

Los datos se cargan una única vez. Si ya existe data en `localStorage`, se prioriza la guardada.

---

## 8. Comandos de desarrollo

```bash
npm install          # Instalar dependencias
npm run dev          # Servidor de desarrollo en http://localhost:3000
npm run build        # Build de producción
npm run start        # Servidor de producción
```

---

## 9. Decisiones de diseño

### Por qué no shadcn/ui
Para evitar la dependencia del CLI de shadcn, todos los componentes UI se implementaron con Tailwind CSS puro usando clases de componentes definidas en `globals.css` (`.btn-primary`, `.card`, `.form-input`, etc.).

### Por qué localStorage y no API
El prototipo no tiene backend. Los datos persisten entre recargas de página usando `localStorage`. En una versión productiva, se reemplazaría `store.tsx` para consumir una API REST o GraphQL.

### Moneda y localización
- Moneda: CLP (Peso Chileno) con `Intl.NumberFormat('es-CL')`
- Fechas: formato `dd/MM/yyyy HH:mm` con `date-fns` y locale `es`
- RUT: formato chileno estándar

### Mobile-first
El sidebar colapsa en móvil con un botón de hamburguesa. Todas las tablas son scrolleables horizontalmente. Los formularios usan grids responsivos.

---

## 10. Extensiones futuras sugeridas

1. **Backend**: Reemplazar `localStorage` por llamadas a una API (Supabase, PlanetScale, etc.)
2. **Autenticación**: Next-Auth o Clerk para multi-usuario
3. **PDF real**: Generar PDFs de facturas con `react-pdf` o similar
4. **Notificaciones**: Alertas cuando un viaje lleva mucho tiempo pendiente
5. **Reportes**: Dashboard analítico con gráficos por período
6. **Clientes**: CRUD completo de clientes (actualmente son datos fijos)
7. **Geolocalización**: Seguimiento en tiempo real de camiones en viaje
8. **Integración SII**: Generación de DTE (Documento Tributario Electrónico) para Chile

import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/components/Sidebar'
import { AppProvider } from '@/lib/store'

export const metadata: Metadata = {
  title: 'FlotaFlota — Gestión Logística',
  description: 'Sistema de gestión de viajes y facturación para flota de camiones',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="font-sans">
        <AppProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 lg:pl-64">
              <div className="p-6 lg:p-8 pt-16 lg:pt-8">
                {children}
              </div>
            </main>
          </div>
        </AppProvider>
      </body>
    </html>
  )
}

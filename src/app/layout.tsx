import type { Metadata } from 'next'
import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/500.css'
import '@fontsource/dm-sans/600.css'
import '@fontsource/dm-sans/700.css'
import './globals.css'
import { Sidebar } from '@/components/Sidebar'
import { AppProvider } from '@/lib/store'

export const metadata: Metadata = {
  title: 'Flota Fast — Gestión Logística',
  description: 'Sistema de gestión de viajes y facturación para flota de camiones',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
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

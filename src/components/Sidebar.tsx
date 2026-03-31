'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  MapPin,
  PlusCircle,
  FileText,
  Truck,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  {
    label: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Viajes',
    icon: MapPin,
    children: [
      { label: 'Listado de viajes', href: '/viajes', icon: MapPin },
      { label: 'Registrar viaje', href: '/viajes/nuevo', icon: PlusCircle },
    ],
  },
  {
    label: 'Facturación',
    href: '/facturacion',
    icon: FileText,
  },
  {
    label: 'Flota',
    href: '/flota',
    icon: Truck,
  },
]

function NavLink({ href, icon: Icon, label, onClick }: {
  href: string
  icon: React.ElementType
  label: string
  onClick?: () => void
}) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn('sidebar-link', isActive && 'active')}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  )
}

function NavGroup({ label, icon: Icon, children }: {
  label: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(true)

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="sidebar-link w-full justify-between"
      >
        <div className="flex items-center gap-3">
          <Icon size={18} />
          <span>{label}</span>
        </div>
        <ChevronRight
          size={14}
          className={cn('transition-transform', open && 'rotate-90')}
        />
      </button>
      {open && (
        <div className="ml-3 mt-1 space-y-0.5 border-l border-slate-700 pl-3">
          {children}
        </div>
      )}
    </div>
  )
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-slate-700">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Truck size={16} className="text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">FlotaFlota</div>
            <div className="text-slate-400 text-xs">Gestión logística</div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white lg:hidden">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          if (item.children) {
            return (
              <NavGroup key={item.label} label={item.label} icon={item.icon}>
                {item.children.map(child => (
                  <NavLink
                    key={child.href}
                    href={child.href}
                    icon={child.icon}
                    label={child.label}
                    onClick={onClose}
                  />
                ))}
              </NavGroup>
            )
          }
          return (
            <NavLink
              key={item.href}
              href={item.href!}
              icon={item.icon}
              label={item.label}
              onClick={onClose}
            />
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="text-xs text-slate-500 text-center">v1.0.0 · Prototipo</div>
      </div>
    </>
  )
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-40 lg:hidden bg-slate-900 text-white p-2 rounded-lg shadow-lg"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 flex flex-col transition-transform duration-300 lg:hidden',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 bg-slate-900">
        <SidebarContent />
      </div>
    </>
  )
}

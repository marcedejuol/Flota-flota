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
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors duration-150 rounded-lg',
        isActive
          ? 'text-white bg-white/10 border-l-2 border-blue-400 rounded-l-none pl-[10px]'
          : 'text-slate-400 hover:text-white hover:bg-white/5'
      )}
    >
      <Icon size={16} className={isActive ? 'text-blue-400' : ''} />
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
        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors duration-150 rounded-lg w-full justify-between"
      >
        <div className="flex items-center gap-3">
          <Icon size={16} />
          <span>{label}</span>
        </div>
        <ChevronRight
          size={12}
          className={cn('transition-transform text-slate-600', open && 'rotate-90')}
        />
      </button>
      {open && (
        <div className="ml-3 mt-0.5 space-y-0.5 border-l border-slate-800 pl-3">
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
      <div className="flex items-center justify-between px-5 py-5 border-b border-slate-800">
        <div>
          <div className="text-base font-bold tracking-tight leading-none">
            <span className="text-white">Flota</span><span className="text-blue-400">Fast</span>
          </div>
          <div className="text-slate-500 text-xs mt-1.5 font-normal tracking-wide">Gestión logística</div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-500 hover:text-white lg:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto mt-1">
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
      <div className="p-4 border-t border-slate-800">
        <div className="text-xs text-slate-600 text-center tracking-wide">v1.0 · Prototipo</div>
      </div>
    </>
  )
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-40 lg:hidden bg-slate-900 text-white p-2 rounded-lg shadow-lg"
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 w-60 bg-slate-900 flex flex-col transition-transform duration-300 lg:hidden',
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

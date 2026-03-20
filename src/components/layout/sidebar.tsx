"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/store/app-store"
import { useAuthStore } from "@/store/auth-store"
import {
  LayoutDashboard,
  Building2,
  Database,
  ClipboardCheck,
  ListTodo,
  UserCheck,
  ShieldAlert,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  Shield,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/organizacion", label: "Organización", icon: Building2 },
  { href: "/inventario", label: "Inventario de Datos", icon: Database },
  { href: "/evaluacion", label: "Evaluación GAP", icon: ClipboardCheck },
  { href: "/plan-accion", label: "Plan de Acción", icon: ListTodo },
  { href: "/arco", label: "Derechos ARCO-POB", icon: UserCheck },
  { href: "/brechas", label: "Brechas de Seguridad", icon: ShieldAlert },
  { href: "/documentos", label: "Documentos", icon: FileText },
  { href: "/configuracion", label: "Configuración", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar } = useAppStore()
  const { user, signOut } = useAuthStore()

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-slate-900 text-white transition-all duration-300 flex flex-col",
        sidebarOpen ? "w-64" : "w-20"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Shield className="h-5 w-5 text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <h1 className="font-bold text-sm">GAP Ley 21.719</h1>
              <p className="text-[10px] text-slate-400">Protección de Datos</p>
            </div>
          )}
        </div>
        <button onClick={toggleSidebar} className="text-slate-400 hover:text-white transition-colors">
          <ChevronLeft className={cn("h-5 w-5 transition-transform", !sidebarOpen && "rotate-180")} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                isActive
                  ? "bg-blue-600 text-white font-medium shadow-lg shadow-blue-600/20"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
              title={!sidebarOpen ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-slate-700 p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-medium">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || "Usuario"}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.role || "USUARIO"}</p>
            </div>
          )}
          {sidebarOpen && (
            <button onClick={signOut} className="text-slate-400 hover:text-red-400 transition-colors" title="Cerrar sesión">
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}

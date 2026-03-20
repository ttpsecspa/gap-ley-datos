"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Shield,
  Bell,
  Database,
  Key,
  UserPlus,
  Pencil,
  Trash2,
  Mail,
  CheckCircle2,
} from "lucide-react"

type Tab = "equipo" | "roles" | "notificaciones" | "seguridad" | "sistema"

const mockTeam = [
  { id: "1", name: "María Rodríguez", email: "mrodriguez@empresa.cl", role: "ADMIN" as const, active: true },
  { id: "2", name: "Carlos Méndez", email: "cmendez@empresa.cl", role: "DPO" as const, active: true },
  { id: "3", name: "Ana Torres", email: "atorres@empresa.cl", role: "RESPONSABLE" as const, active: true },
  { id: "4", name: "Pedro Soto", email: "psoto@empresa.cl", role: "AUDITOR" as const, active: true },
  { id: "5", name: "Laura Vega", email: "lvega@empresa.cl", role: "CONSULTOR" as const, active: true },
  { id: "6", name: "Diego Morales", email: "dmorales@empresa.cl", role: "USUARIO" as const, active: true },
  { id: "7", name: "Camila Reyes", email: "creyes@empresa.cl", role: "USUARIO" as const, active: true },
  { id: "8", name: "Felipe Rojas", email: "frojas@empresa.cl", role: "USUARIO" as const, active: false },
  { id: "9", name: "Valentina Díaz", email: "vdiaz@empresa.cl", role: "CONSULTOR" as const, active: true },
  { id: "10", name: "Sebastián Vargas", email: "svargas@empresa.cl", role: "RESPONSABLE" as const, active: true },
]

const roleDescriptions: Record<string, string> = {
  ADMIN: "Acceso total al sistema. Gestión de usuarios y configuración.",
  DPO: "Delegado de Protección de Datos. Supervisión del cumplimiento.",
  RESPONSABLE: "Responsable de tratamiento. Gestión de inventario y evaluaciones.",
  AUDITOR: "Acceso de lectura. Generación de reportes y auditorías.",
  CONSULTOR: "Acceso limitado. Consulta y soporte al equipo.",
  USUARIO: "Acceso básico. Responde evaluaciones y gestiona tareas asignadas.",
}

const roleColor: Record<string, string> = {
  ADMIN: "destructive",
  DPO: "default",
  RESPONSABLE: "warning",
  AUDITOR: "secondary",
  CONSULTOR: "outline",
  USUARIO: "secondary",
}

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState<Tab>("equipo")
  const [showInvite, setShowInvite] = useState(false)

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "equipo", label: "Equipo", icon: Users },
    { id: "roles", label: "Roles y Permisos", icon: Shield },
    { id: "notificaciones", label: "Notificaciones", icon: Bell },
    { id: "seguridad", label: "Seguridad", icon: Key },
    { id: "sistema", label: "Sistema", icon: Database },
  ]

  return (
    <AppShell>
      <Header title="Configuración" subtitle="Administración del sistema y equipo de trabajo" />
      <div className="p-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Equipo */}
        {activeTab === "equipo" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Equipo de Trabajo</h3>
                <p className="text-sm text-gray-500">10 miembros del equipo de cumplimiento</p>
              </div>
              <Button onClick={() => setShowInvite(!showInvite)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Invitar Miembro
              </Button>
            </div>

            {showInvite && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Input placeholder="Nombre completo" className="flex-1" />
                    <Input placeholder="correo@empresa.cl" className="flex-1" />
                    <select className="flex h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
                      <option value="">Seleccionar rol...</option>
                      {Object.keys(roleDescriptions).map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                    <Button>Enviar Invitación</Button>
                    <Button variant="ghost" onClick={() => setShowInvite(false)}>Cancelar</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-3">
              {mockTeam.map((member) => (
                <Card key={member.id} className={!member.active ? "opacity-60" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700">
                          {member.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">{member.name}</p>
                            {!member.active && <Badge variant="secondary">Inactivo</Badge>}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Mail className="h-3 w-3" />
                            {member.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={roleColor[member.role] as "default"}>{member.role}</Badge>
                        <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Roles */}
        {activeTab === "roles" && (
          <div className="grid gap-4">
            {Object.entries(roleDescriptions).map(([role, desc]) => (
              <Card key={role}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-gray-100">
                        <Shield className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{role}</h4>
                          <Badge variant="outline">
                            {mockTeam.filter(m => m.role === role).length} miembros
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{desc}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Editar Permisos</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Notificaciones */}
        {activeTab === "notificaciones" && (
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Notificaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Solicitudes ARCO nuevas", desc: "Notificar al DPO cuando se recibe una solicitud", enabled: true },
                { label: "Brechas de seguridad", desc: "Alerta inmediata al equipo de respuesta", enabled: true },
                { label: "Acciones vencidas", desc: "Recordatorio de acciones que superaron fecha límite", enabled: true },
                { label: "Evaluaciones completadas", desc: "Notificar al responsable cuando se completa una evaluación", enabled: false },
                { label: "Documentos por revisar", desc: "Aviso cuando un documento requiere aprobación", enabled: true },
                { label: "Resumen semanal", desc: "Reporte semanal por correo del estado general", enabled: false },
              ].map((notif, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-sm">{notif.label}</p>
                    <p className="text-xs text-gray-500">{notif.desc}</p>
                  </div>
                  <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notif.enabled ? "bg-blue-600" : "bg-gray-200"
                  }`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notif.enabled ? "translate-x-6" : "translate-x-1"
                    }`} />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Seguridad */}
        {activeTab === "seguridad" && (
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Políticas de Seguridad</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Longitud mínima contraseña</label>
                    <Input type="number" defaultValue="12" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Expiración de sesión (minutos)</label>
                    <Input type="number" defaultValue="30" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Intentos máximos de login</label>
                    <Input type="number" defaultValue="5" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Días para cambio de contraseña</label>
                    <Input type="number" defaultValue="90" className="mt-1" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <p className="font-medium text-sm">Autenticación de dos factores (2FA)</p>
                    <p className="text-xs text-gray-500">Requerir 2FA para todos los usuarios</p>
                  </div>
                  <Badge variant="success">Recomendado</Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Log de Auditoría</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { action: "Login exitoso", user: "María Rodríguez", time: "Hace 5 min" },
                    { action: "Evaluación GAP creada", user: "Carlos Méndez", time: "Hace 1 hora" },
                    { action: "Documento aprobado", user: "Ana Torres", time: "Hace 2 horas" },
                    { action: "Solicitud ARCO respondida", user: "Pedro Soto", time: "Hace 3 horas" },
                    { action: "Brecha reportada", user: "Laura Vega", time: "Hace 1 día" },
                  ].map((log, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{log.action}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>{log.user}</span>
                        <span>{log.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sistema */}
        {activeTab === "sistema" && (
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Información del Sistema</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500">Version:</span> <span className="font-medium">1.0.0</span></div>
                  <div><span className="text-gray-500">Entorno:</span> <span className="font-medium">Producción</span></div>
                  <div><span className="text-gray-500">Base de Datos:</span> <span className="font-medium">Supabase PostgreSQL</span></div>
                  <div><span className="text-gray-500">Hosting:</span> <span className="font-medium">GitHub Pages</span></div>
                  <div><span className="text-gray-500">Framework:</span> <span className="font-medium">Next.js 14</span></div>
                  <div><span className="text-gray-500">Ley Aplicable:</span> <span className="font-medium">Ley 21.719</span></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Conexión Supabase</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium">SUPABASE_URL</label>
                  <Input defaultValue="https://xxxxx.supabase.co" className="mt-1 font-mono text-xs" />
                </div>
                <div>
                  <label className="text-sm font-medium">SUPABASE_ANON_KEY</label>
                  <Input type="password" defaultValue="eyJ..." className="mt-1 font-mono text-xs" />
                </div>
                <Button variant="outline" size="sm">
                  <Database className="h-4 w-4 mr-2" />
                  Probar Conexión
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  )
}

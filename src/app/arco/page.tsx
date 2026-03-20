"use client"

import { useState, useMemo } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/ui/stat-card"
import {
  UserCheck,
  Plus,
  Clock,
  AlertTriangle,
  Mail,
  Search,
  Filter,
  Calendar,
  FileText,
  CheckCircle2,
  XCircle,
  X,
  ChevronLeft,
  Eye,
} from "lucide-react"
import { getStatusColor, formatDate } from "@/lib/utils"
import type {
  RequestType,
  RequestStatus,
  RequestResolution,
  SubjectRequest,
} from "@/types/database"

// -- Helpers --

const REQUEST_TYPE_LABELS: Record<RequestType, string> = {
  ACCESO: "Acceso",
  RECTIFICACION: "Rectificación",
  SUPRESION: "Supresión",
  OPOSICION: "Oposición",
  PORTABILIDAD: "Portabilidad",
  BLOQUEO: "Bloqueo",
}

const REQUEST_TYPE_COLORS: Record<RequestType, string> = {
  ACCESO: "text-blue-700 bg-blue-100",
  RECTIFICACION: "text-purple-700 bg-purple-100",
  SUPRESION: "text-red-700 bg-red-100",
  OPOSICION: "text-orange-700 bg-orange-100",
  PORTABILIDAD: "text-teal-700 bg-teal-100",
  BLOQUEO: "text-gray-700 bg-gray-200",
}

const STATUS_LABELS: Record<RequestStatus, string> = {
  RECIBIDA: "Recibida",
  EN_PROCESO: "En proceso",
  RESPONDIDA: "Respondida",
  CERRADA: "Cerrada",
  VENCIDA: "Vencida",
}

const RESOLUTION_LABELS: Record<RequestResolution, string> = {
  ACEPTADA: "Aceptada",
  RECHAZADA: "Rechazada",
  PARCIAL: "Parcial",
}

function getBusinessDaysRemaining(dueDate: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dueDate)
  due.setHours(0, 0, 0, 0)

  if (due <= today) return 0

  let count = 0
  const current = new Date(today)
  while (current < due) {
    current.setDate(current.getDate() + 1)
    const day = current.getDay()
    if (day !== 0 && day !== 6) count++
  }
  return count
}

function SLAIndicator({ dueDate, status }: { dueDate: string; status: RequestStatus }) {
  if (status === "CERRADA" || status === "RESPONDIDA") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
        <CheckCircle2 className="h-3 w-3" />
        Completada
      </span>
    )
  }
  if (status === "VENCIDA") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 px-2 py-1 rounded-full">
        <XCircle className="h-3 w-3" />
        Vencida
      </span>
    )
  }
  const remaining = getBusinessDaysRemaining(dueDate)
  if (remaining === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 px-2 py-1 rounded-full animate-pulse">
        <AlertTriangle className="h-3 w-3" />
        Vencida hoy
      </span>
    )
  }
  const isUrgent = remaining <= 5
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
        isUrgent ? "text-red-700 bg-red-50" : remaining <= 10 ? "text-yellow-700 bg-yellow-50" : "text-green-700 bg-green-50"
      }`}
    >
      <Clock className="h-3 w-3" />
      {remaining} días hábiles
    </span>
  )
}

// -- Mock Data --

const mockRequests: (SubjectRequest & { assigned_to_name?: string })[] = [
  {
    id: "req-001",
    organization_id: "org-1",
    request_type: "ACCESO",
    requester_name: "María González Rojas",
    requester_email: "maria.gonzalez@email.cl",
    requester_rut: "12.345.678-9",
    description: "Solicito copia de todos los datos personales que mantienen sobre mi persona, incluyendo historial de compras y datos de contacto.",
    status: "EN_PROCESO",
    received_date: "2026-02-25",
    due_date: "2026-04-08",
    response_date: null,
    assigned_to_id: "user-1",
    assigned_to_name: "Carlos Muñoz",
    response_text: null,
    resolution: null,
    created_at: "2026-02-25T10:00:00Z",
    updated_at: "2026-03-05T14:00:00Z",
    logs: [
      { id: "log-1", request_id: "req-001", action: "Solicitud recibida via formulario web", performed_by_id: "system", notes: null, performed_at: "2026-02-25T10:00:00Z" },
      { id: "log-2", request_id: "req-001", action: "Asignada a Carlos Muñoz", performed_by_id: "user-admin", notes: "DPO asigna caso", performed_at: "2026-02-26T09:00:00Z" },
      { id: "log-3", request_id: "req-001", action: "Verificación de identidad completada", performed_by_id: "user-1", notes: "RUT validado contra registro civil", performed_at: "2026-02-28T11:30:00Z" },
      { id: "log-4", request_id: "req-001", action: "Recopilación de datos en curso", performed_by_id: "user-1", notes: "Consultando áreas de RRHH, Comercial y TI", performed_at: "2026-03-05T14:00:00Z" },
    ],
  },
  {
    id: "req-002",
    organization_id: "org-1",
    request_type: "SUPRESION",
    requester_name: "Pedro Soto Alarcón",
    requester_email: "pedro.soto@email.cl",
    requester_rut: "15.678.901-2",
    description: "Solicito la eliminación completa de mis datos personales de sus sistemas. Ya no soy cliente.",
    status: "RECIBIDA",
    received_date: "2026-03-15",
    due_date: "2026-04-27",
    response_date: null,
    assigned_to_id: null,
    assigned_to_name: undefined,
    response_text: null,
    resolution: null,
    created_at: "2026-03-15T08:00:00Z",
    updated_at: "2026-03-15T08:00:00Z",
    logs: [
      { id: "log-5", request_id: "req-002", action: "Solicitud recibida vía correo electrónico", performed_by_id: "system", notes: null, performed_at: "2026-03-15T08:00:00Z" },
    ],
  },
  {
    id: "req-003",
    organization_id: "org-1",
    request_type: "RECTIFICACION",
    requester_name: "Ana López Valenzuela",
    requester_email: "ana.lopez@email.cl",
    requester_rut: "9.876.543-1",
    description: "Mi dirección y teléfono de contacto están desactualizados. Solicito rectificación con los datos correctos adjuntos.",
    status: "RESPONDIDA",
    received_date: "2026-02-10",
    due_date: "2026-03-24",
    response_date: "2026-03-10",
    assigned_to_id: "user-2",
    assigned_to_name: "Laura Díaz",
    response_text: "Datos actualizados en todos los sistemas. Se adjunta confirmación.",
    resolution: "ACEPTADA",
    created_at: "2026-02-10T14:00:00Z",
    updated_at: "2026-03-10T16:00:00Z",
    logs: [
      { id: "log-6", request_id: "req-003", action: "Solicitud recibida", performed_by_id: "system", notes: null, performed_at: "2026-02-10T14:00:00Z" },
      { id: "log-7", request_id: "req-003", action: "Asignada a Laura Díaz", performed_by_id: "user-admin", notes: null, performed_at: "2026-02-11T09:00:00Z" },
      { id: "log-8", request_id: "req-003", action: "Datos rectificados en CRM y ERP", performed_by_id: "user-2", notes: "Actualizados dirección y teléfono", performed_at: "2026-03-05T10:00:00Z" },
      { id: "log-9", request_id: "req-003", action: "Respuesta enviada al titular", performed_by_id: "user-2", notes: "Notificación por correo electrónico", performed_at: "2026-03-10T16:00:00Z" },
    ],
  },
  {
    id: "req-004",
    organization_id: "org-1",
    request_type: "OPOSICION",
    requester_name: "Roberto Fernández Castillo",
    requester_email: "r.fernandez@email.cl",
    requester_rut: "11.222.333-4",
    description: "Me opongo al tratamiento de mis datos con fines de marketing directo. Solicito que dejen de enviarme comunicaciones comerciales.",
    status: "CERRADA",
    received_date: "2026-01-20",
    due_date: "2026-03-03",
    response_date: "2026-02-15",
    assigned_to_id: "user-1",
    assigned_to_name: "Carlos Muñoz",
    response_text: "Se ha eliminado su perfil de las listas de marketing. No recibirá más comunicaciones comerciales.",
    resolution: "ACEPTADA",
    created_at: "2026-01-20T11:00:00Z",
    updated_at: "2026-02-20T10:00:00Z",
    logs: [
      { id: "log-10", request_id: "req-004", action: "Solicitud recibida", performed_by_id: "system", notes: null, performed_at: "2026-01-20T11:00:00Z" },
      { id: "log-11", request_id: "req-004", action: "Asignada a Carlos Muñoz", performed_by_id: "user-admin", notes: null, performed_at: "2026-01-21T09:00:00Z" },
      { id: "log-12", request_id: "req-004", action: "Baja de listas de marketing ejecutada", performed_by_id: "user-1", notes: "Eliminado de Mailchimp y CRM", performed_at: "2026-02-10T15:00:00Z" },
      { id: "log-13", request_id: "req-004", action: "Respuesta enviada al titular", performed_by_id: "user-1", notes: null, performed_at: "2026-02-15T10:00:00Z" },
      { id: "log-14", request_id: "req-004", action: "Solicitud cerrada", performed_by_id: "user-admin", notes: "Caso resuelto satisfactoriamente", performed_at: "2026-02-20T10:00:00Z" },
    ],
  },
  {
    id: "req-005",
    organization_id: "org-1",
    request_type: "PORTABILIDAD",
    requester_name: "Claudia Vera Pizarro",
    requester_email: "claudia.vera@email.cl",
    requester_rut: "14.555.666-7",
    description: "Solicito portabilidad de mis datos personales en formato estructurado (CSV o JSON) para trasladarlos a otra empresa de servicios.",
    status: "EN_PROCESO",
    received_date: "2026-03-01",
    due_date: "2026-04-14",
    response_date: null,
    assigned_to_id: "user-3",
    assigned_to_name: "Felipe Reyes",
    response_text: null,
    resolution: null,
    created_at: "2026-03-01T09:00:00Z",
    updated_at: "2026-03-12T11:00:00Z",
    logs: [
      { id: "log-15", request_id: "req-005", action: "Solicitud recibida", performed_by_id: "system", notes: null, performed_at: "2026-03-01T09:00:00Z" },
      { id: "log-16", request_id: "req-005", action: "Asignada a Felipe Reyes", performed_by_id: "user-admin", notes: null, performed_at: "2026-03-02T09:00:00Z" },
      { id: "log-17", request_id: "req-005", action: "Extracción de datos iniciada", performed_by_id: "user-3", notes: "Generando exportación desde BD principal", performed_at: "2026-03-12T11:00:00Z" },
    ],
  },
  {
    id: "req-006",
    organization_id: "org-1",
    request_type: "BLOQUEO",
    requester_name: "Jorge Muñoz Tapia",
    requester_email: "jorge.munoz@email.cl",
    requester_rut: "8.901.234-5",
    description: "Solicito el bloqueo temporal del tratamiento de mis datos mientras se resuelve un reclamo ante la Agencia de Protección de Datos.",
    status: "EN_PROCESO",
    received_date: "2026-03-10",
    due_date: "2026-04-22",
    response_date: null,
    assigned_to_id: "user-2",
    assigned_to_name: "Laura Díaz",
    response_text: null,
    resolution: null,
    created_at: "2026-03-10T16:00:00Z",
    updated_at: "2026-03-14T09:00:00Z",
    logs: [
      { id: "log-18", request_id: "req-006", action: "Solicitud recibida", performed_by_id: "system", notes: null, performed_at: "2026-03-10T16:00:00Z" },
      { id: "log-19", request_id: "req-006", action: "Asignada a Laura Díaz", performed_by_id: "user-admin", notes: "Caso prioritario - reclamo ante Agencia", performed_at: "2026-03-11T09:00:00Z" },
      { id: "log-20", request_id: "req-006", action: "Bloqueo temporal aplicado en sistemas", performed_by_id: "user-2", notes: "Datos marcados como bloqueados en CRM y ERP", performed_at: "2026-03-14T09:00:00Z" },
    ],
  },
  {
    id: "req-007",
    organization_id: "org-1",
    request_type: "ACCESO",
    requester_name: "Isabel Torres Morales",
    requester_email: "isabel.torres@email.cl",
    requester_rut: "16.789.012-3",
    description: "Quiero saber qué datos personales míos tienen almacenados y con qué finalidad los tratan.",
    status: "VENCIDA",
    received_date: "2026-01-10",
    due_date: "2026-02-20",
    response_date: null,
    assigned_to_id: "user-1",
    assigned_to_name: "Carlos Muñoz",
    response_text: null,
    resolution: null,
    created_at: "2026-01-10T12:00:00Z",
    updated_at: "2026-02-21T00:00:00Z",
    logs: [
      { id: "log-21", request_id: "req-007", action: "Solicitud recibida", performed_by_id: "system", notes: null, performed_at: "2026-01-10T12:00:00Z" },
      { id: "log-22", request_id: "req-007", action: "Asignada a Carlos Muñoz", performed_by_id: "user-admin", notes: null, performed_at: "2026-01-12T09:00:00Z" },
      { id: "log-23", request_id: "req-007", action: "Solicitud marcada como vencida", performed_by_id: "system", notes: "Plazo legal de 30 días hábiles excedido sin respuesta", performed_at: "2026-02-21T00:00:00Z" },
    ],
  },
]

// -- Main Page Component --

export default function ARCOPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<RequestType | "TODAS">("TODAS")
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "TODOS">("TODOS")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [showNewForm, setShowNewForm] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)

  // New request form state
  const [newForm, setNewForm] = useState({
    request_type: "ACCESO" as RequestType,
    requester_name: "",
    requester_email: "",
    requester_rut: "",
    description: "",
  })

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return mockRequests.filter((req) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (
          !req.requester_name.toLowerCase().includes(q) &&
          !req.requester_email.toLowerCase().includes(q) &&
          !req.id.toLowerCase().includes(q)
        )
          return false
      }
      if (typeFilter !== "TODAS" && req.request_type !== typeFilter) return false
      if (statusFilter !== "TODOS" && req.status !== statusFilter) return false
      if (dateFrom && req.received_date < dateFrom) return false
      if (dateTo && req.received_date > dateTo) return false
      return true
    })
  }, [searchQuery, typeFilter, statusFilter, dateFrom, dateTo])

  // Stats
  const stats = useMemo(() => {
    const total = mockRequests.length
    const byType = (Object.keys(REQUEST_TYPE_LABELS) as RequestType[]).map((t) => ({
      type: t,
      label: REQUEST_TYPE_LABELS[t],
      count: mockRequests.filter((r) => r.request_type === t).length,
    }))
    const byStatus = (Object.keys(STATUS_LABELS) as RequestStatus[]).map((s) => ({
      status: s,
      label: STATUS_LABELS[s],
      count: mockRequests.filter((r) => r.status === s).length,
    }))
    const overdue = mockRequests.filter((r) => r.status === "VENCIDA").length
    const responded = mockRequests.filter((r) => r.response_date)
    const avgDays =
      responded.length > 0
        ? Math.round(
            responded.reduce((sum, r) => {
              const start = new Date(r.received_date).getTime()
              const end = new Date(r.response_date!).getTime()
              return sum + (end - start) / (1000 * 60 * 60 * 24)
            }, 0) / responded.length
          )
        : 0
    return { total, byType, byStatus, overdue, avgDays }
  }, [])

  const selectedReq = selectedRequest ? mockRequests.find((r) => r.id === selectedRequest) : null

  // Donut chart data
  const donutSegments = useMemo(() => {
    const colors = ["#3b82f6", "#a855f7", "#ef4444", "#f97316", "#14b8a6", "#6b7280"]
    const total = stats.total || 1
    let cumulative = 0
    return stats.byType.map((item, i) => {
      const pct = (item.count / total) * 100
      const offset = cumulative
      cumulative += pct
      return { ...item, pct, offset, color: colors[i] }
    })
  }, [stats])

  const handleSubmitNewRequest = () => {
    // In production this would call Supabase
    alert(`Solicitud ${newForm.request_type} creada para ${newForm.requester_name}`)
    setShowNewForm(false)
    setNewForm({ request_type: "ACCESO", requester_name: "", requester_email: "", requester_rut: "", description: "" })
  }

  // -- Detail View --
  if (selectedReq) {
    return (
      <AppShell>
        <Header
          title="Detalle Solicitud ARCO-POB"
          subtitle={`${REQUEST_TYPE_LABELS[selectedReq.request_type]} - ${selectedReq.requester_name}`}
        />
        <div className="p-6 space-y-6">
          <Button variant="outline" onClick={() => setSelectedRequest(null)} className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Volver al listado
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Info principal */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Información de la Solicitud
                  <Badge className={REQUEST_TYPE_COLORS[selectedReq.request_type]}>
                    {REQUEST_TYPE_LABELS[selectedReq.request_type]}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">ID Solicitud</p>
                    <p className="text-sm font-medium">{selectedReq.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Estado</p>
                    <Badge className={getStatusColor(selectedReq.status)}>{STATUS_LABELS[selectedReq.status]}</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Nombre del Titular</p>
                    <p className="text-sm font-medium">{selectedReq.requester_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">RUT</p>
                    <p className="text-sm font-medium">{selectedReq.requester_rut || "No informado"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Correo Electrónico</p>
                    <p className="text-sm font-medium flex items-center gap-1">
                      <Mail className="h-3 w-3 text-gray-400" />
                      {selectedReq.requester_email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Asignado a</p>
                    <p className="text-sm font-medium">{selectedReq.assigned_to_name || "Sin asignar"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Fecha Recepción</p>
                    <p className="text-sm font-medium">{formatDate(selectedReq.received_date)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Fecha Límite (30 días hábiles)</p>
                    <p className="text-sm font-medium">{formatDate(selectedReq.due_date)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Descripción</p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedReq.description}</p>
                </div>
                {selectedReq.response_text && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Respuesta</p>
                    <p className="text-sm text-gray-700 bg-green-50 p-3 rounded-lg border border-green-200">
                      {selectedReq.response_text}
                    </p>
                  </div>
                )}
                {selectedReq.resolution && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Resolución</p>
                    <Badge
                      variant={
                        selectedReq.resolution === "ACEPTADA"
                          ? "success"
                          : selectedReq.resolution === "RECHAZADA"
                          ? "destructive"
                          : "warning"
                      }
                    >
                      {RESOLUTION_LABELS[selectedReq.resolution]}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* SLA + resumen */}
            <div className="space-y-6">
              <Card className="p-6">
                <div className="text-center space-y-3">
                  <p className="text-sm font-medium text-gray-500">Plazo Legal (SLA)</p>
                  <div className="text-4xl font-bold">
                    <SLAIndicator dueDate={selectedReq.due_date} status={selectedReq.status} />
                  </div>
                  <p className="text-xs text-gray-400">
                    Ley 21.719 - Art. 11: 30 días hábiles para responder
                  </p>
                  {selectedReq.response_date && (
                    <p className="text-xs text-green-600">
                      Respondida el {formatDate(selectedReq.response_date)}
                    </p>
                  )}
                </div>
              </Card>
              <Card className="p-6">
                <p className="text-sm font-medium text-gray-500 mb-3">Resumen</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tipo</span>
                    <span className="font-medium">{REQUEST_TYPE_LABELS[selectedReq.request_type]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Acciones registradas</span>
                    <span className="font-medium">{selectedReq.logs?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Días transcurridos</span>
                    <span className="font-medium">
                      {Math.ceil(
                        (new Date().getTime() - new Date(selectedReq.received_date).getTime()) / (1000 * 60 * 60 * 24)
                      )}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Línea de Tiempo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                <div className="space-y-6">
                  {(selectedReq.logs || []).map((log, idx) => (
                    <div key={log.id} className="relative flex gap-4 pl-10">
                      <div
                        className={`absolute left-2.5 w-3 h-3 rounded-full border-2 border-white ${
                          idx === (selectedReq.logs?.length || 0) - 1 ? "bg-blue-500" : "bg-gray-400"
                        }`}
                      />
                      <div className="flex-1 bg-gray-50 rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium text-gray-900">{log.action}</p>
                          <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                            {formatDate(log.performed_at)}
                          </span>
                        </div>
                        {log.notes && <p className="text-xs text-gray-500 mt-1">{log.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    )
  }

  // -- Main List View --
  return (
    <AppShell>
      <Header
        title="Solicitudes ARCO-POB"
        subtitle="Gestión de derechos de titulares de datos - Ley 21.719 (Art. 5-11)"
      />
      <div className="p-6 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Solicitudes"
            value={stats.total}
            icon={FileText}
            iconColor="text-blue-600 bg-blue-50"
          />
          <StatCard
            title="En Proceso"
            value={stats.byStatus.find((s) => s.status === "EN_PROCESO")?.count || 0}
            icon={Clock}
            iconColor="text-blue-600 bg-blue-50"
          />
          <StatCard
            title="Respondidas"
            value={stats.byStatus.find((s) => s.status === "RESPONDIDA")?.count || 0}
            icon={CheckCircle2}
            iconColor="text-green-600 bg-green-50"
          />
          <StatCard
            title="Vencidas"
            value={stats.overdue}
            icon={AlertTriangle}
            iconColor="text-red-600 bg-red-50"
          />
          <StatCard
            title="Tiempo Promedio"
            value={`${stats.avgDays} días`}
            description="calendario"
            icon={Clock}
            iconColor="text-indigo-600 bg-indigo-50"
          />
        </div>

        {/* Breakdown cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* By type - donut */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <UserCheck className="h-5 w-5 text-purple-600" />
                Solicitudes por Tipo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative flex-shrink-0">
                  <svg width="140" height="140" viewBox="0 0 140 140">
                    {donutSegments.map((seg) => {
                      const radius = 55
                      const circumference = 2 * Math.PI * radius
                      const dashLength = (seg.pct / 100) * circumference
                      const dashOffset = -((seg.offset / 100) * circumference)
                      return (
                        <circle
                          key={seg.type}
                          cx="70"
                          cy="70"
                          r={radius}
                          fill="none"
                          stroke={seg.color}
                          strokeWidth="20"
                          strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                          strokeDashoffset={dashOffset}
                          className="-rotate-90 origin-center"
                        />
                      )
                    })}
                    <text x="70" y="66" textAnchor="middle" className="text-2xl font-bold fill-gray-900">
                      {stats.total}
                    </text>
                    <text x="70" y="82" textAnchor="middle" className="text-xs fill-gray-400">
                      total
                    </text>
                  </svg>
                </div>
                <div className="flex-1 space-y-2">
                  {donutSegments.map((seg) => (
                    <div key={seg.type} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
                      <span className="text-gray-600 flex-1">{seg.label}</span>
                      <span className="font-semibold text-gray-900">{seg.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* By status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Filter className="h-5 w-5 text-orange-600" />
                Solicitudes por Estado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.byStatus.map((item) => {
                  const pct = stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0
                  return (
                    <div key={item.status} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(item.status)}>{item.label}</Badge>
                        </div>
                        <span className="text-gray-500">
                          {item.count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            item.status === "VENCIDA"
                              ? "bg-red-500"
                              : item.status === "RESPONDIDA" || item.status === "CERRADA"
                              ? "bg-green-500"
                              : item.status === "EN_PROCESO"
                              ? "bg-blue-500"
                              : "bg-yellow-500"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter bar */}
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, email o ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as RequestType | "TODAS")}
              className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="TODAS">Todos los tipos</option>
              {(Object.keys(REQUEST_TYPE_LABELS) as RequestType[]).map((t) => (
                <option key={t} value={t}>
                  {REQUEST_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as RequestStatus | "TODOS")}
              className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="TODOS">Todos los estados</option>
              {(Object.keys(STATUS_LABELS) as RequestStatus[]).map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-36"
                placeholder="Desde"
              />
              <span className="text-gray-400">-</span>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-36"
                placeholder="Hasta"
              />
            </div>
            <Button onClick={() => setShowNewForm(true)} className="flex items-center gap-2 ml-auto">
              <Plus className="h-4 w-4" />
              Nueva Solicitud
            </Button>
          </div>
        </Card>

        {/* Requests table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Titular</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Tipo</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Fecha Recepción</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Fecha Límite</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">SLA</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Estado</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Asignado</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Resolución</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase px-4 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{req.requester_name}</p>
                          <p className="text-xs text-gray-400">{req.requester_email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={REQUEST_TYPE_COLORS[req.request_type]}>
                          {REQUEST_TYPE_LABELS[req.request_type]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(req.received_date)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(req.due_date)}</td>
                      <td className="px-4 py-3">
                        <SLAIndicator dueDate={req.due_date} status={req.status} />
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={getStatusColor(req.status)}>{STATUS_LABELS[req.status]}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{req.assigned_to_name || "Sin asignar"}</td>
                      <td className="px-4 py-3">
                        {req.resolution ? (
                          <Badge
                            variant={
                              req.resolution === "ACEPTADA"
                                ? "success"
                                : req.resolution === "RECHAZADA"
                                ? "destructive"
                                : "warning"
                            }
                          >
                            {RESOLUTION_LABELS[req.resolution]}
                          </Badge>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedRequest(req.id)}
                          className="flex items-center gap-1 ml-auto"
                        >
                          <Eye className="h-4 w-4" />
                          Ver
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredRequests.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-12 text-center text-sm text-gray-400">
                        No se encontraron solicitudes con los filtros seleccionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Request Modal */}
      {showNewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-blue-600" />
                  Nueva Solicitud ARCO-POB
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowNewForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Solicitud *</label>
                <select
                  value={newForm.request_type}
                  onChange={(e) => setNewForm({ ...newForm, request_type: e.target.value as RequestType })}
                  className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {(Object.keys(REQUEST_TYPE_LABELS) as RequestType[]).map((t) => (
                    <option key={t} value={t}>
                      {REQUEST_TYPE_LABELS[t]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Titular *</label>
                <Input
                  value={newForm.requester_name}
                  onChange={(e) => setNewForm({ ...newForm, requester_name: e.target.value })}
                  placeholder="Nombre completo del solicitante"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico *</label>
                <Input
                  type="email"
                  value={newForm.requester_email}
                  onChange={(e) => setNewForm({ ...newForm, requester_email: e.target.value })}
                  placeholder="correo@ejemplo.cl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RUT</label>
                <Input
                  value={newForm.requester_rut}
                  onChange={(e) => setNewForm({ ...newForm, requester_rut: e.target.value })}
                  placeholder="12.345.678-9"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción de la Solicitud *</label>
                <Textarea
                  value={newForm.description}
                  onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                  placeholder="Detalle de lo que solicita el titular de datos..."
                  rows={4}
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-700">
                  <strong>Plazo legal:</strong> Según el Art. 11 de la Ley 21.719, el responsable debe responder dentro de
                  30 días hábiles contados desde la recepción de la solicitud. La fecha límite se calculará
                  automáticamente.
                </p>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <Button variant="outline" onClick={() => setShowNewForm(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmitNewRequest}
                  disabled={!newForm.requester_name || !newForm.requester_email || !newForm.description}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Crear Solicitud
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AppShell>
  )
}

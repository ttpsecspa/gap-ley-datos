"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/ui/stat-card"
import { getRiskColor, getStatusColor, formatDate } from "@/lib/utils"
import {
  ShieldAlert,
  Plus,
  AlertTriangle,
  Clock,
  Bell,
  Users,
  CheckCircle2,
  XCircle,
  FileWarning,
  Calendar,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

// --- Types ---

interface TimelineEvent {
  id: string
  event_description: string
  event_date: string
  recorded_by: string
  evidence_url?: string
}

interface CorrectiveMeasure {
  id: string
  description: string
  responsible: string
  due_date: string
  completed: boolean
}

interface Breach {
  id: string
  description: string
  severity: "BAJA" | "MEDIA" | "ALTA" | "CRITICA"
  status: "DETECTADA" | "INVESTIGANDO" | "NOTIFICADA" | "RESUELTA"
  detected_date: string
  affected_titulars_count: number
  affected_data_types: string[]
  notified_agency: boolean
  notified_titulars: boolean
  responsible_user: string
  resolution_date?: string
  timeline: TimelineEvent[]
  corrective_measures: CorrectiveMeasure[]
}

// --- Mock Data ---

const mockBreaches: Breach[] = [
  {
    id: "BR-001",
    description: "Acceso no autorizado a base de datos de clientes mediante credenciales comprometidas. Se detectaron consultas masivas a registros de datos personales desde una IP externa.",
    severity: "CRITICA",
    status: "INVESTIGANDO",
    detected_date: "2026-03-18",
    affected_titulars_count: 4520,
    affected_data_types: ["RUT", "Nombre completo", "Correo electrónico", "Teléfono", "Dirección"],
    notified_agency: true,
    notified_titulars: false,
    responsible_user: "Carlos Méndez",
    timeline: [
      { id: "t1", event_description: "Detección de actividad anómala en logs del servidor de BD", event_date: "2026-03-18T08:30:00", recorded_by: "Sistema SIEM", evidence_url: "/evidencias/BR-001/alert-log.pdf" },
      { id: "t2", event_description: "Confirmación de acceso no autorizado. Credenciales de usuario admin comprometidas.", event_date: "2026-03-18T10:15:00", recorded_by: "Carlos Méndez", evidence_url: "/evidencias/BR-001/forensic-report.pdf" },
      { id: "t3", event_description: "Bloqueo de IP atacante y cambio de credenciales comprometidas", event_date: "2026-03-18T11:00:00", recorded_by: "Equipo TI" },
      { id: "t4", event_description: "Notificación enviada a Agencia de Protección de Datos Personales", event_date: "2026-03-18T14:00:00", recorded_by: "María López (DPO)", evidence_url: "/evidencias/BR-001/notificacion-agencia.pdf" },
      { id: "t5", event_description: "Inicio de investigación forense detallada", event_date: "2026-03-19T09:00:00", recorded_by: "Carlos Méndez" },
    ],
    corrective_measures: [
      { id: "cm1", description: "Implementar autenticación multifactor (MFA) para todos los accesos a BD", responsible: "Equipo TI", due_date: "2026-03-25", completed: false },
      { id: "cm2", description: "Revisión y rotación completa de credenciales de servicio", responsible: "Equipo TI", due_date: "2026-03-22", completed: true },
      { id: "cm3", description: "Notificar a titulares afectados con recomendaciones de seguridad", responsible: "María López (DPO)", due_date: "2026-03-23", completed: false },
    ],
  },
  {
    id: "BR-002",
    description: "Envío masivo de correos con datos personales de pacientes a destinatarios incorrectos por error en el sistema de mailing automático.",
    severity: "ALTA",
    status: "NOTIFICADA",
    detected_date: "2026-03-10",
    affected_titulars_count: 230,
    affected_data_types: ["Nombre completo", "RUT", "Datos de salud"],
    notified_agency: true,
    notified_titulars: true,
    responsible_user: "Ana Rodríguez",
    timeline: [
      { id: "t1", event_description: "Recepción de reclamos de usuarios que recibieron datos ajenos", event_date: "2026-03-10T11:00:00", recorded_by: "Mesa de Ayuda" },
      { id: "t2", event_description: "Identificación de error en plantilla de correo masivo", event_date: "2026-03-10T14:30:00", recorded_by: "Ana Rodríguez", evidence_url: "/evidencias/BR-002/error-template.png" },
      { id: "t3", event_description: "Detención del envío y recall de correos donde fue posible", event_date: "2026-03-10T15:00:00", recorded_by: "Equipo TI" },
      { id: "t4", event_description: "Notificación a Agencia dentro de plazo legal", event_date: "2026-03-11T09:00:00", recorded_by: "María López (DPO)" },
      { id: "t5", event_description: "Notificación a titulares afectados vía correo y teléfono", event_date: "2026-03-12T10:00:00", recorded_by: "Ana Rodríguez" },
    ],
    corrective_measures: [
      { id: "cm1", description: "Implementar revisión de destinatarios previo a envíos masivos", responsible: "Equipo Desarrollo", due_date: "2026-03-20", completed: true },
      { id: "cm2", description: "Agregar paso de validación con aprobador antes de envío", responsible: "Ana Rodríguez", due_date: "2026-03-25", completed: false },
    ],
  },
  {
    id: "BR-003",
    description: "Pérdida de laptop corporativo con base de datos local de proveedores sin cifrado de disco.",
    severity: "MEDIA",
    status: "RESUELTA",
    detected_date: "2026-02-20",
    affected_titulars_count: 85,
    affected_data_types: ["Nombre", "RUT", "Cuenta bancaria", "Correo electrónico"],
    notified_agency: true,
    notified_titulars: true,
    responsible_user: "Pedro Soto",
    resolution_date: "2026-03-05",
    timeline: [
      { id: "t1", event_description: "Reporte de pérdida de equipo corporativo", event_date: "2026-02-20T09:00:00", recorded_by: "Pedro Soto" },
      { id: "t2", event_description: "Identificación de datos personales almacenados en disco local", event_date: "2026-02-20T14:00:00", recorded_by: "Equipo TI" },
      { id: "t3", event_description: "Borrado remoto del equipo ejecutado", event_date: "2026-02-20T15:30:00", recorded_by: "Equipo TI", evidence_url: "/evidencias/BR-003/wipe-confirmation.pdf" },
      { id: "t4", event_description: "Notificación a Agencia y titulares completada", event_date: "2026-02-21T10:00:00", recorded_by: "María López (DPO)" },
      { id: "t5", event_description: "Caso cerrado - Medidas correctivas implementadas", event_date: "2026-03-05T16:00:00", recorded_by: "María López (DPO)" },
    ],
    corrective_measures: [
      { id: "cm1", description: "Cifrado obligatorio de discos en todos los equipos corporativos", responsible: "Equipo TI", due_date: "2026-03-15", completed: true },
      { id: "cm2", description: "Política de prohibición de almacenamiento local de datos personales", responsible: "María López (DPO)", due_date: "2026-03-10", completed: true },
    ],
  },
  {
    id: "BR-004",
    description: "Vulnerabilidad en formulario web permitió inyección SQL y posible acceso a datos de contacto de usuarios registrados.",
    severity: "BAJA",
    status: "DETECTADA",
    detected_date: "2026-03-19",
    affected_titulars_count: 0,
    affected_data_types: ["Correo electrónico", "Nombre de usuario"],
    notified_agency: false,
    notified_titulars: false,
    responsible_user: "Luis Fernández",
    timeline: [
      { id: "t1", event_description: "Reporte de vulnerabilidad detectada en test de penetración", event_date: "2026-03-19T16:00:00", recorded_by: "Luis Fernández", evidence_url: "/evidencias/BR-004/pentest-report.pdf" },
    ],
    corrective_measures: [],
  },
]

// --- Helpers ---

const severityLabel = (s: string) => {
  switch (s) {
    case "CRITICA": return "Crítica"
    case "ALTA": return "Alta"
    case "MEDIA": return "Media"
    case "BAJA": return "Baja"
    default: return s
  }
}

const severityVariant = (s: string): "destructive" | "warning" | "default" | "secondary" => {
  switch (s) {
    case "CRITICA": return "destructive"
    case "ALTA": return "warning"
    case "MEDIA": return "default"
    case "BAJA": return "secondary"
    default: return "secondary"
  }
}

const statusLabel = (s: string) => {
  switch (s) {
    case "DETECTADA": return "Detectada"
    case "INVESTIGANDO": return "Investigando"
    case "NOTIFICADA": return "Notificada"
    case "RESUELTA": return "Resuelta"
    default: return s
  }
}

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString("es-CL", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const calcAvgResolutionDays = (breaches: Breach[]): number => {
  const resolved = breaches.filter((b) => b.resolution_date)
  if (resolved.length === 0) return 0
  const totalDays = resolved.reduce((sum, b) => {
    const start = new Date(b.detected_date).getTime()
    const end = new Date(b.resolution_date!).getTime()
    return sum + (end - start) / (1000 * 60 * 60 * 24)
  }, 0)
  return Math.round(totalDays / resolved.length)
}

// --- Component ---

type View = "list" | "detail" | "new"

export default function BrechasPage() {
  const [breaches] = useState<Breach[]>(mockBreaches)
  const [currentView, setCurrentView] = useState<View>("list")
  const [selectedBreach, setSelectedBreach] = useState<Breach | null>(null)
  const [expandedTimeline, setExpandedTimeline] = useState(true)
  const [expandedMeasures, setExpandedMeasures] = useState(true)

  // New breach form state
  const [newBreach, setNewBreach] = useState({
    detected_date: "",
    description: "",
    severity: "MEDIA" as Breach["severity"],
    affected_data_types: "",
    affected_titulars_count: "",
    responsible_user: "",
  })

  // Stats
  const totalBreaches = breaches.length
  const bySeverity = {
    BAJA: breaches.filter((b) => b.severity === "BAJA").length,
    MEDIA: breaches.filter((b) => b.severity === "MEDIA").length,
    ALTA: breaches.filter((b) => b.severity === "ALTA").length,
    CRITICA: breaches.filter((b) => b.severity === "CRITICA").length,
  }
  const activeCount = breaches.filter((b) => b.status !== "RESUELTA").length
  const avgResolution = calcAvgResolutionDays(breaches)

  const openDetail = (breach: Breach) => {
    setSelectedBreach(breach)
    setCurrentView("detail")
  }

  const handleNewBreachSubmit = () => {
    alert("Brecha registrada exitosamente (mock). En producción, se guardaría en Supabase.")
    setNewBreach({ detected_date: "", description: "", severity: "MEDIA", affected_data_types: "", affected_titulars_count: "", responsible_user: "" })
    setCurrentView("list")
  }

  // --- Render: Detail View ---
  if (currentView === "detail" && selectedBreach) {
    const breach = selectedBreach
    const hoursToNotify = breach.detected_date
      ? Math.round((Date.now() - new Date(breach.detected_date).getTime()) / (1000 * 60 * 60))
      : 0
    const agencyDeadlinePassed = hoursToNotify > 72 && !breach.notified_agency

    return (
      <AppShell>
        <Header
          title={`Brecha ${breach.id}`}
          subtitle={breach.description.substring(0, 80) + "..."}
          actions={
            <Button variant="outline" onClick={() => setCurrentView("list")}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Volver
            </Button>
          }
        />
        <div className="p-6 space-y-6">
          {/* Agency notification alert */}
          {!breach.notified_agency && (
            <div className={`flex items-start gap-3 p-4 rounded-lg border-2 ${agencyDeadlinePassed ? "bg-red-50 border-red-400" : "bg-amber-50 border-amber-400"}`}>
              <Bell className={`h-6 w-6 mt-0.5 flex-shrink-0 ${agencyDeadlinePassed ? "text-red-600" : "text-amber-600"}`} />
              <div>
                <p className={`font-bold ${agencyDeadlinePassed ? "text-red-800" : "text-amber-800"}`}>
                  {agencyDeadlinePassed
                    ? "PLAZO VENCIDO - Notificación a Agencia de Protección de Datos"
                    : "ACCIÓN REQUERIDA - Notificar a Agencia de Protección de Datos"}
                </p>
                <p className={`text-sm mt-1 ${agencyDeadlinePassed ? "text-red-700" : "text-amber-700"}`}>
                  La Ley 21.719 exige notificar a la Agencia de Protección de Datos Personales
                  dentro de las primeras 72 horas desde la detección de la brecha.
                  Han transcurrido <strong>{hoursToNotify} horas</strong> desde la detección.
                </p>
              </div>
            </div>
          )}

          {/* Breach info summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Calendar className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Fecha Detección</p>
                  <p className="text-sm font-semibold">{formatDate(breach.detected_date)}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getRiskColor(breach.severity === "CRITICA" ? "CRITICO" : breach.severity === "ALTA" ? "ALTO" : breach.severity === "MEDIA" ? "MEDIO" : "BAJO")}`}>
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Severidad</p>
                  <p className="text-sm font-semibold">{severityLabel(breach.severity)}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getStatusColor(breach.status)}`}>
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Estado</p>
                  <p className="text-sm font-semibold">{statusLabel(breach.status)}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Titulares Afectados</p>
                  <p className="text-sm font-semibold">{breach.affected_titulars_count.toLocaleString("es-CL")}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Description and data types */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileWarning className="h-5 w-5 text-orange-500" />
                Descripción de la Brecha
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-700 leading-relaxed">{breach.description}</p>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Tipos de datos afectados:</p>
                <div className="flex flex-wrap gap-2">
                  {breach.affected_data_types.map((dt) => (
                    <Badge key={dt} variant="outline">{dt}</Badge>
                  ))}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Responsable: <span className="font-medium text-gray-700">{breach.responsible_user}</span>
              </div>
            </CardContent>
          </Card>

          {/* Notification Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-5 w-5 text-blue-600" />
                Checklist de Notificaciones (Ley 21.719)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Agency notification */}
                <div className={`flex items-start gap-4 p-4 rounded-lg border ${breach.notified_agency ? "bg-green-50 border-green-200" : agencyDeadlinePassed ? "bg-red-50 border-red-300" : "bg-yellow-50 border-yellow-200"}`}>
                  <div className="flex-shrink-0 mt-0.5">
                    {breach.notified_agency ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircle className={`h-6 w-6 ${agencyDeadlinePassed ? "text-red-600" : "text-yellow-600"}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900">
                      Notificación a Agencia de Protección de Datos Personales
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Obligatoria dentro de 72 horas desde la detección de la brecha.
                      Debe incluir naturaleza de la brecha, datos afectados, medidas adoptadas y contacto del DPO.
                    </p>
                    {breach.notified_agency ? (
                      <Badge variant="success" className="mt-2">Notificada</Badge>
                    ) : (
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant={agencyDeadlinePassed ? "destructive" : "warning"}>
                          {agencyDeadlinePassed ? "Plazo vencido" : "Pendiente"}
                        </Badge>
                        <Button size="sm" variant="default" className="h-7 text-xs">
                          Registrar Notificación
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Titulars notification */}
                <div className={`flex items-start gap-4 p-4 rounded-lg border ${breach.notified_titulars ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
                  <div className="flex-shrink-0 mt-0.5">
                    {breach.notified_titulars ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircle className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900">
                      Notificación a Titulares Afectados
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Requerida cuando la brecha pueda afectar significativamente los derechos y libertades
                      de los titulares. Debe comunicarse en lenguaje claro y sencillo.
                    </p>
                    {breach.notified_titulars ? (
                      <Badge variant="success" className="mt-2">Notificados ({breach.affected_titulars_count.toLocaleString("es-CL")} titulares)</Badge>
                    ) : (
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="secondary">Pendiente</Badge>
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          Registrar Notificación
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Línea de Tiempo
                </CardTitle>
                <button
                  onClick={() => setExpandedTimeline(!expandedTimeline)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  {expandedTimeline ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
              </div>
            </CardHeader>
            {expandedTimeline && (
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                  <div className="space-y-6">
                    {breach.timeline.map((event, idx) => (
                      <div key={event.id} className="relative flex gap-4 pl-10">
                        <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 border-white ${idx === 0 ? "bg-blue-500" : "bg-gray-300"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{event.event_description}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-1">
                            <span className="text-xs text-gray-500">{formatDateTime(event.event_date)}</span>
                            <span className="text-xs text-gray-400">por {event.recorded_by}</span>
                            {event.evidence_url && (
                              <a href={event.evidence_url} className="text-xs text-blue-600 hover:underline">
                                Ver evidencia
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Agregar Evento
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Corrective Measures */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Medidas Correctivas
                </CardTitle>
                <button
                  onClick={() => setExpandedMeasures(!expandedMeasures)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  {expandedMeasures ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
              </div>
            </CardHeader>
            {expandedMeasures && (
              <CardContent>
                {breach.corrective_measures.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No se han registrado medidas correctivas aún.</p>
                ) : (
                  <div className="space-y-3">
                    {breach.corrective_measures.map((measure) => (
                      <div
                        key={measure.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border ${measure.completed ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {measure.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${measure.completed ? "text-gray-500 line-through" : "text-gray-900"}`}>
                            {measure.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 mt-1">
                            <span className="text-xs text-gray-500">Responsable: {measure.responsible}</span>
                            <span className="text-xs text-gray-400">Plazo: {formatDate(measure.due_date)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Agregar Medida Correctiva
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </AppShell>
    )
  }

  // --- Render: New Breach Form ---
  if (currentView === "new") {
    return (
      <AppShell>
        <Header
          title="Registrar Nueva Brecha"
          subtitle="Complete la información del incidente de seguridad"
          actions={
            <Button variant="outline" onClick={() => setCurrentView("list")}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Volver
            </Button>
          }
        />
        <div className="p-6 max-w-3xl">
          {/* Urgent reminder */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border-2 border-amber-400 mb-6">
            <Bell className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm text-amber-800">Recordatorio Legal</p>
              <p className="text-xs text-amber-700 mt-1">
                Según la Ley 21.719, la organización debe notificar a la Agencia de Protección de Datos Personales
                dentro de las <strong>72 horas</strong> siguientes a la detección de una brecha que afecte datos personales.
                Registre la brecha lo antes posible para iniciar el conteo de plazos.
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldAlert className="h-5 w-5 text-red-500" />
                Información del Incidente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha de detección *</label>
                    <Input
                      type="datetime-local"
                      value={newBreach.detected_date}
                      onChange={(e) => setNewBreach({ ...newBreach, detected_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Severidad *</label>
                    <select
                      className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newBreach.severity}
                      onChange={(e) => setNewBreach({ ...newBreach, severity: e.target.value as Breach["severity"] })}
                    >
                      <option value="BAJA">Baja</option>
                      <option value="MEDIA">Media</option>
                      <option value="ALTA">Alta</option>
                      <option value="CRITICA">Crítica</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción del incidente *</label>
                  <Textarea
                    placeholder="Describa el incidente de seguridad, cómo se detectó, y el alcance conocido..."
                    rows={4}
                    value={newBreach.description}
                    onChange={(e) => setNewBreach({ ...newBreach, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipos de datos afectados *</label>
                  <Input
                    placeholder="Ej: RUT, Nombre, Correo, Datos de salud (separados por coma)"
                    value={newBreach.affected_data_types}
                    onChange={(e) => setNewBreach({ ...newBreach, affected_data_types: e.target.value })}
                  />
                  <p className="text-xs text-gray-400 mt-1">Separe cada tipo de dato con una coma</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Titulares afectados (estimado)</label>
                    <Input
                      type="number"
                      placeholder="Número de personas afectadas"
                      value={newBreach.affected_titulars_count}
                      onChange={(e) => setNewBreach({ ...newBreach, affected_titulars_count: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Responsable del seguimiento *</label>
                    <Input
                      placeholder="Nombre del responsable"
                      value={newBreach.responsible_user}
                      onChange={(e) => setNewBreach({ ...newBreach, responsible_user: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button onClick={handleNewBreachSubmit}>
                    <ShieldAlert className="h-4 w-4 mr-2" />
                    Registrar Brecha
                  </Button>
                  <Button variant="outline" onClick={() => setCurrentView("list")}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    )
  }

  // --- Render: List View (default) ---
  return (
    <AppShell>
      <Header
        title="Brechas de Seguridad"
        subtitle="Gestión de incidentes de seguridad - Ley 21.719"
        actions={
          <Button onClick={() => setCurrentView("new")}>
            <Plus className="h-4 w-4 mr-2" />
            Reportar Brecha
          </Button>
        }
      />
      <div className="p-6 space-y-6">
        {/* Agency notification banner for any unnotified breach */}
        {breaches.some((b) => !b.notified_agency && b.status !== "RESUELTA") && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border-2 border-red-400">
            <Bell className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0 animate-pulse" />
            <div>
              <p className="font-bold text-red-800">Brechas sin notificar a la Agencia de Protección de Datos</p>
              <p className="text-sm text-red-700 mt-1">
                Existen brechas activas que aún no han sido notificadas a la Agencia. La Ley 21.719 exige
                notificación dentro de 72 horas. Revise los incidentes pendientes de inmediato.
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <StatCard
            title="Total Brechas"
            value={totalBreaches}
            icon={ShieldAlert}
            iconColor="text-gray-600 bg-gray-100"
          />
          <StatCard
            title="Críticas"
            value={bySeverity.CRITICA}
            icon={AlertTriangle}
            iconColor="text-red-600 bg-red-50"
          />
          <StatCard
            title="Altas"
            value={bySeverity.ALTA}
            icon={AlertTriangle}
            iconColor="text-orange-600 bg-orange-50"
          />
          <StatCard
            title="Medias"
            value={bySeverity.MEDIA}
            icon={FileWarning}
            iconColor="text-yellow-600 bg-yellow-50"
          />
          <StatCard
            title="Bajas"
            value={bySeverity.BAJA}
            icon={FileWarning}
            iconColor="text-green-600 bg-green-50"
          />
          <StatCard
            title="Activas"
            value={activeCount}
            icon={Clock}
            iconColor="text-blue-600 bg-blue-50"
            description="sin resolver"
          />
          <StatCard
            title="Resolución Prom."
            value={`${avgResolution} días`}
            icon={CheckCircle2}
            iconColor="text-green-600 bg-green-50"
          />
        </div>

        {/* Breach list */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Incidentes Registrados</h2>
          {breaches.map((breach) => {
            const hoursSinceDetection = Math.round(
              (Date.now() - new Date(breach.detected_date).getTime()) / (1000 * 60 * 60)
            )
            const agencyUrgent = !breach.notified_agency && breach.status !== "RESUELTA"

            return (
              <Card
                key={breach.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => openDetail(breach)}
              >
                <CardContent className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Left: info */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono font-bold text-gray-500">{breach.id}</span>
                        <Badge variant={severityVariant(breach.severity)}>
                          {severityLabel(breach.severity)}
                        </Badge>
                        <Badge className={getStatusColor(breach.status)}>
                          {statusLabel(breach.status)}
                        </Badge>
                        {agencyUrgent && (
                          <Badge variant="destructive" className="animate-pulse">
                            <Bell className="h-3 w-3 mr-1" /> Sin notificar
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">{breach.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(breach.detected_date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {breach.affected_titulars_count.toLocaleString("es-CL")} titulares
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {hoursSinceDetection}h desde detección
                        </span>
                      </div>
                    </div>

                    {/* Right: notification status */}
                    <div className="flex lg:flex-col gap-3 lg:gap-2 flex-shrink-0">
                      <div className="flex items-center gap-2">
                        {breach.notified_agency ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-400" />
                        )}
                        <span className="text-xs text-gray-600">Agencia</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {breach.notified_titulars ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-300" />
                        )}
                        <span className="text-xs text-gray-600">Titulares</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </AppShell>
  )
}

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
import { ProgressBar } from "@/components/ui/progress-bar"
import { getRiskColor, formatDate } from "@/lib/utils"
import {
  FileSpreadsheet,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  X,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shield,
  Globe,
  Users,
  Database,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

// ── Types ────────────────────────────────────────────────────────────────────

interface RATEntry {
  id: string
  activityName: string
  purpose: string
  legalBasis: string
  legalBasisDetail: string
  dataCategories: string[]
  sensitiveData: boolean
  titularsDescription: string
  dataSource: string
  recipients: string
  internationalTransfer: boolean
  transferCountry: string
  transferGuarantee: string
  retentionPeriod: string
  securityMeasures: string
  responsibleName: string
  responsibleEmail: string
  processorName: string
  processorContract: boolean
  department: string
  systems: string
  riskLevel: string
  lastReview: string
  status: string
  notes: string
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const mockRAT: RATEntry[] = [
  {
    id: "rat-001",
    activityName: "Gestión de nóminas y remuneraciones",
    purpose: "Pago de sueldos, cotizaciones previsionales y cumplimiento de obligaciones laborales",
    legalBasis: "LEY",
    legalBasisDetail: "Código del Trabajo, DL 3.500, Ley 16.744",
    dataCategories: ["Nombre", "RUT", "Dirección", "Cuenta bancaria", "Remuneración", "AFP", "Isapre"],
    sensitiveData: true,
    titularsDescription: "Trabajadores con contrato vigente y exempleados (retención 5 años)",
    dataSource: "Recopilación directa al momento de contratación",
    recipients: "AFP, Isapre/Fonasa, SII, Dirección del Trabajo, Mutual de Seguridad",
    internationalTransfer: true,
    transferCountry: "Brasil (AWS sa-east-1), EE.UU. (SAP HQ)",
    transferGuarantee: "Cláusulas contractuales tipo y certificación SOC 2",
    retentionPeriod: "5 años posterior al término de la relación laboral",
    securityMeasures: "Cifrado AES-256, control de acceso RBAC, MFA, logs de auditoría",
    responsibleName: "María González",
    responsibleEmail: "mgonzalez@empresa.cl",
    processorName: "SAP SE (SuccessFactors)",
    processorContract: true,
    department: "Recursos Humanos",
    systems: "SAP SuccessFactors, BancoEstado API",
    riskLevel: "ALTO",
    lastReview: "2026-01-15",
    status: "VIGENTE",
    notes: "Incluye datos de salud por licencias médicas - requiere consentimiento explícito",
  },
  {
    id: "rat-002",
    activityName: "Gestión de relaciones con clientes (CRM)",
    purpose: "Administración comercial, facturación, soporte postventa y comunicaciones comerciales",
    legalBasis: "CONTRATO",
    legalBasisDetail: "Relación contractual con clientes para prestación de servicios",
    dataCategories: ["Nombre", "RUT empresa", "Email", "Teléfono", "Dirección comercial", "Historial de compras"],
    sensitiveData: false,
    titularsDescription: "Clientes personas naturales y contactos de empresas clientes",
    dataSource: "Formularios web, contratos, interacciones comerciales",
    recipients: "Equipo comercial interno, servicio de facturación electrónica",
    internationalTransfer: true,
    transferCountry: "EE.UU. (Salesforce)",
    transferGuarantee: "Cláusulas contractuales tipo, Binding Corporate Rules de Salesforce",
    retentionPeriod: "Duración de la relación contractual + 3 años",
    securityMeasures: "SSO, cifrado en tránsito TLS 1.3, backups diarios cifrados",
    responsibleName: "Pedro Soto",
    responsibleEmail: "psoto@empresa.cl",
    processorName: "Salesforce Inc.",
    processorContract: true,
    department: "Comercial",
    systems: "Salesforce CRM, Facturación electrónica SII",
    riskLevel: "MEDIO",
    lastReview: "2026-02-20",
    status: "VIGENTE",
    notes: "",
  },
  {
    id: "rat-003",
    activityName: "Control de acceso biométrico",
    purpose: "Control de acceso físico a instalaciones y registro de asistencia",
    legalBasis: "INTERES_LEGITIMO",
    legalBasisDetail: "Seguridad de las instalaciones y cumplimiento de jornada laboral",
    dataCategories: ["Huella dactilar", "Fotografía facial", "Registro de horarios"],
    sensitiveData: true,
    titularsDescription: "Trabajadores, contratistas y visitantes frecuentes",
    dataSource: "Dispositivos biométricos en puntos de acceso",
    recipients: "Departamento de seguridad interno",
    internationalTransfer: false,
    transferCountry: "",
    transferGuarantee: "",
    retentionPeriod: "12 meses desde la captura",
    securityMeasures: "Almacenamiento local cifrado, acceso restringido, sin conexión a internet",
    responsibleName: "Diego Morales",
    responsibleEmail: "dmorales@empresa.cl",
    processorName: "ZKTeco (hardware), procesamiento local",
    processorContract: false,
    department: "Seguridad",
    systems: "ZKBioSecurity, servidor local dedicado",
    riskLevel: "CRITICO",
    lastReview: "2025-11-10",
    status: "REQUIERE_REVISION",
    notes: "ATENCIÓN: Datos biométricos requieren consentimiento explícito según Art. 16 bis. Evaluar EIPD.",
  },
  {
    id: "rat-004",
    activityName: "Marketing digital y newsletter",
    purpose: "Envío de comunicaciones comerciales, ofertas personalizadas y newsletter corporativo",
    legalBasis: "CONSENTIMIENTO",
    legalBasisDetail: "Consentimiento explícito obtenido mediante opt-in en formulario web",
    dataCategories: ["Nombre", "Email", "Preferencias de contenido", "Historial de apertura"],
    sensitiveData: false,
    titularsDescription: "Suscriptores voluntarios del newsletter y clientes con opt-in",
    dataSource: "Formulario de suscripción web con doble opt-in",
    recipients: "Equipo de marketing interno",
    internationalTransfer: true,
    transferCountry: "EE.UU. (Mailchimp/Intuit)",
    transferGuarantee: "Cláusulas contractuales tipo, certificación SOC 2 Type II",
    retentionPeriod: "Hasta revocación del consentimiento",
    securityMeasures: "Cifrado, API keys rotadas trimestralmente, logs de consentimiento",
    responsibleName: "Valentina Díaz",
    responsibleEmail: "vdiaz@empresa.cl",
    processorName: "Intuit Inc. (Mailchimp)",
    processorContract: true,
    department: "Marketing",
    systems: "Mailchimp, Google Analytics 4, WordPress",
    riskLevel: "BAJO",
    lastReview: "2026-03-01",
    status: "VIGENTE",
    notes: "Registro de consentimiento almacenado con timestamp y IP. Mecanismo de unsuscribe funcional.",
  },
  {
    id: "rat-005",
    activityName: "Videovigilancia CCTV",
    purpose: "Seguridad de las instalaciones, prevención de delitos y protección de activos",
    legalBasis: "INTERES_LEGITIMO",
    legalBasisDetail: "Interés legítimo del responsable en la seguridad de personas y bienes",
    dataCategories: ["Imágenes de video", "Metadatos de hora/fecha/ubicación"],
    sensitiveData: false,
    titularsDescription: "Trabajadores, visitantes y personas que transiten por áreas vigiladas",
    dataSource: "Cámaras de seguridad en instalaciones",
    recipients: "Personal de seguridad autorizado, fuerzas de orden (bajo requerimiento judicial)",
    internationalTransfer: false,
    transferCountry: "",
    transferGuarantee: "",
    retentionPeriod: "30 días, salvo incidente de seguridad (hasta 1 año)",
    securityMeasures: "NVR local cifrado, acceso con credenciales individuales, sala de monitoreo restringida",
    responsibleName: "Diego Morales",
    responsibleEmail: "dmorales@empresa.cl",
    processorName: "N/A - procesamiento interno",
    processorContract: false,
    department: "Seguridad",
    systems: "Hikvision NVR, cámaras IP",
    riskLevel: "MEDIO",
    lastReview: "2026-02-15",
    status: "VIGENTE",
    notes: "Señalética de aviso de videovigilancia instalada en todos los accesos. Art. 3 letra g) transparencia.",
  },
  {
    id: "rat-006",
    activityName: "Atención de consultas y reclamos",
    purpose: "Gestión de solicitudes, consultas y reclamos de clientes y titulares de datos",
    legalBasis: "LEY",
    legalBasisDetail: "Ley 19.496 Protección al Consumidor, Ley 21.719 Art. 5-11 derechos ARCO-POB",
    dataCategories: ["Nombre", "RUT", "Email", "Teléfono", "Descripción del reclamo"],
    sensitiveData: false,
    titularsDescription: "Clientes y titulares que ejercen derechos o presentan reclamos",
    dataSource: "Formulario web, correo electrónico, atención presencial",
    recipients: "Equipo de atención al cliente, área legal (si aplica)",
    internationalTransfer: false,
    transferCountry: "",
    transferGuarantee: "",
    retentionPeriod: "3 años desde la resolución del caso",
    securityMeasures: "Sistema con control de acceso, cifrado en tránsito, logs de acceso",
    responsibleName: "Ana Torres",
    responsibleEmail: "atorres@empresa.cl",
    processorName: "Zendesk Inc. (sistema de tickets)",
    processorContract: true,
    department: "Servicio al Cliente",
    systems: "Zendesk, correo corporativo",
    riskLevel: "BAJO",
    lastReview: "2026-03-10",
    status: "VIGENTE",
    notes: "Canal oficial para solicitudes ARCO-POB. Plazo máximo de respuesta: 30 días hábiles.",
  },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

const legalBasisLabels: Record<string, string> = {
  CONSENTIMIENTO: "Consentimiento",
  LEY: "Obligación legal",
  CONTRATO: "Ejecución de contrato",
  INTERES_LEGITIMO: "Interés legítimo",
  INTERES_VITAL: "Interés vital",
  MISION_PUBLICA: "Misión pública",
}

const statusConfig: Record<string, { label: string; color: string }> = {
  VIGENTE: { label: "Vigente", color: "text-green-700 bg-green-100" },
  REQUIERE_REVISION: { label: "Requiere revisión", color: "text-orange-700 bg-orange-100" },
  SUSPENDIDO: { label: "Suspendido", color: "text-red-700 bg-red-100" },
  NUEVO: { label: "Nuevo", color: "text-blue-700 bg-blue-100" },
}

// ── Component ────────────────────────────────────────────────────────────────

export default function RATPage() {
  const [entries] = useState<RATEntry[]>(mockRAT)
  const [view, setView] = useState<"list" | "detail" | "form" | "analysis">("list")
  const [selectedEntry, setSelectedEntry] = useState<RATEntry | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRisk, setFilterRisk] = useState("")
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const filtered = entries.filter(e => {
    const matchSearch = !searchTerm ||
      e.activityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.responsibleName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchRisk = !filterRisk || e.riskLevel === filterRisk
    return matchSearch && matchRisk
  })

  // ── Analysis calculations ──
  const totalActivities = entries.length
  const withSensitiveData = entries.filter(e => e.sensitiveData).length
  const withTransfer = entries.filter(e => e.internationalTransfer).length
  const requiresReview = entries.filter(e => e.status === "REQUIERE_REVISION").length
  const withoutContract = entries.filter(e => e.processorName && e.processorName !== "N/A - procesamiento interno" && !e.processorContract).length

  const riskDistribution = {
    CRITICO: entries.filter(e => e.riskLevel === "CRITICO").length,
    ALTO: entries.filter(e => e.riskLevel === "ALTO").length,
    MEDIO: entries.filter(e => e.riskLevel === "MEDIO").length,
    BAJO: entries.filter(e => e.riskLevel === "BAJO").length,
  }

  const legalBasisDistribution: Record<string, number> = {}
  entries.forEach(e => {
    legalBasisDistribution[e.legalBasis] = (legalBasisDistribution[e.legalBasis] || 0) + 1
  })

  const departmentDistribution: Record<string, number> = {}
  entries.forEach(e => {
    departmentDistribution[e.department] = (departmentDistribution[e.department] || 0) + 1
  })

  const complianceIssues = [
    ...(withoutContract > 0 ? [{ severity: "ALTA", issue: `${withoutContract} encargado(s) sin contrato formal de tratamiento`, article: "Art. 14" }] : []),
    ...(requiresReview > 0 ? [{ severity: "MEDIA", issue: `${requiresReview} actividad(es) requieren revisión de cumplimiento`, article: "Art. 14" }] : []),
    ...entries.filter(e => e.sensitiveData && e.legalBasis !== "CONSENTIMIENTO" && e.legalBasis !== "LEY").map(e => ({
      severity: "ALTA" as const, issue: `"${e.activityName}" trata datos sensibles sin consentimiento explícito`, article: "Art. 16"
    })),
    ...entries.filter(e => e.internationalTransfer && !e.transferGuarantee).map(e => ({
      severity: "CRITICA" as const, issue: `"${e.activityName}" realiza transferencia internacional sin garantías`, article: "Art. 27-28"
    })),
  ]

  // ── LIST VIEW ──
  if (view === "list") {
    return (
      <AppShell>
        <Header
          title="Registro de Actividades de Tratamiento (RAT)"
          subtitle="Art. 14 Ley 21.719 - Registro obligatorio de todas las actividades de tratamiento"
          actions={
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setView("analysis")}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Análisis
              </Button>
              <Button onClick={() => setView("form")}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Actividad
              </Button>
            </div>
          }
        />
        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatCard title="Total Actividades" value={totalActivities} icon={FileSpreadsheet} iconColor="text-blue-600 bg-blue-50" />
            <StatCard title="Datos Sensibles" value={withSensitiveData} icon={Shield} iconColor="text-red-600 bg-red-50" />
            <StatCard title="Transfer. Internacional" value={withTransfer} icon={Globe} iconColor="text-purple-600 bg-purple-50" />
            <StatCard title="Requieren Revisión" value={requiresReview} icon={AlertTriangle} iconColor="text-orange-600 bg-orange-50" />
            <StatCard title="Sin Contrato Encargado" value={withoutContract} icon={Clock} iconColor="text-yellow-600 bg-yellow-50" />
          </div>

          {/* Filters */}
          <div className="flex gap-3 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por actividad, departamento o responsable..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="h-10 rounded-lg border border-gray-300 px-3 text-sm"
            >
              <option value="">Todos los niveles</option>
              <option value="CRITICO">Crítico</option>
              <option value="ALTO">Alto</option>
              <option value="MEDIO">Medio</option>
              <option value="BAJO">Bajo</option>
            </select>
            <Button variant="outline" size="icon" title="Exportar RAT">
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {/* RAT entries */}
          <div className="space-y-3">
            {filtered.map((entry) => (
              <Card key={entry.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{entry.activityName}</h3>
                        <Badge className={getRiskColor(entry.riskLevel)}>{entry.riskLevel}</Badge>
                        <Badge className={statusConfig[entry.status]?.color || "text-gray-700 bg-gray-100"}>
                          {statusConfig[entry.status]?.label || entry.status}
                        </Badge>
                        {entry.sensitiveData && <Badge variant="destructive">Datos Sensibles</Badge>}
                        {entry.internationalTransfer && (
                          <Badge variant="outline" className="gap-1">
                            <Globe className="h-3 w-3" /> Transfer. Internacional
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{entry.purpose}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-gray-500">
                        <div>
                          <span className="font-medium text-gray-700">Base legal:</span>{" "}
                          {legalBasisLabels[entry.legalBasis] || entry.legalBasis}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Departamento:</span>{" "}
                          {entry.department}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Responsable:</span>{" "}
                          {entry.responsibleName}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Última revisión:</span>{" "}
                          {formatDate(entry.lastReview)}
                        </div>
                      </div>

                      {entry.notes && (
                        <div className="mt-2 text-xs bg-yellow-50 border border-yellow-200 rounded p-2 text-yellow-800">
                          <AlertTriangle className="h-3 w-3 inline mr-1" />
                          {entry.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-1 ml-4">
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedEntry(entry); setView("detail") }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AppShell>
    )
  }

  // ── DETAIL VIEW ──
  if (view === "detail" && selectedEntry) {
    const e = selectedEntry
    const sections = [
      {
        id: "general", title: "Información General", icon: FileSpreadsheet,
        fields: [
          { label: "Actividad de tratamiento", value: e.activityName },
          { label: "Finalidad", value: e.purpose },
          { label: "Departamento", value: e.department },
          { label: "Estado", value: statusConfig[e.status]?.label || e.status },
          { label: "Nivel de riesgo", value: e.riskLevel },
          { label: "Última revisión", value: formatDate(e.lastReview) },
        ]
      },
      {
        id: "legal", title: "Base Legal y Finalidad", icon: Shield,
        fields: [
          { label: "Base legal", value: legalBasisLabels[e.legalBasis] || e.legalBasis },
          { label: "Detalle de la base legal", value: e.legalBasisDetail },
          { label: "Período de retención", value: e.retentionPeriod },
        ]
      },
      {
        id: "data", title: "Datos Tratados", icon: Database,
        fields: [
          { label: "Categorías de datos", value: e.dataCategories.join(", ") },
          { label: "Contiene datos sensibles", value: e.sensitiveData ? "Sí" : "No" },
          { label: "Descripción de titulares", value: e.titularsDescription },
          { label: "Fuente de los datos", value: e.dataSource },
          { label: "Destinatarios", value: e.recipients },
        ]
      },
      {
        id: "transfer", title: "Transferencia Internacional", icon: Globe,
        fields: [
          { label: "Realiza transferencia internacional", value: e.internationalTransfer ? "Sí" : "No" },
          ...(e.internationalTransfer ? [
            { label: "País/región de destino", value: e.transferCountry },
            { label: "Garantías de transferencia", value: e.transferGuarantee },
          ] : []),
        ]
      },
      {
        id: "security", title: "Seguridad y Sistemas", icon: Shield,
        fields: [
          { label: "Medidas de seguridad", value: e.securityMeasures },
          { label: "Sistemas/plataformas", value: e.systems },
        ]
      },
      {
        id: "responsible", title: "Responsable y Encargado", icon: Users,
        fields: [
          { label: "Responsable interno", value: `${e.responsibleName} (${e.responsibleEmail})` },
          { label: "Encargado del tratamiento", value: e.processorName },
          { label: "Contrato con encargado", value: e.processorContract ? "Sí - vigente" : "No" },
        ]
      },
    ]

    return (
      <AppShell>
        <Header
          title="Detalle de Actividad RAT"
          subtitle={e.activityName}
          actions={
            <Button variant="outline" onClick={() => setView("list")}>
              Volver al listado
            </Button>
          }
        />
        <div className="p-6 space-y-4">
          {/* Status banner */}
          {e.status === "REQUIERE_REVISION" && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <p className="font-medium text-orange-800">Esta actividad requiere revisión</p>
                <p className="text-sm text-orange-600">La última revisión fue el {formatDate(e.lastReview)}. Verifique el cumplimiento y actualice el registro.</p>
              </div>
            </div>
          )}

          {sections.map((section) => (
            <Card key={section.id}>
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <section.icon className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">{section.title}</h3>
                </div>
                {expandedSections[section.id] !== false ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </button>
              {expandedSections[section.id] !== false && (
                <CardContent className="pt-0 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.fields.map((f, idx) => (
                      <div key={idx} className={f.value.length > 80 ? "md:col-span-2" : ""}>
                        <p className="text-xs font-medium text-gray-500 mb-1">{f.label}</p>
                        <p className="text-sm text-gray-900">{f.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}

          {e.notes && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Notas y observaciones</p>
                    <p className="text-sm text-yellow-700 mt-1">{e.notes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </AppShell>
    )
  }

  // ── ANALYSIS VIEW ──
  if (view === "analysis") {
    return (
      <AppShell>
        <Header
          title="Análisis del RAT"
          subtitle="Visión general del registro de actividades de tratamiento"
          actions={
            <Button variant="outline" onClick={() => setView("list")}>
              Volver al listado
            </Button>
          }
        />
        <div className="p-6 space-y-6">
          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Total Actividades" value={totalActivities} icon={FileSpreadsheet} iconColor="text-blue-600 bg-blue-50" />
            <StatCard title="Con Datos Sensibles" value={withSensitiveData} description={`${Math.round(withSensitiveData/totalActivities*100)}% del total`} icon={Shield} iconColor="text-red-600 bg-red-50" />
            <StatCard title="Transfer. Internacional" value={withTransfer} description={`${Math.round(withTransfer/totalActivities*100)}% del total`} icon={Globe} iconColor="text-purple-600 bg-purple-50" />
            <StatCard title="Hallazgos Críticos" value={complianceIssues.filter(i => i.severity === "CRITICA" || i.severity === "ALTA").length} icon={AlertTriangle} iconColor="text-orange-600 bg-orange-50" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Distribución por Nivel de Riesgo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(riskDistribution).map(([level, count]) => (
                  <div key={level} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{level}</span>
                      <span>{count} actividad{count !== 1 ? "es" : ""}</span>
                    </div>
                    <ProgressBar value={count} max={totalActivities} showLabel={false} />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Legal basis distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Distribución por Base Legal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(legalBasisDistribution).map(([basis, count]) => (
                  <div key={basis} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                    <span className="text-sm font-medium">{legalBasisLabels[basis] || basis}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{count}</span>
                      <Badge variant="outline">{Math.round(count/totalActivities*100)}%</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Department distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Actividades por Departamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(departmentDistribution).map(([dept, count]) => (
                  <div key={dept} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                    <span className="text-sm font-medium">{dept}</span>
                    <Badge>{count} actividad{count !== 1 ? "es" : ""}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Compliance issues */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Hallazgos de Cumplimiento
                </CardTitle>
              </CardHeader>
              <CardContent>
                {complianceIssues.length === 0 ? (
                  <div className="flex items-center gap-2 text-green-600 p-4">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm font-medium">Sin hallazgos críticos detectados</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {complianceIssues.map((issue, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                        <AlertTriangle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                          issue.severity === "CRITICA" ? "text-red-600" :
                          issue.severity === "ALTA" ? "text-orange-600" : "text-yellow-600"
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{issue.issue}</p>
                          <p className="text-xs text-gray-500 mt-1">Referencia: {issue.article}</p>
                        </div>
                        <Badge variant={issue.severity === "CRITICA" ? "destructive" : issue.severity === "ALTA" ? "warning" : "default"}>
                          {issue.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Transfer map summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-indigo-600" />
                Transferencias Internacionales de Datos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {entries.filter(e => e.internationalTransfer).map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                    <div>
                      <p className="text-sm font-medium">{entry.activityName}</p>
                      <p className="text-xs text-gray-500">Destino: {entry.transferCountry}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {entry.transferGuarantee ? (
                        <Badge variant="success">Con garantías</Badge>
                      ) : (
                        <Badge variant="destructive">Sin garantías</Badge>
                      )}
                      <Badge className={getRiskColor(entry.riskLevel)}>{entry.riskLevel}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    )
  }

  // ── FORM VIEW ──
  return (
    <AppShell>
      <Header
        title="Nueva Actividad de Tratamiento"
        subtitle="Registrar una nueva actividad en el RAT"
        actions={
          <Button variant="outline" onClick={() => setView("list")}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
        }
      />
      <div className="p-6">
        <div className="max-w-4xl space-y-6">
          {/* Info legal */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-800">Registro obligatorio según Art. 14 Ley 21.719</p>
            <p className="text-xs text-blue-600 mt-1">
              El responsable de datos debe mantener un registro permanente y actualizado de todas las actividades de tratamiento de datos personales bajo su responsabilidad.
            </p>
          </div>

          {/* Form sections */}
          <Card>
            <CardHeader><CardTitle>Información General</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Nombre de la actividad de tratamiento *</label>
                  <Input placeholder="Ej: Gestión de nóminas, CRM, Control de acceso..." className="mt-1" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Finalidad del tratamiento *</label>
                  <Textarea placeholder="Describa la finalidad específica, explícita y legítima..." className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Departamento responsable *</label>
                  <Input placeholder="Ej: Recursos Humanos" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Responsable interno *</label>
                  <Input placeholder="Nombre del responsable" className="mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Base Legal y Retención</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Base legal del tratamiento *</label>
                  <select className="mt-1 w-full h-10 rounded-lg border border-gray-300 px-3 text-sm">
                    <option value="">Seleccionar...</option>
                    <option value="CONSENTIMIENTO">Consentimiento del titular</option>
                    <option value="LEY">Obligación legal</option>
                    <option value="CONTRATO">Ejecución de contrato</option>
                    <option value="INTERES_LEGITIMO">Interés legítimo</option>
                    <option value="INTERES_VITAL">Interés vital</option>
                    <option value="MISION_PUBLICA">Misión pública</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Período de retención *</label>
                  <Input placeholder="Ej: 5 años posterior al término del contrato" className="mt-1" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Detalle de la base legal</label>
                  <Textarea placeholder="Norma específica, artículo, decreto, etc." className="mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Datos Personales Tratados</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Categorías de datos *</label>
                  <Textarea placeholder="Nombre, RUT, dirección, email, datos de salud, biométricos..." className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">¿Incluye datos sensibles? *</label>
                  <select className="mt-1 w-full h-10 rounded-lg border border-gray-300 px-3 text-sm">
                    <option value="false">No</option>
                    <option value="true">Sí</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Fuente de los datos</label>
                  <Input placeholder="Ej: Recopilación directa, terceros..." className="mt-1" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Descripción de titulares *</label>
                  <Input placeholder="Ej: Trabajadores con contrato vigente, clientes personas naturales..." className="mt-1" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Destinatarios</label>
                  <Textarea placeholder="¿A quién se comunican o transfieren los datos?" className="mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Transferencia Internacional</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">¿Realiza transferencia internacional? *</label>
                  <select className="mt-1 w-full h-10 rounded-lg border border-gray-300 px-3 text-sm">
                    <option value="false">No</option>
                    <option value="true">Sí (incluye servicios cloud extranjeros)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">País/región de destino</label>
                  <Input placeholder="Ej: EE.UU. (AWS), Brasil" className="mt-1" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Garantías de la transferencia</label>
                  <Textarea placeholder="Cláusulas contractuales tipo, BCR, certificaciones..." className="mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Seguridad y Sistemas</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Medidas de seguridad implementadas *</label>
                  <Textarea placeholder="Cifrado, control de acceso, MFA, logs, backups..." className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Sistemas/plataformas</label>
                  <Input placeholder="Ej: SAP, Salesforce, servidor local" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Encargado del tratamiento</label>
                  <Input placeholder="Nombre del proveedor/encargado" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Nivel de riesgo *</label>
                  <select className="mt-1 w-full h-10 rounded-lg border border-gray-300 px-3 text-sm">
                    <option value="BAJO">Bajo</option>
                    <option value="MEDIO">Medio</option>
                    <option value="ALTO">Alto</option>
                    <option value="CRITICO">Crítico</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">¿Contrato con encargado?</label>
                  <select className="mt-1 w-full h-10 rounded-lg border border-gray-300 px-3 text-sm">
                    <option value="false">No</option>
                    <option value="true">Sí</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Observaciones</CardTitle></CardHeader>
            <CardContent>
              <Textarea placeholder="Notas adicionales, consideraciones especiales, pendientes..." rows={3} />
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setView("list")}>Cancelar</Button>
            <Button variant="secondary">Guardar como borrador</Button>
            <Button onClick={() => setView("list")}>Registrar Actividad</Button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

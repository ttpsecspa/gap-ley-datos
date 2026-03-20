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
import { getRiskColor } from "@/lib/utils"
import type { DataCategory, LegalBasis, RiskLevel } from "@/types/database"
import {
  Database,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Globe,
  Eye,
  Pencil,
  Trash2,
  Shield,
  FileText,
  X,
  ChevronDown,
  ArrowLeft,
} from "lucide-react"

// ---------- Types ----------
interface DataInventoryItem {
  id: string
  data_name: string
  data_description: string
  data_category: DataCategory
  purpose: string
  legal_basis: LegalBasis
  legal_basis_detail: string
  data_source: string
  recipients: string
  internal_responsible: string
  retention_period: string
  platform_system: string
  storage_infrastructure: string
  international_transfer: boolean
  transfer_country: string
  transfer_entity: string
  access_areas: string
  risk_level: RiskLevel
  notes: string
  department: string
  created_at: string
  updated_at: string
}

// ---------- Mock Data ----------
const mockData: DataInventoryItem[] = [
  {
    id: "1",
    data_name: "Datos de colaboradores",
    data_description: "Informacion personal de empleados: nombre, RUT, direccion, telefono, email, cargo, remuneracion, datos previsionales y de salud (licencias medicas).",
    data_category: "SENSIBLE",
    purpose: "Gestion de recursos humanos, pago de remuneraciones, cumplimiento de obligaciones laborales y previsionales",
    legal_basis: "LEY",
    legal_basis_detail: "Codigo del Trabajo, DL 3.500, Ley 16.744",
    data_source: "Recopilacion directa al momento de la contratacion",
    recipients: "AFP, Isapre/Fonasa, Mutual de Seguridad, SII, Direccion del Trabajo",
    internal_responsible: "Maria Gonzalez - Jefa de RRHH",
    retention_period: "5 anos posterior al termino de la relacion laboral",
    platform_system: "SAP SuccessFactors",
    storage_infrastructure: "Cloud - AWS Region sa-east-1 (Sao Paulo)",
    international_transfer: true,
    transfer_country: "Brasil (AWS sa-east-1), Estados Unidos (SAP HQ)",
    transfer_entity: "SAP SE, Amazon Web Services Inc.",
    access_areas: "RRHH, Finanzas, Gerencia General",
    risk_level: "ALTO",
    notes: "Incluye datos de salud (licencias medicas) que son datos sensibles segun Art. 16 bis Ley 21.719. Requiere consentimiento explicito para datos de salud.",
    department: "Recursos Humanos",
    created_at: "2026-01-15",
    updated_at: "2026-03-10",
  },
  {
    id: "2",
    data_name: "Base de datos de clientes",
    data_description: "Nombre, RUT, direccion, email, telefono, historial de compras y preferencias comerciales de clientes.",
    data_category: "PERSONAL",
    purpose: "Ejecucion de contratos de venta, atencion post-venta, facturacion electronica",
    legal_basis: "CONTRATO",
    legal_basis_detail: "Ejecucion de contrato de compraventa y cumplimiento tributario (DL 825)",
    data_source: "Formulario de registro en punto de venta y sitio web",
    recipients: "SII (facturacion electronica), empresa de courier (despacho)",
    internal_responsible: "Carlos Muñoz - Gerente Comercial",
    retention_period: "6 anos desde la ultima transaccion (plazo tributario)",
    platform_system: "Salesforce CRM",
    storage_infrastructure: "Cloud - Salesforce (USA)",
    international_transfer: true,
    transfer_country: "Estados Unidos",
    transfer_entity: "Salesforce Inc.",
    access_areas: "Ventas, Marketing, Atencion al Cliente, Finanzas",
    risk_level: "MEDIO",
    notes: "Verificar clausulas contractuales tipo (CCT) con Salesforce para transferencia internacional segun Art. 27 Ley 21.719.",
    department: "Comercial",
    created_at: "2026-01-20",
    updated_at: "2026-03-05",
  },
  {
    id: "3",
    data_name: "Registro de control de acceso biometrico",
    data_description: "Huellas dactilares y registro fotografico facial para control de acceso a instalaciones.",
    data_category: "BIOMETRICO",
    purpose: "Control de acceso fisico a instalaciones, registro de asistencia laboral",
    legal_basis: "CONSENTIMIENTO",
    legal_basis_detail: "Consentimiento explicito del titular conforme Art. 16 bis Ley 21.719 para datos biometricos",
    data_source: "Dispositivos biometricos en accesos principales",
    recipients: "No se comparten con terceros",
    internal_responsible: "Pedro Soto - Jefe de Seguridad",
    retention_period: "1 ano desde la captura, o hasta el termino de la relacion laboral",
    platform_system: "ZKTeco BioTime",
    storage_infrastructure: "Servidor on-premise en datacenter propio",
    international_transfer: false,
    transfer_country: "",
    transfer_entity: "",
    access_areas: "Seguridad, RRHH",
    risk_level: "CRITICO",
    notes: "Datos biometricos requieren nivel de proteccion reforzado. Art. 16 bis exige consentimiento explicito e informado. Evaluar EIPD obligatoria.",
    department: "Seguridad",
    created_at: "2026-02-01",
    updated_at: "2026-03-18",
  },
  {
    id: "4",
    data_name: "Registros de videovigilancia",
    data_description: "Grabaciones de camaras de seguridad en areas comunes de oficinas y bodegas.",
    data_category: "PERSONAL",
    purpose: "Seguridad de las instalaciones y proteccion de activos",
    legal_basis: "INTERES_LEGITIMO",
    legal_basis_detail: "Interes legitimo del responsable en la seguridad de sus instalaciones (Art. 13 quater Ley 21.719)",
    data_source: "Camaras CCTV instaladas en areas comunes",
    recipients: "Fuerzas de orden publico (solo ante requerimiento judicial)",
    internal_responsible: "Pedro Soto - Jefe de Seguridad",
    retention_period: "30 dias corridos, salvo incidentes en investigacion",
    platform_system: "Hikvision NVR",
    storage_infrastructure: "NVR on-premise en sala de servidores",
    international_transfer: false,
    transfer_country: "",
    transfer_entity: "",
    access_areas: "Seguridad",
    risk_level: "MEDIO",
    notes: "Señaletica de aviso de videovigilancia instalada. Verificar cumplimiento de prueba de balance de interes legitimo.",
    department: "Seguridad",
    created_at: "2026-02-05",
    updated_at: "2026-02-28",
  },
  {
    id: "5",
    data_name: "Datos de proveedores y contratistas",
    data_description: "Razon social, RUT, representante legal, datos de contacto, informacion bancaria para pagos.",
    data_category: "PERSONAL",
    purpose: "Gestion de contratos con proveedores, procesamiento de pagos, cumplimiento tributario",
    legal_basis: "CONTRATO",
    legal_basis_detail: "Ejecucion de contratos de prestacion de servicios",
    data_source: "Formulario de registro de proveedores",
    recipients: "SII, banco para transferencias",
    internal_responsible: "Ana Torres - Jefa de Adquisiciones",
    retention_period: "6 anos desde el termino del contrato",
    platform_system: "SAP Business One",
    storage_infrastructure: "Servidor on-premise",
    international_transfer: false,
    transfer_country: "",
    transfer_entity: "",
    access_areas: "Adquisiciones, Finanzas, Legal",
    risk_level: "BAJO",
    notes: "Datos principalmente de personas juridicas. Para personas naturales (contratistas), aplicar proteccion completa.",
    department: "Adquisiciones",
    created_at: "2026-01-25",
    updated_at: "2026-02-20",
  },
  {
    id: "6",
    data_name: "Expedientes medicos ocupacionales",
    data_description: "Examenes pre-ocupacionales, periodicos y de egreso. Historial de enfermedades profesionales y accidentes laborales.",
    data_category: "SENSIBLE",
    purpose: "Cumplimiento de obligaciones de salud y seguridad laboral, prevencion de riesgos",
    legal_basis: "LEY",
    legal_basis_detail: "Ley 16.744 sobre accidentes del trabajo, DS 594 sobre condiciones sanitarias",
    data_source: "Mutual de Seguridad, examenes medicos contratados",
    recipients: "Mutual de Seguridad, SEREMI de Salud (en caso de fiscalizacion)",
    internal_responsible: "Lucia Fernandez - Prevencionista de Riesgos",
    retention_period: "20 anos conforme normativa de salud ocupacional",
    platform_system: "Sistema interno de prevencion de riesgos",
    storage_infrastructure: "Servidor on-premise con cifrado",
    international_transfer: false,
    transfer_country: "",
    transfer_entity: "",
    access_areas: "Prevencion de Riesgos, RRHH (acceso restringido)",
    risk_level: "ALTO",
    notes: "Datos de salud requieren medidas de seguridad reforzadas. Acceso restringido solo a personal autorizado de prevencion de riesgos.",
    department: "Prevencion de Riesgos",
    created_at: "2026-02-10",
    updated_at: "2026-03-15",
  },
  {
    id: "7",
    data_name: "Datos de marketing y newsletter",
    data_description: "Email, nombre, preferencias de comunicacion, historial de interacciones con campanas de email marketing.",
    data_category: "PERSONAL",
    purpose: "Envio de comunicaciones comerciales, campanas de marketing directo, fidelizacion",
    legal_basis: "CONSENTIMIENTO",
    legal_basis_detail: "Consentimiento libre, informado, especifico e inequivoco del titular (Art. 12 Ley 21.719)",
    data_source: "Formulario de suscripcion web, eventos presenciales",
    recipients: "No se comparten con terceros",
    internal_responsible: "Javiera Rojas - Jefa de Marketing Digital",
    retention_period: "Hasta revocacion del consentimiento",
    platform_system: "Mailchimp",
    storage_infrastructure: "Cloud - Mailchimp (USA)",
    international_transfer: true,
    transfer_country: "Estados Unidos",
    transfer_entity: "The Rocket Science Group LLC (Mailchimp)",
    access_areas: "Marketing",
    risk_level: "MEDIO",
    notes: "Implementar mecanismo facil de revocacion del consentimiento. Verificar double opt-in. Evaluar CCT con Mailchimp.",
    department: "Marketing",
    created_at: "2026-01-30",
    updated_at: "2026-03-12",
  },
  {
    id: "8",
    data_name: "Datos de postulantes laborales",
    data_description: "CV, carta de presentacion, pretensiones de renta, referencias laborales, resultado de evaluaciones psicologicas.",
    data_category: "SENSIBLE",
    purpose: "Proceso de seleccion y reclutamiento de personal",
    legal_basis: "CONSENTIMIENTO",
    legal_basis_detail: "Consentimiento otorgado al postular al cargo. Evaluaciones psicologicas son datos sensibles.",
    data_source: "Portal de empleo, recepcion directa de CV",
    recipients: "Consultora de seleccion (cuando aplica)",
    internal_responsible: "Maria Gonzalez - Jefa de RRHH",
    retention_period: "6 meses desde el cierre del proceso de seleccion",
    platform_system: "Buk Reclutamiento",
    storage_infrastructure: "Cloud - Buk (Chile/AWS)",
    international_transfer: false,
    transfer_country: "",
    transfer_entity: "",
    access_areas: "RRHH",
    risk_level: "MEDIO",
    notes: "Eliminar datos de postulantes no seleccionados dentro del plazo de retencion. Las evaluaciones psicologicas son datos sensibles.",
    department: "Recursos Humanos",
    created_at: "2026-02-15",
    updated_at: "2026-03-08",
  },
  {
    id: "9",
    data_name: "Logs de actividad de usuarios",
    data_description: "Registros de acceso a sistemas, direcciones IP, acciones realizadas en plataformas internas, timestamps.",
    data_category: "PERSONAL",
    purpose: "Seguridad informatica, auditoria de sistemas, deteccion de incidentes de seguridad",
    legal_basis: "INTERES_LEGITIMO",
    legal_basis_detail: "Interes legitimo en la seguridad de los sistemas de informacion (Art. 13 quater Ley 21.719)",
    data_source: "Generacion automatica por sistemas internos",
    recipients: "No se comparten con terceros (salvo requerimiento judicial)",
    internal_responsible: "Felipe Araya - Jefe de TI",
    retention_period: "12 meses",
    platform_system: "Splunk SIEM",
    storage_infrastructure: "Cloud - Splunk (USA)",
    international_transfer: true,
    transfer_country: "Estados Unidos",
    transfer_entity: "Splunk Inc.",
    access_areas: "TI, Seguridad de la Informacion",
    risk_level: "BAJO",
    notes: "Informar a usuarios sobre el monitoreo de actividad. Incluir en politica de uso aceptable de sistemas.",
    department: "Tecnologia",
    created_at: "2026-02-20",
    updated_at: "2026-03-01",
  },
  {
    id: "10",
    data_name: "Datos de beneficiarios de seguros",
    data_description: "Nombre, RUT, parentesco, datos de contacto de beneficiarios designados en seguros complementarios de salud y vida.",
    data_category: "SENSIBLE",
    purpose: "Administracion de beneficios de seguros complementarios para colaboradores",
    legal_basis: "CONSENTIMIENTO",
    legal_basis_detail: "Consentimiento del titular al designar beneficiarios en poliza de seguros",
    data_source: "Formulario de designacion de beneficiarios",
    recipients: "Compañia de seguros (MetLife Chile)",
    internal_responsible: "Maria Gonzalez - Jefa de RRHH",
    retention_period: "Vigencia de la poliza mas 2 anos",
    platform_system: "Planilla Excel cifrada",
    storage_infrastructure: "Servidor de archivos on-premise",
    international_transfer: false,
    transfer_country: "",
    transfer_entity: "",
    access_areas: "RRHH (solo encargado de beneficios)",
    risk_level: "ALTO",
    notes: "Migrar desde Excel a sistema con control de acceso robusto. Datos de terceros (beneficiarios) requieren consentimiento independiente.",
    department: "Recursos Humanos",
    created_at: "2026-03-01",
    updated_at: "2026-03-19",
  },
]

const CATEGORY_LABELS: Record<DataCategory, string> = {
  PERSONAL: "Personal",
  SENSIBLE: "Sensible",
  BIOMETRICO: "Biometrico",
}

const LEGAL_BASIS_LABELS: Record<LegalBasis, string> = {
  CONSENTIMIENTO: "Consentimiento",
  LEY: "Ley",
  CONTRATO: "Contrato",
  INTERES_LEGITIMO: "Interes Legitimo",
  INTERES_VITAL: "Interes Vital",
  MISION_PUBLICA: "Mision Publica",
}

const RISK_LABELS: Record<RiskLevel, string> = {
  BAJO: "Bajo",
  MEDIO: "Medio",
  ALTO: "Alto",
  CRITICO: "Critico",
}

const CATEGORY_OPTIONS: DataCategory[] = ["PERSONAL", "SENSIBLE", "BIOMETRICO"]
const LEGAL_BASIS_OPTIONS: LegalBasis[] = ["CONSENTIMIENTO", "LEY", "CONTRATO", "INTERES_LEGITIMO", "INTERES_VITAL", "MISION_PUBLICA"]
const RISK_OPTIONS: RiskLevel[] = ["BAJO", "MEDIO", "ALTO", "CRITICO"]

function getCategoryColor(cat: DataCategory): string {
  switch (cat) {
    case "PERSONAL": return "text-blue-700 bg-blue-100"
    case "SENSIBLE": return "text-purple-700 bg-purple-100"
    case "BIOMETRICO": return "text-red-700 bg-red-100"
  }
}

// ---------- Empty form ----------
const emptyForm: Omit<DataInventoryItem, "id" | "created_at" | "updated_at"> = {
  data_name: "",
  data_description: "",
  data_category: "PERSONAL",
  purpose: "",
  legal_basis: "CONSENTIMIENTO",
  legal_basis_detail: "",
  data_source: "",
  recipients: "",
  internal_responsible: "",
  retention_period: "",
  platform_system: "",
  storage_infrastructure: "",
  international_transfer: false,
  transfer_country: "",
  transfer_entity: "",
  access_areas: "",
  risk_level: "BAJO",
  notes: "",
  department: "",
}

// ---------- Component ----------
export default function InventarioPage() {
  const [data, setData] = useState<DataInventoryItem[]>(mockData)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<DataCategory | "">("")
  const [filterRisk, setFilterRisk] = useState<RiskLevel | "">("")
  const [showFilters, setShowFilters] = useState(false)

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<DataInventoryItem | null>(null)
  const [form, setForm] = useState(emptyForm)

  // Detail view
  const [selectedItem, setSelectedItem] = useState<DataInventoryItem | null>(null)

  // ---------- Filtered data ----------
  const filtered = data.filter((item) => {
    const matchesSearch =
      !searchTerm ||
      item.data_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.internal_responsible.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || item.data_category === filterCategory
    const matchesRisk = !filterRisk || item.risk_level === filterRisk
    return matchesSearch && matchesCategory && matchesRisk
  })

  // ---------- Stats ----------
  const totalRecords = data.length
  const personalCount = data.filter((d) => d.data_category === "PERSONAL").length
  const sensibleCount = data.filter((d) => d.data_category === "SENSIBLE").length
  const biometricoCount = data.filter((d) => d.data_category === "BIOMETRICO").length
  const highRiskCount = data.filter((d) => d.risk_level === "ALTO" || d.risk_level === "CRITICO").length
  const transferCount = data.filter((d) => d.international_transfer).length

  // ---------- Modal helpers ----------
  function openCreate() {
    setEditingItem(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(item: DataInventoryItem) {
    setEditingItem(item)
    setForm({
      data_name: item.data_name,
      data_description: item.data_description,
      data_category: item.data_category,
      purpose: item.purpose,
      legal_basis: item.legal_basis,
      legal_basis_detail: item.legal_basis_detail,
      data_source: item.data_source,
      recipients: item.recipients,
      internal_responsible: item.internal_responsible,
      retention_period: item.retention_period,
      platform_system: item.platform_system,
      storage_infrastructure: item.storage_infrastructure,
      international_transfer: item.international_transfer,
      transfer_country: item.transfer_country,
      transfer_entity: item.transfer_entity,
      access_areas: item.access_areas,
      risk_level: item.risk_level,
      notes: item.notes,
      department: item.department,
    })
    setModalOpen(true)
  }

  function handleSave() {
    if (!form.data_name.trim() || !form.purpose.trim()) return

    if (editingItem) {
      setData((prev) =>
        prev.map((d) =>
          d.id === editingItem.id
            ? { ...d, ...form, updated_at: new Date().toISOString().split("T")[0] }
            : d
        )
      )
    } else {
      const newItem: DataInventoryItem = {
        ...form,
        id: String(Date.now()),
        created_at: new Date().toISOString().split("T")[0],
        updated_at: new Date().toISOString().split("T")[0],
      }
      setData((prev) => [...prev, newItem])
    }
    setModalOpen(false)
  }

  function handleDelete(id: string) {
    setData((prev) => prev.filter((d) => d.id !== id))
    if (selectedItem?.id === id) setSelectedItem(null)
  }

  // ---------- Detail View ----------
  if (selectedItem) {
    return (
      <AppShell>
        <Header
          title="Inventario de Datos Personales"
          subtitle="Detalle del registro"
        />
        <div className="p-6 space-y-6">
          <Button
            variant="ghost"
            onClick={() => setSelectedItem(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al listado
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main info */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-blue-600" />
                      {selectedItem.data_name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getCategoryColor(selectedItem.data_category)}>
                        {CATEGORY_LABELS[selectedItem.data_category]}
                      </Badge>
                      <Badge className={getRiskColor(selectedItem.risk_level)}>
                        {RISK_LABELS[selectedItem.risk_level]}
                      </Badge>
                      {selectedItem.international_transfer && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          Transferencia Internacional
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { openEdit(selectedItem); setSelectedItem(null) }}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-1">Descripcion</h4>
                  <p className="text-sm text-gray-700">{selectedItem.data_description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 mb-1">Finalidad</h4>
                    <p className="text-sm text-gray-700">{selectedItem.purpose}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 mb-1">Base Legal</h4>
                    <p className="text-sm text-gray-700 font-medium">{LEGAL_BASIS_LABELS[selectedItem.legal_basis]}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{selectedItem.legal_basis_detail}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 mb-1">Origen de los Datos</h4>
                    <p className="text-sm text-gray-700">{selectedItem.data_source}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 mb-1">Destinatarios</h4>
                    <p className="text-sm text-gray-700">{selectedItem.recipients}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 mb-1">Plazo de Retencion</h4>
                    <p className="text-sm text-gray-700">{selectedItem.retention_period}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 mb-1">Areas con Acceso</h4>
                    <p className="text-sm text-gray-700">{selectedItem.access_areas}</p>
                  </div>
                </div>

                {selectedItem.notes && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <h4 className="text-sm font-semibold text-yellow-800">Observaciones</h4>
                    </div>
                    <p className="text-sm text-yellow-700">{selectedItem.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Side info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-500" />
                    Informacion Tecnica
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-500">Departamento</p>
                    <p className="text-sm text-gray-700">{selectedItem.department}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500">Responsable Interno</p>
                    <p className="text-sm text-gray-700">{selectedItem.internal_responsible}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500">Plataforma / Sistema</p>
                    <p className="text-sm text-gray-700">{selectedItem.platform_system}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500">Infraestructura</p>
                    <p className="text-sm text-gray-700">{selectedItem.storage_infrastructure}</p>
                  </div>
                </CardContent>
              </Card>

              {selectedItem.international_transfer && (
                <Card className="border-orange-200 bg-orange-50/30">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Globe className="h-4 w-4 text-orange-600" />
                      Transferencia Internacional
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500">Pais de Destino</p>
                      <p className="text-sm text-gray-700">{selectedItem.transfer_country}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500">Entidad Receptora</p>
                      <p className="text-sm text-gray-700">{selectedItem.transfer_entity}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    Registro
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Creado</span>
                    <span className="text-gray-700">{selectedItem.created_at}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Actualizado</span>
                    <span className="text-gray-700">{selectedItem.updated_at}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AppShell>
    )
  }

  // ---------- Main List View ----------
  return (
    <AppShell>
      <Header
        title="Inventario de Datos Personales"
        subtitle="Levantamiento y mapeo de datos personales - Ley 21.719"
        actions={
          <Button onClick={openCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Agregar Registro
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            title="Total Registros"
            value={totalRecords}
            icon={Database}
            iconColor="text-blue-600 bg-blue-50"
          />
          <StatCard
            title="Datos Personales"
            value={personalCount}
            icon={FileText}
            iconColor="text-blue-600 bg-blue-50"
          />
          <StatCard
            title="Datos Sensibles"
            value={sensibleCount}
            icon={Shield}
            iconColor="text-purple-600 bg-purple-50"
          />
          <StatCard
            title="Datos Biometricos"
            value={biometricoCount}
            icon={Shield}
            iconColor="text-red-600 bg-red-50"
          />
          <StatCard
            title="Riesgo Alto/Critico"
            value={highRiskCount}
            icon={AlertTriangle}
            iconColor="text-orange-600 bg-orange-50"
          />
          <StatCard
            title="Transf. Internacional"
            value={transferCount}
            icon={Globe}
            iconColor="text-indigo-600 bg-indigo-50"
          />
        </div>

        {/* Filter Bar */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre, departamento, responsable..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtros
                <ChevronDown className={`h-3 w-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </Button>
            </div>
            {showFilters && (
              <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-gray-500">Categoria:</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value as DataCategory | "")}
                    className="text-sm border border-gray-200 rounded-md px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todas</option>
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-gray-500">Nivel de Riesgo:</label>
                  <select
                    value={filterRisk}
                    onChange={(e) => setFilterRisk(e.target.value as RiskLevel | "")}
                    className="text-sm border border-gray-200 rounded-md px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todos</option>
                    {RISK_OPTIONS.map((r) => (
                      <option key={r} value={r}>{RISK_LABELS[r]}</option>
                    ))}
                  </select>
                </div>
                {(filterCategory || filterRisk || searchTerm) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFilterCategory("")
                      setFilterRisk("")
                      setSearchTerm("")
                    }}
                    className="text-xs text-gray-500"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Limpiar filtros
                  </Button>
                )}
                <span className="ml-auto text-xs text-gray-400">
                  {filtered.length} de {data.length} registros
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre del Dato</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoria</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Finalidad</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Base Legal</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Departamento</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Riesgo</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Transf.</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-gray-400">
                        <Database className="h-8 w-8 mx-auto mb-2 opacity-40" />
                        <p className="text-sm">No se encontraron registros</p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                        onClick={() => setSelectedItem(item)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-900">{item.data_name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={getCategoryColor(item.data_category)}>
                            {CATEGORY_LABELS[item.data_category]}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <p className="text-sm text-gray-600 truncate max-w-[250px]">{item.purpose}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-700">{LEGAL_BASIS_LABELS[item.legal_basis]}</span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-sm text-gray-600">{item.department}</span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={getRiskColor(item.risk_level)}>
                            {RISK_LABELS[item.risk_level]}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {item.international_transfer ? (
                            <Globe className="h-4 w-4 text-orange-500 mx-auto" />
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setSelectedItem(item)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="Ver detalle"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => openEdit(item)}
                              className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                              title="Editar"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal Overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto mx-4">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-lg font-bold text-gray-900">
                {editingItem ? "Editar Registro" : "Nuevo Registro de Datos"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Basic info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Dato *</label>
                  <Input
                    value={form.data_name}
                    onChange={(e) => setForm({ ...form, data_name: e.target.value })}
                    placeholder="Ej: Datos de colaboradores"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripcion</label>
                  <Textarea
                    value={form.data_description}
                    onChange={(e) => setForm({ ...form, data_description: e.target.value })}
                    placeholder="Descripcion detallada de los datos tratados..."
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                  <select
                    value={form.data_category}
                    onChange={(e) => setForm({ ...form, data_category: e.target.value as DataCategory })}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                  <Input
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    placeholder="Ej: Recursos Humanos"
                  />
                </div>
              </div>

              {/* Legal */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gray-500" />
                  Base Legal y Finalidad
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Finalidad del Tratamiento *</label>
                    <Textarea
                      value={form.purpose}
                      onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                      placeholder="Proposito para el cual se tratan los datos..."
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Base Legal *</label>
                    <select
                      value={form.legal_basis}
                      onChange={(e) => setForm({ ...form, legal_basis: e.target.value as LegalBasis })}
                      className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {LEGAL_BASIS_OPTIONS.map((lb) => (
                        <option key={lb} value={lb}>{LEGAL_BASIS_LABELS[lb]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Detalle Base Legal</label>
                    <Input
                      value={form.legal_basis_detail}
                      onChange={(e) => setForm({ ...form, legal_basis_detail: e.target.value })}
                      placeholder="Articulo o ley especifica..."
                    />
                  </div>
                </div>
              </div>

              {/* Data flow */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  Flujo de Datos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Origen de los Datos</label>
                    <Input
                      value={form.data_source}
                      onChange={(e) => setForm({ ...form, data_source: e.target.value })}
                      placeholder="Ej: Formulario web, recopilacion directa..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destinatarios</label>
                    <Input
                      value={form.recipients}
                      onChange={(e) => setForm({ ...form, recipients: e.target.value })}
                      placeholder="Ej: SII, AFP, proveedores..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Responsable Interno</label>
                    <Input
                      value={form.internal_responsible}
                      onChange={(e) => setForm({ ...form, internal_responsible: e.target.value })}
                      placeholder="Nombre y cargo del responsable"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plazo de Retencion</label>
                    <Input
                      value={form.retention_period}
                      onChange={(e) => setForm({ ...form, retention_period: e.target.value })}
                      placeholder="Ej: 5 anos, hasta revocacion..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Areas con Acceso</label>
                    <Input
                      value={form.access_areas}
                      onChange={(e) => setForm({ ...form, access_areas: e.target.value })}
                      placeholder="Ej: RRHH, Finanzas, TI"
                    />
                  </div>
                </div>
              </div>

              {/* Technical */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Database className="h-4 w-4 text-gray-500" />
                  Informacion Tecnica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plataforma / Sistema</label>
                    <Input
                      value={form.platform_system}
                      onChange={(e) => setForm({ ...form, platform_system: e.target.value })}
                      placeholder="Ej: SAP, Salesforce, Excel..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Infraestructura de Almacenamiento</label>
                    <Input
                      value={form.storage_infrastructure}
                      onChange={(e) => setForm({ ...form, storage_infrastructure: e.target.value })}
                      placeholder="Ej: Cloud AWS, servidor on-premise..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de Riesgo</label>
                    <select
                      value={form.risk_level}
                      onChange={(e) => setForm({ ...form, risk_level: e.target.value as RiskLevel })}
                      className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {RISK_OPTIONS.map((r) => (
                        <option key={r} value={r}>{RISK_LABELS[r]}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* International transfer */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  Transferencia Internacional
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.international_transfer}
                      onChange={(e) => setForm({ ...form, international_transfer: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Este dato se transfiere internacionalmente</span>
                  </label>
                  {form.international_transfer && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pais de Destino</label>
                        <Input
                          value={form.transfer_country}
                          onChange={(e) => setForm({ ...form, transfer_country: e.target.value })}
                          placeholder="Ej: Estados Unidos, Brasil..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Entidad Receptora</label>
                        <Input
                          value={form.transfer_entity}
                          onChange={(e) => setForm({ ...form, transfer_entity: e.target.value })}
                          placeholder="Ej: Amazon Web Services Inc."
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="border-t border-gray-100 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Notas adicionales, recomendaciones de cumplimiento..."
                  rows={3}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3 rounded-b-xl">
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={!form.data_name.trim() || !form.purpose.trim()}>
                {editingItem ? "Guardar Cambios" : "Crear Registro"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}

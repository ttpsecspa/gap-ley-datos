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
import { getStatusColor, formatDate } from "@/lib/utils"
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  Download,
  Upload,
  FileCheck,
  FilePlus2,
} from "lucide-react"

// --- Types ---

type TipoDocumento = "CATALOGO" | "POLITICA" | "PROTOCOLO" | "PROCEDIMIENTO" | "ACTA" | "OTRO"
type EstadoDocumento = "BORRADOR" | "EN_REVISION" | "APROBADO" | "VIGENTE" | "OBSOLETO"

interface VersionHistorial {
  version: string
  fecha: string
  autor: string
  cambios: string
}

interface Documento {
  id: string
  tipo: TipoDocumento
  titulo: string
  descripcion: string
  contenido: string
  version: string
  estado: EstadoDocumento
  creado_por: string
  aprobado_por: string | null
  fecha_creacion: string
  fecha_aprobacion: string | null
  vigente_hasta: string | null
  historial: VersionHistorial[]
}

// --- Mock Data ---

const mockDocumentos: Documento[] = [
  {
    id: "1",
    tipo: "POLITICA",
    titulo: "Política de Privacidad",
    descripcion: "Política general de privacidad de la organización conforme a la Ley 21.719",
    contenido: "Contenido de la política de privacidad...",
    version: "2.1",
    estado: "VIGENTE",
    creado_por: "María González",
    aprobado_por: "Carlos Méndez",
    fecha_creacion: "2025-11-15",
    fecha_aprobacion: "2025-12-01",
    vigente_hasta: "2026-12-01",
    historial: [
      { version: "1.0", fecha: "2025-06-01", autor: "María González", cambios: "Versión inicial" },
      { version: "2.0", fecha: "2025-09-15", autor: "María González", cambios: "Adecuación a Ley 21.719" },
      { version: "2.1", fecha: "2025-11-15", autor: "María González", cambios: "Ajustes menores y revisión legal" },
    ],
  },
  {
    id: "2",
    tipo: "POLITICA",
    titulo: "Política de Protección de Datos",
    descripcion: "Marco normativo interno para la protección de datos personales",
    contenido: "Contenido de la política de protección de datos...",
    version: "1.2",
    estado: "APROBADO",
    creado_por: "María González",
    aprobado_por: "Carlos Méndez",
    fecha_creacion: "2025-10-20",
    fecha_aprobacion: "2026-01-10",
    vigente_hasta: null,
    historial: [
      { version: "1.0", fecha: "2025-10-20", autor: "María González", cambios: "Versión inicial" },
      { version: "1.2", fecha: "2025-12-05", autor: "Ana Torres", cambios: "Incorporación de categorías especiales" },
    ],
  },
  {
    id: "3",
    tipo: "PROTOCOLO",
    titulo: "Protocolo de Derechos ARCO",
    descripcion: "Procedimiento para ejercicio de derechos de Acceso, Rectificación, Cancelación y Oposición",
    contenido: "Contenido del protocolo ARCO...",
    version: "1.0",
    estado: "EN_REVISION",
    creado_por: "Ana Torres",
    aprobado_por: null,
    fecha_creacion: "2026-01-20",
    fecha_aprobacion: null,
    vigente_hasta: null,
    historial: [
      { version: "1.0", fecha: "2026-01-20", autor: "Ana Torres", cambios: "Versión inicial para revisión" },
    ],
  },
  {
    id: "4",
    tipo: "PROTOCOLO",
    titulo: "Protocolo de Brechas de Seguridad",
    descripcion: "Plan de respuesta ante incidentes y brechas de seguridad de datos personales",
    contenido: "Contenido del protocolo de brechas...",
    version: "1.1",
    estado: "VIGENTE",
    creado_por: "Pedro Ramírez",
    aprobado_por: "Carlos Méndez",
    fecha_creacion: "2025-12-01",
    fecha_aprobacion: "2026-01-15",
    vigente_hasta: "2027-01-15",
    historial: [
      { version: "1.0", fecha: "2025-12-01", autor: "Pedro Ramírez", cambios: "Versión inicial" },
      { version: "1.1", fecha: "2025-12-20", autor: "Pedro Ramírez", cambios: "Tiempos de notificación ajustados" },
    ],
  },
  {
    id: "5",
    tipo: "PROCEDIMIENTO",
    titulo: "Procedimiento de Consentimiento",
    descripcion: "Mecanismos y flujos para la obtención y gestión del consentimiento informado",
    contenido: "Contenido del procedimiento de consentimiento...",
    version: "0.3",
    estado: "BORRADOR",
    creado_por: "Lucía Herrera",
    aprobado_por: null,
    fecha_creacion: "2026-02-10",
    fecha_aprobacion: null,
    vigente_hasta: null,
    historial: [
      { version: "0.1", fecha: "2026-02-10", autor: "Lucía Herrera", cambios: "Borrador inicial" },
      { version: "0.2", fecha: "2026-02-20", autor: "Lucía Herrera", cambios: "Incorporación de formularios" },
      { version: "0.3", fecha: "2026-03-01", autor: "Lucía Herrera", cambios: "Revisión de flujos digitales" },
    ],
  },
  {
    id: "6",
    tipo: "CATALOGO",
    titulo: "Catálogo de Bases de Datos",
    descripcion: "Inventario de todas las bases de datos personales de la organización",
    contenido: "Contenido del catálogo de bases de datos...",
    version: "3.0",
    estado: "VIGENTE",
    creado_por: "Pedro Ramírez",
    aprobado_por: "Carlos Méndez",
    fecha_creacion: "2025-08-01",
    fecha_aprobacion: "2025-09-01",
    vigente_hasta: "2026-09-01",
    historial: [
      { version: "1.0", fecha: "2025-08-01", autor: "Pedro Ramírez", cambios: "Inventario inicial" },
      { version: "2.0", fecha: "2025-10-01", autor: "Pedro Ramírez", cambios: "Nuevas bases incorporadas" },
      { version: "3.0", fecha: "2025-12-15", autor: "Pedro Ramírez", cambios: "Actualización completa" },
    ],
  },
  {
    id: "7",
    tipo: "ACTA",
    titulo: "Acta Comité de Datos",
    descripcion: "Acta de la sesión ordinaria del Comité de Protección de Datos - Marzo 2026",
    contenido: "Contenido del acta del comité...",
    version: "1.0",
    estado: "APROBADO",
    creado_por: "Lucía Herrera",
    aprobado_por: "Carlos Méndez",
    fecha_creacion: "2026-03-05",
    fecha_aprobacion: "2026-03-10",
    vigente_hasta: null,
    historial: [
      { version: "1.0", fecha: "2026-03-05", autor: "Lucía Herrera", cambios: "Acta sesión marzo 2026" },
    ],
  },
  {
    id: "8",
    tipo: "POLITICA",
    titulo: "Política de Transferencia Internacional",
    descripcion: "Normas para transferencia internacional de datos personales según Art. 27-28",
    contenido: "Contenido de la política de transferencia internacional...",
    version: "0.2",
    estado: "BORRADOR",
    creado_por: "Ana Torres",
    aprobado_por: null,
    fecha_creacion: "2026-03-01",
    fecha_aprobacion: null,
    vigente_hasta: null,
    historial: [
      { version: "0.1", fecha: "2026-03-01", autor: "Ana Torres", cambios: "Borrador inicial" },
      { version: "0.2", fecha: "2026-03-12", autor: "Ana Torres", cambios: "Cláusulas tipo incorporadas" },
    ],
  },
  {
    id: "9",
    tipo: "PROCEDIMIENTO",
    titulo: "Procedimiento de Evaluación de Impacto",
    descripcion: "Metodología para realizar Evaluaciones de Impacto en Protección de Datos (EIPD)",
    contenido: "Contenido del procedimiento EIPD...",
    version: "1.0",
    estado: "EN_REVISION",
    creado_por: "María González",
    aprobado_por: null,
    fecha_creacion: "2026-02-15",
    fecha_aprobacion: null,
    vigente_hasta: null,
    historial: [
      { version: "1.0", fecha: "2026-02-15", autor: "María González", cambios: "Versión para revisión del comité" },
    ],
  },
  {
    id: "10",
    tipo: "OTRO",
    titulo: "Registro de Actividades de Tratamiento",
    descripcion: "Registro obligatorio de actividades de tratamiento de datos personales",
    contenido: "Contenido del registro de actividades...",
    version: "2.0",
    estado: "VIGENTE",
    creado_por: "Pedro Ramírez",
    aprobado_por: "Carlos Méndez",
    fecha_creacion: "2025-09-10",
    fecha_aprobacion: "2025-10-01",
    vigente_hasta: "2026-10-01",
    historial: [
      { version: "1.0", fecha: "2025-09-10", autor: "Pedro Ramírez", cambios: "Registro inicial" },
      { version: "2.0", fecha: "2025-11-20", autor: "Pedro Ramírez", cambios: "Actualización semestral" },
    ],
  },
]

const TIPOS_DOCUMENTO: { value: TipoDocumento | "TODOS"; label: string }[] = [
  { value: "TODOS", label: "Todos" },
  { value: "CATALOGO", label: "Catálogo" },
  { value: "POLITICA", label: "Política" },
  { value: "PROTOCOLO", label: "Protocolo" },
  { value: "PROCEDIMIENTO", label: "Procedimiento" },
  { value: "ACTA", label: "Acta" },
  { value: "OTRO", label: "Otro" },
]

const ESTADOS_DOCUMENTO: EstadoDocumento[] = ["BORRADOR", "EN_REVISION", "APROBADO", "VIGENTE", "OBSOLETO"]

const estadoLabel: Record<EstadoDocumento, string> = {
  BORRADOR: "Borrador",
  EN_REVISION: "En revisión",
  APROBADO: "Aprobado",
  VIGENTE: "Vigente",
  OBSOLETO: "Obsoleto",
}

const tipoLabel: Record<TipoDocumento, string> = {
  CATALOGO: "Catálogo",
  POLITICA: "Política",
  PROTOCOLO: "Protocolo",
  PROCEDIMIENTO: "Procedimiento",
  ACTA: "Acta",
  OTRO: "Otro",
}

const siguienteEstado: Partial<Record<EstadoDocumento, EstadoDocumento>> = {
  BORRADOR: "EN_REVISION",
  EN_REVISION: "APROBADO",
  APROBADO: "VIGENTE",
}

const accionEstado: Partial<Record<EstadoDocumento, string>> = {
  BORRADOR: "Enviar a revisión",
  EN_REVISION: "Aprobar",
  APROBADO: "Publicar como vigente",
}

// --- Component ---

export default function DocumentosPage() {
  const [documentos, setDocumentos] = useState<Documento[]>(mockDocumentos)
  const [filtroTipo, setFiltroTipo] = useState<TipoDocumento | "TODOS">("TODOS")
  const [busqueda, setBusqueda] = useState("")
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [documentoDetalle, setDocumentoDetalle] = useState<Documento | null>(null)
  const [mostrarHistorial, setMostrarHistorial] = useState<string | null>(null)

  // Form state
  const [formTipo, setFormTipo] = useState<TipoDocumento>("POLITICA")
  const [formTitulo, setFormTitulo] = useState("")
  const [formDescripcion, setFormDescripcion] = useState("")
  const [formContenido, setFormContenido] = useState("")
  const [formVersion, setFormVersion] = useState("0.1")

  // Stats
  const totalDocs = documentos.length
  const porTipo = TIPOS_DOCUMENTO.filter(t => t.value !== "TODOS").map(t => ({
    tipo: t.label,
    count: documentos.filter(d => d.tipo === t.value).length,
  })).filter(t => t.count > 0)
  const vigentes = documentos.filter(d => d.estado === "VIGENTE").length
  const enRevision = documentos.filter(d => d.estado === "EN_REVISION").length
  const borradores = documentos.filter(d => d.estado === "BORRADOR").length

  // Filtered docs
  const documentosFiltrados = documentos.filter(d => {
    const matchTipo = filtroTipo === "TODOS" || d.tipo === filtroTipo
    const matchBusqueda = busqueda === "" ||
      d.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      d.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    return matchTipo && matchBusqueda
  })

  // Handlers
  const handleCrearDocumento = () => {
    if (!formTitulo.trim()) return
    const nuevo: Documento = {
      id: String(Date.now()),
      tipo: formTipo,
      titulo: formTitulo,
      descripcion: formDescripcion,
      contenido: formContenido,
      version: formVersion,
      estado: "BORRADOR",
      creado_por: "Usuario Actual",
      aprobado_por: null,
      fecha_creacion: new Date().toISOString().split("T")[0],
      fecha_aprobacion: null,
      vigente_hasta: null,
      historial: [
        { version: formVersion, fecha: new Date().toISOString().split("T")[0], autor: "Usuario Actual", cambios: "Versión inicial" },
      ],
    }
    setDocumentos(prev => [nuevo, ...prev])
    setFormTitulo("")
    setFormDescripcion("")
    setFormContenido("")
    setFormVersion("0.1")
    setMostrarFormulario(false)
  }

  const handleAvanzarEstado = (id: string) => {
    setDocumentos(prev =>
      prev.map(d => {
        if (d.id !== id) return d
        const nuevoEstado = siguienteEstado[d.estado]
        if (!nuevoEstado) return d
        return {
          ...d,
          estado: nuevoEstado,
          aprobado_por: nuevoEstado === "APROBADO" || nuevoEstado === "VIGENTE" ? "Carlos Méndez" : d.aprobado_por,
          fecha_aprobacion: nuevoEstado === "APROBADO" ? new Date().toISOString().split("T")[0] : d.fecha_aprobacion,
        }
      })
    )
  }

  const handleEliminar = (id: string) => {
    setDocumentos(prev => prev.filter(d => d.id !== id))
    if (documentoDetalle?.id === id) setDocumentoDetalle(null)
  }

  return (
    <AppShell>
      <Header
        title="Documentos"
        subtitle="Gestión de documentos de cumplimiento - Ley 21.719"
        actions={
          <Button onClick={() => setMostrarFormulario(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Documento
          </Button>
        }
      />
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Documentos"
            value={totalDocs}
            icon={FileText}
            iconColor="text-blue-600 bg-blue-50"
          />
          <StatCard
            title="Vigentes"
            value={vigentes}
            icon={FileCheck}
            iconColor="text-green-600 bg-green-50"
          />
          <StatCard
            title="En Revisión"
            value={enRevision}
            icon={Clock}
            iconColor="text-blue-600 bg-blue-50"
          />
          <StatCard
            title="Borradores"
            value={borradores}
            icon={FilePlus2}
            iconColor="text-yellow-600 bg-yellow-50"
          />
        </div>

        {/* Tipos breakdown */}
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <Filter className="h-4 w-4" /> Por tipo:
              </span>
              {porTipo.map(t => (
                <Badge key={t.tipo} variant="outline" className="text-xs">
                  {t.tipo}: {t.count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar documentos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            {TIPOS_DOCUMENTO.map(t => (
              <Button
                key={t.value}
                variant={filtroTipo === t.value ? "default" : "ghost"}
                size="sm"
                onClick={() => setFiltroTipo(t.value)}
                className="text-xs"
              >
                {t.label}
              </Button>
            ))}
          </div>
        </div>

        {/* New Document Form */}
        {mostrarFormulario && (
          <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FilePlus2 className="h-5 w-5 text-blue-600" />
                Nuevo Documento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tipo de Documento</label>
                  <select
                    value={formTipo}
                    onChange={(e) => setFormTipo(e.target.value as TipoDocumento)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {TIPOS_DOCUMENTO.filter(t => t.value !== "TODOS").map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Versión</label>
                  <Input
                    value={formVersion}
                    onChange={(e) => setFormVersion(e.target.value)}
                    placeholder="0.1"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Título</label>
                  <Input
                    value={formTitulo}
                    onChange={(e) => setFormTitulo(e.target.value)}
                    placeholder="Título del documento"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Descripción</label>
                  <Input
                    value={formDescripcion}
                    onChange={(e) => setFormDescripcion(e.target.value)}
                    placeholder="Descripción breve del documento"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Contenido</label>
                  <Textarea
                    value={formContenido}
                    onChange={(e) => setFormContenido(e.target.value)}
                    placeholder="Contenido del documento (editor de texto enriquecido próximamente)..."
                    rows={6}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <Button variant="ghost" onClick={() => setMostrarFormulario(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCrearDocumento} className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Crear Documento
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Document Detail View */}
        {documentoDetalle && (
          <Card className="border-indigo-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    {documentoDetalle.titulo}
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">{documentoDetalle.descripcion}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setDocumentoDetalle(null)}>
                  Cerrar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Tipo</p>
                  <p className="text-sm font-medium">{tipoLabel[documentoDetalle.tipo]}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Versión</p>
                  <p className="text-sm font-medium">v{documentoDetalle.version}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Estado</p>
                  <Badge className={getStatusColor(documentoDetalle.estado)}>
                    {estadoLabel[documentoDetalle.estado]}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Creado por</p>
                  <p className="text-sm font-medium">{documentoDetalle.creado_por}</p>
                </div>
                {documentoDetalle.aprobado_por && (
                  <div>
                    <p className="text-xs text-gray-500">Aprobado por</p>
                    <p className="text-sm font-medium">{documentoDetalle.aprobado_por}</p>
                  </div>
                )}
                {documentoDetalle.fecha_aprobacion && (
                  <div>
                    <p className="text-xs text-gray-500">Fecha aprobación</p>
                    <p className="text-sm font-medium">{formatDate(documentoDetalle.fecha_aprobacion)}</p>
                  </div>
                )}
                {documentoDetalle.vigente_hasta && (
                  <div>
                    <p className="text-xs text-gray-500">Vigente hasta</p>
                    <p className="text-sm font-medium">{formatDate(documentoDetalle.vigente_hasta)}</p>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-xs text-gray-500 mb-2 font-medium">Contenido</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{documentoDetalle.contenido}</p>
              </div>

              {/* Workflow Actions */}
              <div className="flex items-center gap-3">
                {accionEstado[documentoDetalle.estado] && (
                  <Button
                    size="sm"
                    onClick={() => {
                      handleAvanzarEstado(documentoDetalle.id)
                      const nuevoEstado = siguienteEstado[documentoDetalle.estado]
                      if (nuevoEstado) {
                        setDocumentoDetalle({
                          ...documentoDetalle,
                          estado: nuevoEstado,
                          aprobado_por: nuevoEstado === "APROBADO" || nuevoEstado === "VIGENTE" ? "Carlos Méndez" : documentoDetalle.aprobado_por,
                        })
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {accionEstado[documentoDetalle.estado]}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMostrarHistorial(documentoDetalle.id)}
                  className="flex items-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  Ver historial de versiones
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Descargar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Version History Modal */}
        {mostrarHistorial && (
          <Card className="border-purple-200 bg-purple-50/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-purple-600" />
                  Historial de Versiones
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setMostrarHistorial(null)}>
                  Cerrar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {(() => {
                const doc = documentos.find(d => d.id === mostrarHistorial)
                if (!doc) return <p className="text-sm text-gray-500">Documento no encontrado</p>
                return (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-700 mb-3">{doc.titulo}</p>
                    <div className="relative">
                      <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-purple-200" />
                      <div className="space-y-4">
                        {[...doc.historial].reverse().map((h, idx) => (
                          <div key={idx} className="flex items-start gap-4 relative">
                            <div className="h-4 w-4 rounded-full bg-purple-500 border-2 border-white flex-shrink-0 mt-0.5 z-10" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">v{h.version}</Badge>
                                <span className="text-xs text-gray-400">{formatDate(h.fecha)}</span>
                              </div>
                              <p className="text-sm text-gray-700 mt-0.5">{h.cambios}</p>
                              <p className="text-xs text-gray-400 mt-0.5">por {h.autor}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        )}

        {/* Document List */}
        <div className="space-y-3">
          {documentosFiltrados.length === 0 ? (
            <Card className="p-12">
              <div className="text-center text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No se encontraron documentos</p>
                <p className="text-xs text-gray-400 mt-1">Intente con otros filtros o cree un nuevo documento</p>
              </div>
            </Card>
          ) : (
            documentosFiltrados.map(doc => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <h3 className="text-sm font-semibold text-gray-900 truncate">{doc.titulo}</h3>
                        <Badge variant="secondary" className="text-[10px]">
                          {tipoLabel[doc.tipo]}
                        </Badge>
                        <Badge className={`text-[10px] ${getStatusColor(doc.estado)}`}>
                          {estadoLabel[doc.estado]}
                        </Badge>
                        <span className="text-xs text-gray-400">v{doc.version}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2 line-clamp-1">{doc.descripcion}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                        <span>Creado por: {doc.creado_por}</span>
                        <span>{formatDate(doc.fecha_creacion)}</span>
                        {doc.aprobado_por && <span>Aprobado por: {doc.aprobado_por}</span>}
                        {doc.vigente_hasta && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Vigente hasta: {formatDate(doc.vigente_hasta)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDocumentoDetalle(doc)
                          setMostrarHistorial(null)
                        }}
                        title="Ver detalle"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMostrarHistorial(mostrarHistorial === doc.id ? null : doc.id)}
                        title="Historial de versiones"
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                      {accionEstado[doc.estado] && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAvanzarEstado(doc.id)}
                          title={accionEstado[doc.estado]}
                        >
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDocumentoDetalle(doc)
                          setMostrarFormulario(false)
                        }}
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEliminar(doc.id)}
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Workflow Legend */}
        <Card>
          <CardContent className="py-4">
            <p className="text-xs font-medium text-gray-500 mb-2">Flujo de aprobación de documentos</p>
            <div className="flex items-center gap-2 flex-wrap">
              {ESTADOS_DOCUMENTO.map((estado, idx) => (
                <div key={estado} className="flex items-center gap-2">
                  <Badge className={`text-[10px] ${getStatusColor(estado)}`}>
                    {estadoLabel[estado]}
                  </Badge>
                  {idx < ESTADOS_DOCUMENTO.length - 1 && (
                    <span className="text-gray-300 text-xs">&rarr;</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}

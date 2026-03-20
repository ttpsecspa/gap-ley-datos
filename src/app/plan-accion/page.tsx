"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ProgressBar } from "@/components/ui/progress-bar"
import { StatCard } from "@/components/ui/stat-card"
import { getStatusColor, formatDate } from "@/lib/utils"
import {
  ListTodo,
  Plus,
  Calendar,
  User,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Filter,
  LayoutGrid,
  List,
  ArrowUpDown,
  X,
  BarChart3,
  Edit2,
  Trash2,
} from "lucide-react"

// ── Types ──────────────────────────────────────────────────────────────────

type Priority = "CRITICA" | "ALTA" | "MEDIA" | "BAJA"
type ActionStatus = "PENDIENTE" | "EN_PROGRESO" | "COMPLETADA" | "VENCIDA" | "CANCELADA"
type PlanStatus = "BORRADOR" | "ACTIVO" | "COMPLETADO" | "CANCELADO"
type ViewMode = "table" | "kanban" | "timeline"

interface ActionItem {
  id: string
  planId: string
  title: string
  description: string
  priority: Priority
  status: ActionStatus
  responsible: string
  department: string
  dueDate: string
  startDate: string
  completionPercentage: number
}

interface ActionPlan {
  id: string
  name: string
  description: string
  status: PlanStatus
  startDate: string
  endDate: string
  completionPercentage: number
  createdBy: string
}

// ── Mock Data ──────────────────────────────────────────────────────────────

const mockPlans: ActionPlan[] = [
  {
    id: "plan-1",
    name: "Plan de Remediación - Evaluación Inicial",
    description: "Plan de acción derivado de la primera evaluación GAP de cumplimiento Ley 21.719",
    status: "ACTIVO",
    startDate: "2026-01-15",
    endDate: "2026-09-30",
    completionPercentage: 35,
    createdBy: "María González",
  },
  {
    id: "plan-2",
    name: "Plan Correctivo - Auditoría DPO",
    description: "Acciones correctivas identificadas durante la auditoría del Delegado de Protección de Datos",
    status: "BORRADOR",
    startDate: "2026-03-01",
    endDate: "2026-12-15",
    completionPercentage: 10,
    createdBy: "Carlos Méndez",
  },
]

const mockActions: ActionItem[] = [
  {
    id: "act-1",
    planId: "plan-1",
    title: "Implementar política de consentimiento informado",
    description: "Desarrollar e implementar procedimiento de obtención de consentimiento conforme Art. 12-13",
    priority: "CRITICA",
    status: "EN_PROGRESO",
    responsible: "Ana Torres",
    department: "Legal",
    dueDate: "2026-04-15",
    startDate: "2026-02-01",
    completionPercentage: 60,
  },
  {
    id: "act-2",
    planId: "plan-1",
    title: "Crear procedimiento de derechos ARCO-POB",
    description: "Procedimiento para atender solicitudes de acceso, rectificación, cancelación, oposición, portabilidad y bloqueo",
    priority: "CRITICA",
    status: "PENDIENTE",
    responsible: "Luis Herrera",
    department: "Legal",
    dueDate: "2026-05-01",
    startDate: "2026-03-15",
    completionPercentage: 0,
  },
  {
    id: "act-3",
    planId: "plan-1",
    title: "Registrar bases de datos personales en catálogo",
    description: "Inventariar y registrar todas las bases de datos que contienen datos personales",
    priority: "ALTA",
    status: "EN_PROGRESO",
    responsible: "Pedro Soto",
    department: "TI",
    dueDate: "2026-04-01",
    startDate: "2026-01-20",
    completionPercentage: 75,
  },
  {
    id: "act-4",
    planId: "plan-1",
    title: "Evaluar transferencias internacionales de datos",
    description: "Mapear y evaluar todas las transferencias internacionales conforme Art. 27-28",
    priority: "ALTA",
    status: "VENCIDA",
    responsible: "María González",
    department: "Compliance",
    dueDate: "2026-03-15",
    startDate: "2026-01-15",
    completionPercentage: 40,
  },
  {
    id: "act-5",
    planId: "plan-1",
    title: "Implementar medidas de seguridad técnicas",
    description: "Cifrado, control de acceso y medidas técnicas de protección de datos Art. 14 quinquies",
    priority: "ALTA",
    status: "PENDIENTE",
    responsible: "Jorge Díaz",
    department: "TI",
    dueDate: "2026-06-30",
    startDate: "2026-04-01",
    completionPercentage: 0,
  },
  {
    id: "act-6",
    planId: "plan-1",
    title: "Capacitar al personal en protección de datos",
    description: "Programa de capacitación para todos los colaboradores sobre la nueva ley",
    priority: "MEDIA",
    status: "COMPLETADA",
    responsible: "Claudia Reyes",
    department: "RRHH",
    dueDate: "2026-03-01",
    startDate: "2026-01-15",
    completionPercentage: 100,
  },
  {
    id: "act-7",
    planId: "plan-2",
    title: "Nombrar DPO formalmente ante la Agencia",
    description: "Designar y registrar formalmente al Delegado de Protección de Datos",
    priority: "CRITICA",
    status: "EN_PROGRESO",
    responsible: "Carlos Méndez",
    department: "Dirección",
    dueDate: "2026-04-30",
    startDate: "2026-03-01",
    completionPercentage: 50,
  },
  {
    id: "act-8",
    planId: "plan-2",
    title: "Elaborar protocolo de notificación de brechas",
    description: "Crear procedimiento de notificación de brechas de seguridad dentro de 72 horas",
    priority: "ALTA",
    status: "PENDIENTE",
    responsible: "Jorge Díaz",
    department: "TI",
    dueDate: "2026-05-15",
    startDate: "2026-04-01",
    completionPercentage: 0,
  },
  {
    id: "act-9",
    planId: "plan-2",
    title: "Realizar Evaluación de Impacto (EIPD)",
    description: "Evaluación de impacto en protección de datos para tratamientos de alto riesgo",
    priority: "MEDIA",
    status: "PENDIENTE",
    responsible: "Ana Torres",
    department: "Legal",
    dueDate: "2026-07-01",
    startDate: "2026-05-01",
    completionPercentage: 0,
  },
  {
    id: "act-10",
    planId: "plan-2",
    title: "Actualizar contratos con encargados de tratamiento",
    description: "Revisar y actualizar cláusulas de protección de datos en contratos con proveedores",
    priority: "BAJA",
    status: "PENDIENTE",
    responsible: "Luis Herrera",
    department: "Legal",
    dueDate: "2026-08-01",
    startDate: "2026-06-01",
    completionPercentage: 0,
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────

const priorityOrder: Record<Priority, number> = { CRITICA: 0, ALTA: 1, MEDIA: 2, BAJA: 3 }

const priorityLabel: Record<Priority, string> = {
  CRITICA: "Crítica",
  ALTA: "Alta",
  MEDIA: "Media",
  BAJA: "Baja",
}

const statusLabel: Record<ActionStatus, string> = {
  PENDIENTE: "Pendiente",
  EN_PROGRESO: "En progreso",
  COMPLETADA: "Completada",
  VENCIDA: "Vencida",
  CANCELADA: "Cancelada",
}

const planStatusLabel: Record<PlanStatus, string> = {
  BORRADOR: "Borrador",
  ACTIVO: "Activo",
  COMPLETADO: "Completado",
  CANCELADO: "Cancelado",
}

const priorityBadgeVariant = (p: Priority) => {
  switch (p) {
    case "CRITICA": return "destructive" as const
    case "ALTA": return "warning" as const
    case "MEDIA": return "default" as const
    case "BAJA": return "secondary" as const
  }
}

const emptyAction: Omit<ActionItem, "id"> = {
  planId: "",
  title: "",
  description: "",
  priority: "MEDIA",
  status: "PENDIENTE",
  responsible: "",
  department: "",
  dueDate: "",
  startDate: "",
  completionPercentage: 0,
}

// ── Component ──────────────────────────────────────────────────────────────

export default function PlanAccionPage() {
  const [plans] = useState<ActionPlan[]>(mockPlans)
  const [actions, setActions] = useState<ActionItem[]>(mockActions)
  const [selectedPlanId, setSelectedPlanId] = useState<string>(mockPlans[0].id)
  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const [showModal, setShowModal] = useState(false)
  const [editingAction, setEditingAction] = useState<ActionItem | null>(null)
  const [formData, setFormData] = useState<Omit<ActionItem, "id">>(emptyAction)
  const [filterPriority, setFilterPriority] = useState<Priority | "TODAS">("TODAS")
  const [sortField, setSortField] = useState<"dueDate" | "priority">("dueDate")

  const selectedPlan = plans.find((p) => p.id === selectedPlanId)!
  const planActions = actions.filter((a) => a.planId === selectedPlanId)

  // Filtered & sorted
  const filteredActions = planActions
    .filter((a) => filterPriority === "TODAS" || a.priority === filterPriority)
    .sort((a, b) => {
      if (sortField === "priority") return priorityOrder[a.priority] - priorityOrder[b.priority]
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })

  // Stats
  const allActions = actions
  const totalPlans = plans.length
  const pendientes = allActions.filter((a) => a.status === "PENDIENTE").length
  const enProgreso = allActions.filter((a) => a.status === "EN_PROGRESO").length
  const completadas = allActions.filter((a) => a.status === "COMPLETADA").length
  const vencidas = allActions.filter((a) => a.status === "VENCIDA").length

  // ── Modal handlers ───────────────────────────────────────────────────────

  const openCreateModal = () => {
    setEditingAction(null)
    setFormData({ ...emptyAction, planId: selectedPlanId })
    setShowModal(true)
  }

  const openEditModal = (action: ActionItem) => {
    setEditingAction(action)
    setFormData({ ...action })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingAction(null)
  }

  const saveAction = () => {
    if (!formData.title.trim()) return
    if (editingAction) {
      setActions((prev) =>
        prev.map((a) => (a.id === editingAction.id ? { ...formData, id: editingAction.id } : a))
      )
    } else {
      const newAction: ActionItem = {
        ...formData,
        id: `act-${Date.now()}`,
        planId: selectedPlanId,
      }
      setActions((prev) => [...prev, newAction])
    }
    closeModal()
  }

  const deleteAction = (id: string) => {
    setActions((prev) => prev.filter((a) => a.id !== id))
  }

  // ── Timeline helpers ─────────────────────────────────────────────────────

  const getTimelineBounds = () => {
    if (filteredActions.length === 0) return { minDate: new Date(), maxDate: new Date(), totalDays: 1 }
    const allDates = filteredActions.flatMap((a) => [new Date(a.startDate), new Date(a.dueDate)])
    const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())))
    const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())))
    const totalDays = Math.max(1, Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)))
    return { minDate, maxDate, totalDays }
  }

  const getBarPosition = (startDate: string, endDate: string) => {
    const { minDate, totalDays } = getTimelineBounds()
    const start = new Date(startDate)
    const end = new Date(endDate)
    const leftDays = Math.ceil((start.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24))
    const widthDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
    const left = (leftDays / totalDays) * 100
    const width = (widthDays / totalDays) * 100
    return { left: `${left}%`, width: `${Math.max(width, 2)}%` }
  }

  const getBarColor = (status: ActionStatus) => {
    switch (status) {
      case "COMPLETADA": return "bg-green-500"
      case "EN_PROGRESO": return "bg-blue-500"
      case "VENCIDA": return "bg-red-500"
      case "CANCELADA": return "bg-gray-400"
      default: return "bg-yellow-400"
    }
  }

  // ── Kanban columns ───────────────────────────────────────────────────────

  const kanbanColumns: { key: ActionStatus; label: string; color: string }[] = [
    { key: "PENDIENTE", label: "Pendiente", color: "border-yellow-400" },
    { key: "EN_PROGRESO", label: "En Progreso", color: "border-blue-400" },
    { key: "COMPLETADA", label: "Completada", color: "border-green-400" },
  ]

  // ── Timeline months ──────────────────────────────────────────────────────

  const getTimelineMonths = () => {
    const { minDate, maxDate } = getTimelineBounds()
    const months: { label: string; left: string }[] = []
    const totalMs = maxDate.getTime() - minDate.getTime()
    if (totalMs === 0) return [{ label: formatDate(minDate), left: "0%" }]
    const current = new Date(minDate.getFullYear(), minDate.getMonth(), 1)
    while (current <= maxDate) {
      const offset = ((current.getTime() - minDate.getTime()) / totalMs) * 100
      months.push({
        label: current.toLocaleDateString("es-CL", { month: "short", year: "2-digit" }),
        left: `${Math.max(0, offset)}%`,
      })
      current.setMonth(current.getMonth() + 1)
    }
    return months
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <AppShell>
      <Header
        title="Plan de Acción"
        subtitle="Gestión de planes de remediación - Ley 21.719"
        actions={
          <Button onClick={openCreateModal} className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva Acción
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* ── Stats ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard title="Total Planes" value={totalPlans} icon={ListTodo} iconColor="text-blue-600 bg-blue-50" />
          <StatCard title="Pendientes" value={pendientes} icon={Clock} iconColor="text-yellow-600 bg-yellow-50" />
          <StatCard title="En Progreso" value={enProgreso} icon={ArrowUpDown} iconColor="text-blue-600 bg-blue-50" />
          <StatCard title="Completadas" value={completadas} icon={CheckCircle2} iconColor="text-green-600 bg-green-50" />
          <StatCard title="Vencidas" value={vencidas} icon={AlertTriangle} iconColor="text-red-600 bg-red-50" />
        </div>

        {/* ── Plan selector ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedPlanId === plan.id ? "ring-2 ring-blue-500 shadow-md" : ""
              }`}
              onClick={() => setSelectedPlanId(plan.id)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{plan.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{plan.description}</p>
                  </div>
                  <Badge className={getStatusColor(plan.status)}>{planStatusLabel[plan.status]}</Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    {plan.createdBy}
                  </span>
                </div>
                <ProgressBar value={plan.completionPercentage} />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Toolbar ─────────────────────────────────────────────────── */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2">
                <ListTodo className="h-5 w-5 text-blue-600" />
                Acciones — {selectedPlan.name}
              </CardTitle>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Priority filter */}
                <div className="flex items-center gap-1">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value as Priority | "TODAS")}
                  >
                    <option value="TODAS">Todas las prioridades</option>
                    <option value="CRITICA">Crítica</option>
                    <option value="ALTA">Alta</option>
                    <option value="MEDIA">Media</option>
                    <option value="BAJA">Baja</option>
                  </select>
                </div>
                {/* Sort */}
                <div className="flex items-center gap-1">
                  <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  <select
                    className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value as "dueDate" | "priority")}
                  >
                    <option value="dueDate">Fecha vencimiento</option>
                    <option value="priority">Prioridad</option>
                  </select>
                </div>
                {/* View mode */}
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-1.5 ${viewMode === "table" ? "bg-blue-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                    title="Vista tabla"
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("kanban")}
                    className={`p-1.5 ${viewMode === "kanban" ? "bg-blue-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                    title="Vista Kanban"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("timeline")}
                    className={`p-1.5 ${viewMode === "timeline" ? "bg-blue-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                    title="Vista línea de tiempo"
                  >
                    <BarChart3 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {filteredActions.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <ListTodo className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No hay acciones que coincidan con el filtro</p>
              </div>
            ) : viewMode === "table" ? (
              /* ── Table view ─────────────────────────────────────────── */
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-3 font-medium text-gray-500">Acción</th>
                      <th className="text-left py-3 px-3 font-medium text-gray-500">Prioridad</th>
                      <th className="text-left py-3 px-3 font-medium text-gray-500">Estado</th>
                      <th className="text-left py-3 px-3 font-medium text-gray-500">Responsable</th>
                      <th className="text-left py-3 px-3 font-medium text-gray-500">Departamento</th>
                      <th className="text-left py-3 px-3 font-medium text-gray-500">Vencimiento</th>
                      <th className="text-left py-3 px-3 font-medium text-gray-500 w-36">Avance</th>
                      <th className="text-right py-3 px-3 font-medium text-gray-500">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredActions.map((action) => (
                      <tr key={action.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-3">
                          <div className="max-w-xs">
                            <p className="font-medium text-gray-900 truncate">{action.title}</p>
                            <p className="text-xs text-gray-400 truncate">{action.description}</p>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <Badge variant={priorityBadgeVariant(action.priority)}>
                            {priorityLabel[action.priority]}
                          </Badge>
                        </td>
                        <td className="py-3 px-3">
                          <Badge className={getStatusColor(action.status)}>
                            {statusLabel[action.status]}
                          </Badge>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-gray-400" />
                            <span className="text-gray-700">{action.responsible}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-gray-600">{action.department}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-gray-400" />
                            <span className={action.status === "VENCIDA" ? "text-red-600 font-medium" : "text-gray-700"}>
                              {formatDate(action.dueDate)}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <ProgressBar value={action.completionPercentage} />
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEditModal(action)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteAction(action.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : viewMode === "kanban" ? (
              /* ── Kanban view ────────────────────────────────────────── */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {kanbanColumns.map((col) => {
                  const colActions = filteredActions.filter((a) => a.status === col.key)
                  return (
                    <div key={col.key} className={`border-t-4 ${col.color} rounded-lg bg-gray-50 p-3`}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-700">{col.label}</h4>
                        <Badge variant="outline" className="text-xs">{colActions.length}</Badge>
                      </div>
                      <div className="space-y-3">
                        {colActions.length === 0 ? (
                          <p className="text-xs text-gray-400 text-center py-6">Sin acciones</p>
                        ) : (
                          colActions.map((action) => (
                            <Card
                              key={action.id}
                              className="cursor-pointer hover:shadow-md transition-shadow"
                              onClick={() => openEditModal(action)}
                            >
                              <CardContent className="p-3">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <p className="text-sm font-medium text-gray-900 line-clamp-2">{action.title}</p>
                                  <Badge variant={priorityBadgeVariant(action.priority)} className="text-[10px] flex-shrink-0">
                                    {priorityLabel[action.priority]}
                                  </Badge>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <User className="h-3 w-3" />
                                    {action.responsible}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(action.dueDate)}
                                  </div>
                                  <ProgressBar value={action.completionPercentage} />
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              /* ── Timeline / Gantt view ──────────────────────────────── */
              <div className="space-y-2">
                {/* Month labels */}
                <div className="relative h-8 mb-2">
                  {getTimelineMonths().map((m, i) => (
                    <span
                      key={i}
                      className="absolute text-[10px] font-medium text-gray-400 uppercase"
                      style={{ left: m.left }}
                    >
                      {m.label}
                    </span>
                  ))}
                </div>
                {/* Today line marker */}
                {(() => {
                  const { minDate, totalDays } = getTimelineBounds()
                  const today = new Date()
                  const daysSinceStart = Math.ceil((today.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24))
                  const todayPct = (daysSinceStart / totalDays) * 100
                  if (todayPct < 0 || todayPct > 100) return null
                  return (
                    <div className="relative h-0">
                      <div
                        className="absolute top-0 bottom-0 w-px bg-red-400 z-10"
                        style={{ left: `${todayPct}%`, height: `${filteredActions.length * 52 + 32}px` }}
                      />
                      <span
                        className="absolute -top-5 text-[10px] text-red-500 font-medium -translate-x-1/2"
                        style={{ left: `${todayPct}%` }}
                      >
                        Hoy
                      </span>
                    </div>
                  )
                })()}
                {/* Bars */}
                {filteredActions.map((action) => {
                  const pos = getBarPosition(action.startDate, action.dueDate)
                  return (
                    <div
                      key={action.id}
                      className="flex items-center gap-3 py-1.5 group cursor-pointer"
                      onClick={() => openEditModal(action)}
                    >
                      <div className="w-48 flex-shrink-0 truncate text-xs font-medium text-gray-700 group-hover:text-blue-600">
                        {action.title}
                      </div>
                      <div className="flex-1 relative h-7 bg-gray-100 rounded-md overflow-hidden">
                        <div
                          className={`absolute top-0.5 bottom-0.5 rounded ${getBarColor(action.status)} opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-end pr-2`}
                          style={{ left: pos.left, width: pos.width }}
                        >
                          <span className="text-[10px] text-white font-medium drop-shadow-sm">
                            {action.completionPercentage}%
                          </span>
                        </div>
                      </div>
                      <div className="w-20 flex-shrink-0 text-xs text-gray-400 text-right">
                        {formatDate(action.dueDate)}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Modal ──────────────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingAction ? "Editar Acción" : "Nueva Acción"}
              </h2>
              <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Nombre de la acción"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Detalle de la acción a realizar"
                  rows={3}
                />
              </div>

              {/* Priority + Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                  <select
                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.priority}
                    onChange={(e) => setFormData((f) => ({ ...f, priority: e.target.value as Priority }))}
                  >
                    <option value="CRITICA">Crítica</option>
                    <option value="ALTA">Alta</option>
                    <option value="MEDIA">Media</option>
                    <option value="BAJA">Baja</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.status}
                    onChange={(e) => setFormData((f) => ({ ...f, status: e.target.value as ActionStatus }))}
                  >
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="EN_PROGRESO">En Progreso</option>
                    <option value="COMPLETADA">Completada</option>
                    <option value="VENCIDA">Vencida</option>
                    <option value="CANCELADA">Cancelada</option>
                  </select>
                </div>
              </div>

              {/* Responsible + Department */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                  <Input
                    value={formData.responsible}
                    onChange={(e) => setFormData((f) => ({ ...f, responsible: e.target.value }))}
                    placeholder="Nombre del responsable"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                  <Input
                    value={formData.department}
                    onChange={(e) => setFormData((f) => ({ ...f, department: e.target.value }))}
                    placeholder="Departamento"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData((f) => ({ ...f, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha vencimiento</label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData((f) => ({ ...f, dueDate: e.target.value }))}
                  />
                </div>
              </div>

              {/* Completion */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Porcentaje de avance: {formData.completionPercentage}%
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={formData.completionPercentage}
                  onChange={(e) => setFormData((f) => ({ ...f, completionPercentage: Number(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <Button variant="outline" onClick={closeModal}>
                Cancelar
              </Button>
              <Button onClick={saveAction} disabled={!formData.title.trim()}>
                {editingAction ? "Guardar Cambios" : "Crear Acción"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}

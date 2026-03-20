"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Header } from "@/components/layout/header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProgressBar } from "@/components/ui/progress-bar"
import {
  ClipboardCheck,
  ShieldAlert,
  UserCheck,
  ListTodo,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
} from "lucide-react"

// Mock data - será reemplazado por Supabase queries
const mockStats = {
  overallScore: 42,
  totalFindings: 23,
  openActions: 15,
  pendingRequests: 3,
  activeBreach: 1,
  inventoryCount: 28,
}

const mockCategoryScores = [
  { name: "Principios de Tratamiento", score: 55, articles: "Art. 3-4" },
  { name: "Derechos de Titulares", score: 30, articles: "Art. 5-11" },
  { name: "Consentimiento", score: 45, articles: "Art. 12-13" },
  { name: "Obligaciones Responsable", score: 35, articles: "Art. 14-14 quater" },
  { name: "Transferencia Internacional", score: 20, articles: "Art. 27-28" },
  { name: "Seguridad de Datos", score: 50, articles: "Art. 14 quinquies" },
  { name: "Datos Sensibles", score: 40, articles: "Art. 16-16 bis" },
  { name: "DPO y Gobernanza", score: 60, articles: "Art. 14 ter-quater" },
]

const mockRecentActions = [
  { id: "1", title: "Implementar política de consentimiento", priority: "CRÍTICA", status: "EN_PROGRESO", dueDate: "2026-04-15" },
  { id: "2", title: "Registrar bases de datos en catálogo", priority: "ALTA", status: "PENDIENTE", dueDate: "2026-04-01" },
  { id: "3", title: "Nombrar DPO formalmente", priority: "ALTA", status: "EN_PROGRESO", dueDate: "2026-03-30" },
  { id: "4", title: "Crear procedimiento ARCO", priority: "MEDIA", status: "PENDIENTE", dueDate: "2026-05-01" },
  { id: "5", title: "Evaluar transferencias internacionales", priority: "ALTA", status: "PENDIENTE", dueDate: "2026-04-20" },
]

const priorityVariant = (p: string) => {
  switch (p) {
    case "CRÍTICA": return "destructive"
    case "ALTA": return "warning"
    case "MEDIA": return "default"
    default: return "secondary"
  }
}

const statusLabel = (s: string) => {
  switch (s) {
    case "EN_PROGRESO": return "En progreso"
    case "PENDIENTE": return "Pendiente"
    case "COMPLETADA": return "Completada"
    default: return s
  }
}

export default function DashboardPage() {
  const score = mockStats.overallScore
  const scoreColor = score >= 80 ? "text-green-600" : score >= 50 ? "text-yellow-600" : "text-red-600"
  const ringColor = score >= 80 ? "stroke-green-500" : score >= 50 ? "stroke-yellow-500" : "stroke-red-500"

  return (
    <AppShell>
      <Header
        title="Dashboard"
        subtitle="Visión general del estado de cumplimiento - Ley 21.719"
      />
      <div className="p-6 space-y-6">
        {/* Score principal + KPIs */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Score circular */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center gap-8">
              <div className="relative">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r="52" fill="none"
                    className={ringColor}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${(score / 100) * 327} 327`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-bold ${scoreColor}`}>{score}%</span>
                  <span className="text-[10px] text-gray-400">Cumplimiento</span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Score Global</h3>
                <p className="text-sm text-gray-500">
                  {score < 50 ? "Nivel crítico - Se requieren acciones inmediatas" :
                   score < 80 ? "Nivel medio - Avance parcial en cumplimiento" :
                   "Buen nivel - Mantener mejora continua"}
                </p>
                <div className="flex gap-2 mt-2">
                  <Badge variant={score >= 80 ? "success" : score >= 50 ? "warning" : "destructive"}>
                    {score >= 80 ? "Cumple" : score >= 50 ? "Parcial" : "No cumple"}
                  </Badge>
                  <Badge variant="outline">{mockStats.totalFindings} hallazgos</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* KPI cards */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard
              title="Acciones Abiertas"
              value={mockStats.openActions}
              icon={ListTodo}
              iconColor="text-orange-600 bg-orange-50"
            />
            <StatCard
              title="Solicitudes ARCO"
              value={mockStats.pendingRequests}
              description="pendientes"
              icon={UserCheck}
              iconColor="text-purple-600 bg-purple-50"
            />
            <StatCard
              title="Brechas Activas"
              value={mockStats.activeBreach}
              icon={ShieldAlert}
              iconColor="text-red-600 bg-red-50"
            />
            <StatCard
              title="Inventario Datos"
              value={mockStats.inventoryCount}
              description="registros"
              icon={ClipboardCheck}
              iconColor="text-blue-600 bg-blue-50"
            />
            <StatCard
              title="Evaluaciones"
              value="2"
              description="completadas"
              icon={TrendingUp}
              iconColor="text-green-600 bg-green-50"
            />
            <StatCard
              title="Plazo Ley"
              value="8 meses"
              description="dic. 2026"
              icon={Clock}
              iconColor="text-indigo-600 bg-indigo-50"
            />
          </div>
        </div>

        {/* Cumplimiento por categoría */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-blue-600" />
              Cumplimiento por Categoría
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCategoryScores.map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                      <span className="text-xs text-gray-400">({cat.articles})</span>
                    </div>
                    <span className={`text-sm font-bold ${
                      cat.score >= 80 ? "text-green-600" : cat.score >= 50 ? "text-yellow-600" : "text-red-600"
                    }`}>
                      {cat.score}%
                    </span>
                  </div>
                  <ProgressBar value={cat.score} showLabel={false} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Acciones prioritarias */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Acciones Prioritarias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockRecentActions.map((action) => (
                  <div key={action.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${
                      action.status === "EN_PROGRESO" ? "bg-blue-500" : "bg-gray-300"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{action.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={priorityVariant(action.priority)} className="text-[10px]">
                          {action.priority}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          Vence: {new Date(action.dueDate).toLocaleDateString("es-CL")}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] flex-shrink-0">
                      {statusLabel(action.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resumen rápido */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Estado de Implementación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: "Política de Privacidad", done: true },
                  { label: "Nombramiento DPO", done: false, inProgress: true },
                  { label: "Catálogo de Bases de Datos", done: false, inProgress: true },
                  { label: "Protocolo ARCO-POB", done: false },
                  { label: "Protocolo Brechas de Seguridad", done: false },
                  { label: "Evaluación de Impacto (EIPD)", done: false },
                  { label: "Contratos con Encargados", done: false },
                  { label: "Consentimiento Informado", done: false },
                  { label: "Transferencia Internacional", done: false },
                  { label: "Capacitación del Personal", done: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.done ? "bg-green-100" : item.inProgress ? "bg-blue-100" : "bg-gray-100"
                    }`}>
                      {item.done ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      ) : item.inProgress ? (
                        <Clock className="h-3 w-3 text-blue-600" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-gray-300" />
                      )}
                    </div>
                    <span className={`text-sm ${item.done ? "text-gray-400 line-through" : "text-gray-700"}`}>
                      {item.label}
                    </span>
                    {item.inProgress && <Badge variant="default" className="text-[10px] ml-auto">En curso</Badge>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}

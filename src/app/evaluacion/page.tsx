"use client"

import { useState } from "react"
import Link from "next/link"
import { AppShell } from "@/components/layout/app-shell"
import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProgressBar } from "@/components/ui/progress-bar"
import { StatCard } from "@/components/ui/stat-card"
import { formatDate, getRiskColor } from "@/lib/utils"
import {
  ClipboardCheck,
  TrendingUp,
  CalendarDays,
  Plus,
  Eye,
  Archive,
  AlertTriangle,
  ChevronRight,
  FileSearch,
} from "lucide-react"

type AssessmentStatus = "BORRADOR" | "EN_PROGRESO" | "COMPLETADA" | "ARCHIVADA"
type RiskLevel = "CRITICO" | "ALTO" | "MEDIO" | "BAJO"

interface Assessment {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  status: AssessmentStatus
  overallScore: number
  riskLevel: RiskLevel
  findingsCount: number
  categoriesCompleted: number
  totalCategories: number
  createdBy: string
}

const statusLabels: Record<AssessmentStatus, string> = {
  BORRADOR: "Borrador",
  EN_PROGRESO: "En Progreso",
  COMPLETADA: "Completada",
  ARCHIVADA: "Archivada",
}

const riskLabels: Record<RiskLevel, string> = {
  CRITICO: "Crítico",
  ALTO: "Alto",
  MEDIO: "Medio",
  BAJO: "Bajo",
}

const mockAssessments: Assessment[] = [
  {
    id: "eval-001",
    name: "Evaluación Inicial Q1 2026",
    description: "Primera evaluación de cumplimiento Ley 21.719 para establecer línea base",
    createdAt: "2026-01-15",
    updatedAt: "2026-02-28",
    status: "COMPLETADA",
    overallScore: 42,
    riskLevel: "ALTO",
    findingsCount: 23,
    categoriesCompleted: 8,
    totalCategories: 8,
    createdBy: "María González",
  },
  {
    id: "eval-002",
    name: "Evaluación de Seguimiento Q2 2026",
    description: "Seguimiento trimestral de avance en implementación de controles",
    createdAt: "2026-03-01",
    updatedAt: "2026-03-18",
    status: "EN_PROGRESO",
    overallScore: 58,
    riskLevel: "MEDIO",
    findingsCount: 15,
    categoriesCompleted: 5,
    totalCategories: 8,
    createdBy: "Carlos Reyes",
  },
  {
    id: "eval-003",
    name: "Pre-evaluación Área Comercial",
    description: "Evaluación preliminar del área comercial antes de la revisión completa",
    createdAt: "2026-03-10",
    updatedAt: "2026-03-10",
    status: "BORRADOR",
    overallScore: 0,
    riskLevel: "ALTO",
    findingsCount: 0,
    categoriesCompleted: 0,
    totalCategories: 8,
    createdBy: "Ana Torres",
  },
]

function getStatusVariant(status: AssessmentStatus) {
  switch (status) {
    case "COMPLETADA": return "success" as const
    case "EN_PROGRESO": return "default" as const
    case "BORRADOR": return "warning" as const
    case "ARCHIVADA": return "secondary" as const
  }
}

function getStatusIcon(status: AssessmentStatus) {
  switch (status) {
    case "COMPLETADA": return ClipboardCheck
    case "EN_PROGRESO": return TrendingUp
    case "BORRADOR": return FileSearch
    case "ARCHIVADA": return Archive
  }
}

export default function EvaluacionPage() {
  const [filter, setFilter] = useState<AssessmentStatus | "TODAS">("TODAS")

  const filteredAssessments = filter === "TODAS"
    ? mockAssessments
    : mockAssessments.filter((a) => a.status === filter)

  const totalAssessments = mockAssessments.length
  const completedAssessments = mockAssessments.filter((a) => a.status === "COMPLETADA")
  const averageScore = completedAssessments.length > 0
    ? Math.round(completedAssessments.reduce((sum, a) => sum + a.overallScore, 0) / completedAssessments.length)
    : 0
  const lastAssessmentDate = mockAssessments
    .filter((a) => a.status === "COMPLETADA")
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]?.updatedAt

  return (
    <AppShell>
      <Header
        title="Evaluaciones GAP"
        subtitle="Gestiona las evaluaciones de cumplimiento de la Ley 21.719"
        actions={
          <Link href="/evaluacion/nueva">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Evaluación
            </Button>
          </Link>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Evaluaciones"
            value={totalAssessments}
            description={`${completedAssessments.length} completadas`}
            icon={ClipboardCheck}
            iconColor="text-blue-600 bg-blue-50"
          />
          <StatCard
            title="Score Promedio"
            value={`${averageScore}%`}
            description="evaluaciones completadas"
            icon={TrendingUp}
            iconColor={averageScore >= 80 ? "text-green-600 bg-green-50" : averageScore >= 50 ? "text-yellow-600 bg-yellow-50" : "text-red-600 bg-red-50"}
          />
          <StatCard
            title="Última Evaluación"
            value={lastAssessmentDate ? formatDate(lastAssessmentDate) : "Sin datos"}
            description="fecha de completado"
            icon={CalendarDays}
            iconColor="text-purple-600 bg-purple-50"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {(["TODAS", "BORRADOR", "EN_PROGRESO", "COMPLETADA", "ARCHIVADA"] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(status)}
            >
              {status === "TODAS" ? "Todas" : statusLabels[status]}
            </Button>
          ))}
        </div>

        {/* Assessment list */}
        <div className="space-y-4">
          {filteredAssessments.length === 0 ? (
            <Card className="p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <FileSearch className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Sin evaluaciones</h3>
                <p className="text-sm text-gray-500 mt-1">
                  No hay evaluaciones con el filtro seleccionado.
                </p>
              </div>
            </Card>
          ) : (
            filteredAssessments.map((assessment) => {
              const StatusIcon = getStatusIcon(assessment.status)
              return (
                <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      {/* Left: Info */}
                      <div className="flex-1 min-w-0 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-50">
                            <StatusIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-gray-900">
                              {assessment.name}
                            </h3>
                            <p className="text-sm text-gray-500">{assessment.description}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <Badge variant={getStatusVariant(assessment.status)}>
                            {statusLabels[assessment.status]}
                          </Badge>
                          {assessment.overallScore > 0 && (
                            <Badge className={getRiskColor(assessment.riskLevel)}>
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Riesgo {riskLabels[assessment.riskLevel]}
                            </Badge>
                          )}
                          {assessment.findingsCount > 0 && (
                            <span className="text-xs text-gray-500">
                              {assessment.findingsCount} hallazgos
                            </span>
                          )}
                          <span className="text-xs text-gray-400">
                            Creada por {assessment.createdBy}
                          </span>
                        </div>

                        <div className="flex items-center gap-6 text-xs text-gray-400">
                          <span>Creada: {formatDate(assessment.createdAt)}</span>
                          <span>Actualizada: {formatDate(assessment.updatedAt)}</span>
                          <span>
                            Categorías: {assessment.categoriesCompleted}/{assessment.totalCategories}
                          </span>
                        </div>
                      </div>

                      {/* Right: Score + action */}
                      <div className="flex flex-col items-end gap-3 flex-shrink-0">
                        {assessment.status !== "BORRADOR" ? (
                          <div className="text-center">
                            <div className="relative w-16 h-16">
                              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 60 60">
                                <circle cx="30" cy="30" r="24" fill="none" stroke="#e5e7eb" strokeWidth="5" />
                                <circle
                                  cx="30" cy="30" r="24" fill="none"
                                  className={
                                    assessment.overallScore >= 80 ? "stroke-green-500" :
                                    assessment.overallScore >= 50 ? "stroke-yellow-500" : "stroke-red-500"
                                  }
                                  strokeWidth="5"
                                  strokeLinecap="round"
                                  strokeDasharray={`${(assessment.overallScore / 100) * 151} 151`}
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className={`text-sm font-bold ${
                                  assessment.overallScore >= 80 ? "text-green-600" :
                                  assessment.overallScore >= 50 ? "text-yellow-600" : "text-red-600"
                                }`}>
                                  {assessment.overallScore}%
                                </span>
                              </div>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1">Score</p>
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
                            <span className="text-xs text-gray-400">Sin datos</span>
                          </div>
                        )}

                        <Link href={
                          assessment.status === "BORRADOR" || assessment.status === "EN_PROGRESO"
                            ? "/evaluacion/nueva"
                            : "#"
                        }>
                          <Button variant="outline" size="sm">
                            <Eye className="h-3.5 w-3.5 mr-1.5" />
                            {assessment.status === "BORRADOR" ? "Continuar" :
                             assessment.status === "EN_PROGRESO" ? "Continuar" : "Ver Detalle"}
                            <ChevronRight className="h-3.5 w-3.5 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Progress bar */}
                    {assessment.status !== "BORRADOR" && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-gray-500">Progreso de evaluación</span>
                          <span className="text-xs font-medium text-gray-600">
                            {assessment.categoriesCompleted}/{assessment.totalCategories} categorías
                          </span>
                        </div>
                        <ProgressBar
                          value={assessment.categoriesCompleted}
                          max={assessment.totalCategories}
                          showLabel={false}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </AppShell>
  )
}

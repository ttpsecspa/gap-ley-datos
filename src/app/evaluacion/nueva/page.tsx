"use client"

import { useState, useMemo, useCallback } from "react"
import Link from "next/link"
import { AppShell } from "@/components/layout/app-shell"
import { Header } from "@/components/layout/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProgressBar } from "@/components/ui/progress-bar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getComplianceColor, calculateScore } from "@/lib/utils"
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Upload,
  FileText,
  Scale,
  Users,
  HandshakeIcon,
  Building2,
  Globe,
  Shield,
  Fingerprint,
  UserCog,
  AlertCircle,
  X,
} from "lucide-react"

type ComplianceLevel = "NO_CUMPLE" | "PARCIAL" | "CUMPLE" | "NO_APLICA" | ""

interface Question {
  id: string
  text: string
  article: string
  weight: number
  complianceLevel: ComplianceLevel
  evidence: string
  files: string[]
}

interface Category {
  id: string
  name: string
  shortName: string
  articles: string
  icon: typeof Scale
  description: string
  questions: Question[]
}

const complianceLevels: { value: ComplianceLevel; label: string; description: string }[] = [
  { value: "", label: "Sin evaluar", description: "Pendiente de evaluacion" },
  { value: "NO_CUMPLE", label: "No Cumple", description: "No se cumple con el requisito" },
  { value: "PARCIAL", label: "Parcial", description: "Cumplimiento parcial del requisito" },
  { value: "CUMPLE", label: "Cumple", description: "Cumplimiento total del requisito" },
  { value: "NO_APLICA", label: "No Aplica", description: "El requisito no aplica a la organizacion" },
]

const initialCategories: Category[] = [
  {
    id: "principios",
    name: "Principios de Tratamiento",
    shortName: "Principios",
    articles: "Art. 3-4",
    icon: Scale,
    description: "Principios fundamentales que rigen el tratamiento de datos personales",
    questions: [
      { id: "p1", text: "Se cuenta con una base de licitud definida para cada tratamiento de datos personales realizado por la organizacion?", article: "Art. 3", weight: 3, complianceLevel: "", evidence: "", files: [] },
      { id: "p2", text: "Los datos personales se recopilan y tratan exclusivamente para finalidades especificas, explicitas y licitas previamente informadas al titular?", article: "Art. 3 b)", weight: 3, complianceLevel: "", evidence: "", files: [] },
      { id: "p3", text: "Se aplica el principio de proporcionalidad, tratando solo los datos estrictamente necesarios para la finalidad declarada?", article: "Art. 3 c)", weight: 2, complianceLevel: "", evidence: "", files: [] },
      { id: "p4", text: "Existen procedimientos para asegurar la calidad, exactitud y actualizacion de los datos personales tratados?", article: "Art. 3 d)", weight: 2, complianceLevel: "", evidence: "", files: [] },
    ],
  },
  {
    id: "derechos",
    name: "Derechos de Titulares",
    shortName: "Derechos ARCO+",
    articles: "Art. 5-11",
    icon: Users,
    description: "Derechos de acceso, rectificacion, supresion, oposicion, portabilidad y bloqueo",
    questions: [
      { id: "d1", text: "Existe un procedimiento formal para que los titulares puedan ejercer su derecho de acceso a sus datos personales?", article: "Art. 5", weight: 3, complianceLevel: "", evidence: "", files: [] },
      { id: "d2", text: "Se cuenta con un mecanismo para atender solicitudes de rectificacion de datos inexactos o incompletos?", article: "Art. 6", weight: 3, complianceLevel: "", evidence: "", files: [] },
      { id: "d3", text: "Se ha implementado un procedimiento para la supresion de datos cuando el titular lo solicite o cuando ya no sean necesarios?", article: "Art. 7", weight: 3, complianceLevel: "", evidence: "", files: [] },
      { id: "d4", text: "Existe un mecanismo para que los titulares ejerzan su derecho de oposicion al tratamiento y su derecho a la portabilidad de datos?", article: "Art. 8-9", weight: 2, complianceLevel: "", evidence: "", files: [] },
    ],
  },
  {
    id: "consentimiento",
    name: "Consentimiento",
    shortName: "Consentimiento",
    articles: "Art. 12-13",
    icon: HandshakeIcon,
    description: "Requisitos de consentimiento libre, informado, previo, especifico y revocable",
    questions: [
      { id: "c1", text: "El consentimiento se obtiene de forma libre, sin condicionamientos indebidos para acceder a bienes o servicios?", article: "Art. 12", weight: 3, complianceLevel: "", evidence: "", files: [] },
      { id: "c2", text: "Se proporciona informacion clara y comprensible al titular antes de obtener su consentimiento (consentimiento informado)?", article: "Art. 12", weight: 3, complianceLevel: "", evidence: "", files: [] },
      { id: "c3", text: "El consentimiento se obtiene de manera previa al inicio del tratamiento y para finalidades especificas y determinadas?", article: "Art. 12", weight: 3, complianceLevel: "", evidence: "", files: [] },
      { id: "c4", text: "Se ha implementado un mecanismo sencillo para que el titular pueda revocar su consentimiento en cualquier momento?", article: "Art. 13", weight: 2, complianceLevel: "", evidence: "", files: [] },
    ],
  },
  {
    id: "obligaciones",
    name: "Obligaciones del Responsable",
    shortName: "Obligaciones",
    articles: "Art. 14",
    icon: Building2,
    description: "Registro de actividades, medidas de seguridad, DPO y modelo de prevencion",
    questions: [
      { id: "o1", text: "Se mantiene un registro actualizado de las actividades de tratamiento de datos personales realizadas por la organizacion?", article: "Art. 14", weight: 3, complianceLevel: "", evidence: "", files: [] },
      { id: "o2", text: "Se han implementado medidas de seguridad tecnicas y organizativas apropiadas para proteger los datos personales?", article: "Art. 14 bis", weight: 3, complianceLevel: "", evidence: "", files: [] },
      { id: "o3", text: "Se ha designado un Delegado de Proteccion de Datos (DPO) con las competencias y recursos necesarios?", article: "Art. 14 ter", weight: 2, complianceLevel: "", evidence: "", files: [] },
      { id: "o4", text: "Se ha adoptado un modelo de prevencion de infracciones conforme a los requisitos de la ley?", article: "Art. 14 quater", weight: 2, complianceLevel: "", evidence: "", files: [] },
    ],
  },
  {
    id: "transferencia",
    name: "Transferencia Internacional",
    shortName: "Transf. Internacional",
    articles: "Art. 27-28",
    icon: Globe,
    description: "Transferencias a paises con nivel adecuado, clausulas contractuales y consentimiento",
    questions: [
      { id: "t1", text: "Se ha verificado que los paises destinatarios de transferencias internacionales cuenten con un nivel adecuado de proteccion de datos?", article: "Art. 27", weight: 3, complianceLevel: "", evidence: "", files: [] },
      { id: "t2", text: "En ausencia de nivel adecuado, se utilizan clausulas contractuales tipo u otros mecanismos aprobados para la transferencia?", article: "Art. 27 bis", weight: 3, complianceLevel: "", evidence: "", files: [] },
      { id: "t3", text: "Se obtiene consentimiento expreso e informado del titular cuando la transferencia internacional no cuenta con otras garantias?", article: "Art. 28", weight: 2, complianceLevel: "", evidence: "", files: [] },
    ],
  },
  {
    id: "seguridad",
    name: "Seguridad de Datos",
    shortName: "Seguridad",
    articles: "Art. 14 quinquies",
    icon: Shield,
    description: "Medidas tecnicas y organizativas, evaluacion de riesgo y notificacion de brechas",
    questions: [
      { id: "s1", text: "Se han implementado medidas tecnicas de seguridad (cifrado, control de acceso, respaldos) adecuadas al riesgo del tratamiento?", article: "Art. 14 quinquies", weight: 3, complianceLevel: "", evidence: "", files: [] },
      { id: "s2", text: "Existen medidas organizativas de seguridad (politicas, procedimientos, capacitacion) documentadas y vigentes?", article: "Art. 14 quinquies", weight: 3, complianceLevel: "", evidence: "", files: [] },
      { id: "s3", text: "Se realizan evaluaciones periodicas de riesgo sobre las actividades de tratamiento de datos personales?", article: "Art. 14 quinquies", weight: 2, complianceLevel: "", evidence: "", files: [] },
      { id: "s4", text: "Existe un procedimiento de notificacion de brechas de seguridad a la autoridad y a los titulares afectados dentro de los plazos legales?", article: "Art. 14 quinquies", weight: 3, complianceLevel: "", evidence: "", files: [] },
    ],
  },
  {
    id: "sensibles",
    name: "Datos Sensibles",
    shortName: "Datos Sensibles",
    articles: "Art. 16",
    icon: Fingerprint,
    description: "Tratamiento de datos de salud, biometricos, menores de edad y consentimiento explicito",
    questions: [
      { id: "ds1", text: "Se obtiene consentimiento explicito del titular para el tratamiento de datos sensibles, salvo las excepciones legales aplicables?", article: "Art. 16", weight: 3, complianceLevel: "", evidence: "", files: [] },
      { id: "ds2", text: "Los datos de salud se tratan con medidas de seguridad reforzadas y solo por personal autorizado?", article: "Art. 16 bis", weight: 3, complianceLevel: "", evidence: "", files: [] },
      { id: "ds3", text: "El tratamiento de datos biometricos cuenta con consentimiento explicito y se limita a finalidades especificas justificadas?", article: "Art. 16 bis", weight: 2, complianceLevel: "", evidence: "", files: [] },
      { id: "ds4", text: "Se aplican medidas especiales de proteccion para el tratamiento de datos personales de menores de edad?", article: "Art. 16 ter", weight: 3, complianceLevel: "", evidence: "", files: [] },
    ],
  },
  {
    id: "dpo",
    name: "DPO y Gobernanza",
    shortName: "DPO / Gobernanza",
    articles: "Art. 14 ter-quater",
    icon: UserCog,
    description: "Nombramiento, funciones, independencia del DPO y modelo de prevencion de infracciones",
    questions: [
      { id: "g1", text: "Se ha nombrado formalmente un Delegado de Proteccion de Datos con dedicacion y recursos suficientes?", article: "Art. 14 ter", weight: 3, complianceLevel: "", evidence: "", files: [] },
      { id: "g2", text: "El DPO tiene definidas sus funciones de asesoria, supervision y coordinacion con la autoridad de proteccion de datos?", article: "Art. 14 ter", weight: 2, complianceLevel: "", evidence: "", files: [] },
      { id: "g3", text: "Se garantiza la independencia del DPO, sin recibir instrucciones en el ejercicio de sus funciones de supervision?", article: "Art. 14 ter", weight: 2, complianceLevel: "", evidence: "", files: [] },
      { id: "g4", text: "Se ha implementado un modelo de prevencion de infracciones con politicas, procedimientos y mecanismos de supervision documentados?", article: "Art. 14 quater", weight: 3, complianceLevel: "", evidence: "", files: [] },
    ],
  },
]

export default function NuevaEvaluacionPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [expandedCategory, setExpandedCategory] = useState<string | null>("principios")
  const [assessmentName, setAssessmentName] = useState("Evaluacion GAP - " + new Date().toLocaleDateString("es-CL"))
  const [saving, setSaving] = useState(false)
  const [savedMessage, setSavedMessage] = useState("")

  const updateQuestion = useCallback((categoryId: string, questionId: string, field: keyof Question, value: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              questions: cat.questions.map((q) =>
                q.id === questionId ? { ...q, [field]: value } : q
              ),
            }
          : cat
      )
    )
  }, [])

  const addFile = useCallback((categoryId: string, questionId: string, fileName: string) => {
    if (!fileName) return
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              questions: cat.questions.map((q) =>
                q.id === questionId ? { ...q, files: [...q.files, fileName] } : q
              ),
            }
          : cat
      )
    )
  }, [])

  const removeFile = useCallback((categoryId: string, questionId: string, fileIndex: number) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              questions: cat.questions.map((q) =>
                q.id === questionId
                  ? { ...q, files: q.files.filter((_, i) => i !== fileIndex) }
                  : q
              ),
            }
          : cat
      )
    )
  }, [])

  const categoryScores = useMemo(() => {
    return categories.map((cat) => {
      const answered = cat.questions.filter((q) => q.complianceLevel !== "")
      const score = calculateScore(
        answered.map((q) => ({ complianceLevel: q.complianceLevel, weight: q.weight }))
      )
      return {
        id: cat.id,
        score,
        answered: answered.length,
        total: cat.questions.length,
        complete: answered.length === cat.questions.length,
      }
    })
  }, [categories])

  const overallScore = useMemo(() => {
    const allAnswered = categories.flatMap((cat) =>
      cat.questions.filter((q) => q.complianceLevel !== "")
    )
    return calculateScore(
      allAnswered.map((q) => ({ complianceLevel: q.complianceLevel, weight: q.weight }))
    )
  }, [categories])

  const totalQuestions = categories.reduce((sum, cat) => sum + cat.questions.length, 0)
  const answeredQuestions = categories.reduce(
    (sum, cat) => sum + cat.questions.filter((q) => q.complianceLevel !== "").length,
    0
  )
  const completedCategories = categoryScores.filter((c) => c.complete).length

  const handleSaveDraft = useCallback(() => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSavedMessage("Borrador guardado exitosamente")
      setTimeout(() => setSavedMessage(""), 3000)
    }, 800)
  }, [])

  const handleComplete = useCallback(() => {
    if (answeredQuestions < totalQuestions) {
      alert(`Faltan ${totalQuestions - answeredQuestions} preguntas por responder. Complete todas las preguntas antes de finalizar.`)
      return
    }
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSavedMessage("Evaluacion completada y guardada exitosamente")
      setTimeout(() => setSavedMessage(""), 3000)
    }, 800)
  }, [answeredQuestions, totalQuestions])

  return (
    <AppShell>
      <Header
        title="Nueva Evaluacion GAP"
        subtitle="Cuestionario de cumplimiento Ley 21.719 de Proteccion de Datos Personales"
        actions={
          <div className="flex items-center gap-2">
            {savedMessage && (
              <span className="text-sm text-green-600 font-medium animate-pulse">
                {savedMessage}
              </span>
            )}
            <Button variant="outline" onClick={handleSaveDraft} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Guardando..." : "Guardar Borrador"}
            </Button>
            <Button variant="success" onClick={handleComplete} disabled={saving}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Completar Evaluacion
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {/* Back link + Assessment name */}
        <div className="flex items-center gap-4">
          <Link href="/evaluacion">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver
            </Button>
          </Link>
          <Input
            value={assessmentName}
            onChange={(e) => setAssessmentName(e.target.value)}
            className="max-w-md text-base font-semibold"
            placeholder="Nombre de la evaluacion"
          />
        </div>

        {/* Overall progress */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            <div className="md:col-span-1">
              <div className="relative w-24 h-24 mx-auto">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    className={
                      overallScore >= 80 ? "stroke-green-500" :
                      overallScore >= 50 ? "stroke-yellow-500" : "stroke-red-500"
                    }
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(overallScore / 100) * 264} 264`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-2xl font-bold ${
                    overallScore >= 80 ? "text-green-600" :
                    overallScore >= 50 ? "text-yellow-600" : "text-red-600"
                  }`}>
                    {overallScore}%
                  </span>
                  <span className="text-[10px] text-gray-400">Score Global</span>
                </div>
              </div>
            </div>
            <div className="md:col-span-3 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Progreso General</h3>
                <span className="text-sm text-gray-500">
                  {answeredQuestions} de {totalQuestions} preguntas respondidas
                </span>
              </div>
              <ProgressBar value={answeredQuestions} max={totalQuestions} />
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{completedCategories} de {categories.length} categorias completas</span>
                <span className="text-gray-300">|</span>
                <span>Score se calcula en tiempo real</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Category navigation mini-bar */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const cs = categoryScores.find((c) => c.id === cat.id)!
            return (
              <button
                key={cat.id}
                onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors border ${
                  expandedCategory === cat.id
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : cs.complete
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <cat.icon className="h-3.5 w-3.5" />
                {cat.shortName}
                {cs.complete && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                {!cs.complete && cs.answered > 0 && (
                  <span className="text-[10px] opacity-60">{cs.answered}/{cs.total}</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Category accordion */}
        <div className="space-y-3">
          {categories.map((category) => {
            const cs = categoryScores.find((c) => c.id === category.id)!
            const isExpanded = expandedCategory === category.id
            const Icon = category.icon

            return (
              <Card key={category.id} className="overflow-hidden">
                {/* Category header */}
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                  className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-lg ${
                      cs.complete ? "bg-green-50" : cs.answered > 0 ? "bg-blue-50" : "bg-gray-50"
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        cs.complete ? "text-green-600" : cs.answered > 0 ? "text-blue-600" : "text-gray-400"
                      }`} />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        <Badge variant="outline" className="text-[10px]">{category.articles}</Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{category.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium text-gray-700">
                        {cs.answered}/{cs.total} preguntas
                      </p>
                      {cs.answered > 0 && (
                        <p className={`text-xs font-medium ${
                          cs.score >= 80 ? "text-green-600" : cs.score >= 50 ? "text-yellow-600" : "text-red-600"
                        }`}>
                          Score: {cs.score}%
                        </p>
                      )}
                    </div>
                    <div className="w-24 hidden sm:block">
                      <ProgressBar value={cs.answered} max={cs.total} showLabel={false} />
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Questions */}
                {isExpanded && (
                  <div className="border-t border-gray-100">
                    {category.questions.map((question, qi) => (
                      <div
                        key={question.id}
                        className={`p-5 ${qi < category.questions.length - 1 ? "border-b border-gray-100" : ""}`}
                      >
                        <div className="space-y-4">
                          {/* Question text */}
                          <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                              {qi + 1}
                            </span>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{question.text}</p>
                              <p className="text-xs text-gray-400 mt-1">{question.article} - Peso: {question.weight}</p>
                            </div>
                          </div>

                          {/* Compliance level selector */}
                          <div className="ml-9">
                            <label className="text-xs font-medium text-gray-500 mb-2 block">
                              Nivel de Cumplimiento
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {complianceLevels.filter(l => l.value !== "").map((level) => {
                                const isSelected = question.complianceLevel === level.value
                                const colorClass = isSelected ? getComplianceColor(level.value) : ""
                                return (
                                  <button
                                    key={level.value}
                                    onClick={() => updateQuestion(category.id, question.id, "complianceLevel", level.value)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                      isSelected
                                        ? `${colorClass} border ring-1 ring-offset-1`
                                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                                    }`}
                                    title={level.description}
                                  >
                                    {level.label}
                                  </button>
                                )
                              })}
                            </div>
                          </div>

                          {/* Evidence + files */}
                          {question.complianceLevel !== "" && (
                            <div className="ml-9 space-y-3">
                              <div>
                                <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                                  Evidencia / Comentarios
                                </label>
                                <Textarea
                                  value={question.evidence}
                                  onChange={(e) => updateQuestion(category.id, question.id, "evidence", e.target.value)}
                                  placeholder="Describa la evidencia que respalda el nivel de cumplimiento seleccionado..."
                                  className="min-h-[60px] text-sm"
                                />
                              </div>

                              <div>
                                <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                                  Documentos de Respaldo
                                </label>
                                <div className="flex items-center gap-2">
                                  <div className="relative flex-1">
                                    <Input
                                      type="file"
                                      className="text-xs"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                          addFile(category.id, question.id, file.name)
                                          e.target.value = ""
                                        }
                                      }}
                                    />
                                  </div>
                                  <Button variant="outline" size="sm" className="flex-shrink-0" onClick={() => {
                                    const input = document.createElement("input")
                                    input.type = "file"
                                    input.onchange = (e) => {
                                      const file = (e.target as HTMLInputElement).files?.[0]
                                      if (file) addFile(category.id, question.id, file.name)
                                    }
                                    input.click()
                                  }}>
                                    <Upload className="h-3.5 w-3.5 mr-1" />
                                    Adjuntar
                                  </Button>
                                </div>
                                {question.files.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {question.files.map((file, fi) => (
                                      <div
                                        key={fi}
                                        className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600"
                                      >
                                        <FileText className="h-3 w-3" />
                                        {file}
                                        <button
                                          onClick={() => removeFile(category.id, question.id, fi)}
                                          className="ml-1 text-gray-400 hover:text-red-500"
                                        >
                                          <X className="h-3 w-3" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Warning for NO_CUMPLE */}
                          {question.complianceLevel === "NO_CUMPLE" && (
                            <div className="ml-9 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                              <div className="text-xs text-red-700">
                                <p className="font-medium">Hallazgo de no cumplimiento detectado</p>
                                <p className="mt-0.5 opacity-80">Se generara un plan de accion correctivo al completar la evaluacion.</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        {/* Bottom actions */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              <p>
                Progreso: <span className="font-medium text-gray-900">{answeredQuestions}/{totalQuestions}</span> preguntas
                {" "} | {" "}
                Score actual: <span className={`font-bold ${
                  overallScore >= 80 ? "text-green-600" : overallScore >= 50 ? "text-yellow-600" : "text-red-600"
                }`}>{overallScore}%</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleSaveDraft} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                Guardar Borrador
              </Button>
              <Button variant="success" onClick={handleComplete} disabled={saving}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Completar Evaluacion
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}

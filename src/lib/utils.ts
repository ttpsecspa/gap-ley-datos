import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("es-CL", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function calculateBusinessDays(startDate: Date, days: number): Date {
  const result = new Date(startDate)
  let added = 0
  while (added < days) {
    result.setDate(result.getDate() + 1)
    const dayOfWeek = result.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      added++
    }
  }
  return result
}

export function getComplianceColor(level: string): string {
  switch (level) {
    case "CUMPLE": return "text-green-600 bg-green-50 border-green-200"
    case "PARCIAL": return "text-yellow-600 bg-yellow-50 border-yellow-200"
    case "NO_CUMPLE": return "text-red-600 bg-red-50 border-red-200"
    case "NO_APLICA": return "text-gray-500 bg-gray-50 border-gray-200"
    default: return "text-gray-500 bg-gray-50 border-gray-200"
  }
}

export function getRiskColor(level: string): string {
  switch (level) {
    case "CRITICO": return "text-red-700 bg-red-100"
    case "ALTO": return "text-orange-700 bg-orange-100"
    case "MEDIO": return "text-yellow-700 bg-yellow-100"
    case "BAJO": return "text-green-700 bg-green-100"
    default: return "text-gray-700 bg-gray-100"
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "COMPLETADA":
    case "COMPLETADO":
    case "CUMPLE":
    case "RESUELTA":
    case "APROBADO":
    case "VIGENTE":
      return "text-green-700 bg-green-100"
    case "EN_PROGRESO":
    case "EN_PROCESO":
    case "EN_REVISION":
    case "PARCIAL":
    case "INVESTIGANDO":
      return "text-blue-700 bg-blue-100"
    case "PENDIENTE":
    case "BORRADOR":
    case "RECIBIDA":
    case "DETECTADA":
      return "text-yellow-700 bg-yellow-100"
    case "VENCIDA":
    case "NO_CUMPLE":
    case "CANCELADA":
    case "OBSOLETO":
      return "text-red-700 bg-red-100"
    default:
      return "text-gray-700 bg-gray-100"
  }
}

export function calculateScore(answers: { complianceLevel: string; weight: number }[]): number {
  if (answers.length === 0) return 0
  const applicable = answers.filter(a => a.complianceLevel !== "NO_APLICA")
  if (applicable.length === 0) return 100
  const totalWeight = applicable.reduce((sum, a) => sum + a.weight, 0)
  const scored = applicable.reduce((sum, a) => {
    const score = a.complianceLevel === "CUMPLE" ? 1 : a.complianceLevel === "PARCIAL" ? 0.5 : 0
    return sum + score * a.weight
  }, 0)
  return Math.round((scored / totalWeight) * 100)
}

"use client"

import { cn } from "@/lib/utils"
import { Card } from "./card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: { value: number; label: string }
  className?: string
  iconColor?: string
}

export function StatCard({ title, value, description, icon: Icon, trend, className, iconColor = "text-blue-600 bg-blue-50" }: StatCardProps) {
  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {description && <p className="text-xs text-gray-400">{description}</p>}
          {trend && (
            <p className={cn("text-xs font-medium", trend.value >= 0 ? "text-green-600" : "text-red-600")}>
              {trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn("p-3 rounded-lg", iconColor)}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </Card>
  )
}

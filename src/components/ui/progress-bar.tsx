"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
  colorByValue?: boolean
}

export function ProgressBar({ value, max = 100, className, showLabel = true, colorByValue = true }: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100)

  const getColor = () => {
    if (!colorByValue) return "bg-blue-600"
    if (percentage >= 80) return "bg-green-500"
    if (percentage >= 50) return "bg-yellow-500"
    if (percentage >= 25) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", getColor())}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-right">{percentage}%</span>
      )}
    </div>
  )
}

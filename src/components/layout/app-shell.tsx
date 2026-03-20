"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "./sidebar"
import { useAuthStore } from "@/store/auth-store"
import { useAppStore } from "@/store/app-store"
import { cn } from "@/lib/utils"

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, initialized, initialize } = useAuthStore()
  const { sidebarOpen } = useAppStore()
  const router = useRouter()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (initialized && !user) {
      router.push("/auth/login")
    }
  }, [initialized, user, router])

  if (!initialized) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className={cn("transition-all duration-300", sidebarOpen ? "ml-64" : "ml-20")}>
        {children}
      </main>
    </div>
  )
}

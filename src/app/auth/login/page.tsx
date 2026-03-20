"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const { signIn, loading, demoMode } = useAuthStore()
  const router = useRouter()

  // En modo demo, inicializar usuario demo y redirigir
  const handleDemo = async () => {
    const { initialize } = useAuthStore.getState()
    await initialize()
    router.push("/dashboard")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const result = await signIn(email, password)
    if (result.error) {
      setError(result.error)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-xl">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">GAP Analysis</h1>
            <p className="text-xs text-blue-300">Ley 21.719</p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-4xl font-bold leading-tight">
            Protección de Datos<br />Personales
          </h2>
          <p className="text-lg text-slate-300 max-w-md">
            Sistema integral de evaluación de cumplimiento de la Ley Marco de
            Protección de Datos Personales de Chile.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            {[
              { n: "7", t: "Módulos de evaluación" },
              { n: "57", t: "Preguntas de cumplimiento" },
              { n: "6", t: "Derechos ARCO-POB" },
              { n: "100%", t: "Alineado a Ley 21.719" },
            ].map((s) => (
              <div key={s.t} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-2xl font-bold text-blue-400">{s.n}</p>
                <p className="text-xs text-slate-300">{s.t}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Desarrollado por el equipo de cumplimiento legal-tech
        </p>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center gap-3 justify-center mb-8">
            <div className="bg-blue-600 p-2.5 rounded-xl">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">GAP Ley 21.719</h1>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-gray-900">Iniciar sesión</h2>
            <p className="text-sm text-gray-500 mt-1">Ingresa tus credenciales para acceder al sistema</p>
          </div>

          {demoMode && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-800">Modo Demo Activo</p>
              <p className="text-xs text-blue-600 mt-1">No se requiere Supabase. Haz clic para explorar el sistema con datos de ejemplo.</p>
              <button
                onClick={handleDemo}
                className="mt-3 w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Entrar al Demo
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Correo electrónico</label>
              <Input
                type="email"
                placeholder="tu@empresa.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Contraseña</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>

          <p className="text-xs text-center text-gray-400">
            Sistema protegido. Acceso solo para personal autorizado.
          </p>
        </div>
      </div>
    </div>
  )
}

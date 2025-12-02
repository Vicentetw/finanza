"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SetupPage() {
  const [supabaseUrl, setSupabaseUrl] = useState("")
  const [anonKey, setAnonKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!supabaseUrl || !anonKey) {
      setError("Por favor completa todos los campos")
      setIsLoading(false)
      return
    }

    if (!supabaseUrl.includes("supabase.co")) {
      setError("URL de Supabase no válida. Debe terminar en supabase.co")
      setIsLoading(false)
      return
    }

    // Instead, show instructions to add to v0 vars panel
    setError("Las variables deben agregarse en el panel Vars de v0. Por favor recarga después de agregarlas.")
    setIsLoading(false)

    setSuccess(true)
    setTimeout(() => {
      window.location.reload()
    }, 3000)
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2 justify-center mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                ⚙️
              </div>
            </div>
            <CardTitle className="text-2xl">Configuración Inicial</CardTitle>
            <CardDescription>Conecta tu proyecto Supabase</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900 font-semibold mb-2">Instrucciones:</p>
              <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                <li>Ve a supabase.com y abre tu proyecto</li>
                <li>
                  Ve a <strong>Settings → API</strong>
                </li>
                <li>
                  Copia <strong>"Project URL"</strong>
                </li>
                <li>
                  Copia <strong>"anon public"</strong>
                </li>
                <li>En v0, abre la barra lateral izquierda</li>
                <li>
                  Ve a la pestaña <strong>"Vars"</strong>
                </li>
                <li>
                  Agrega:
                  <ul className="list-inside ml-2 mt-1 space-y-1">
                    <li className="font-mono text-xs bg-gray-100 p-1 rounded">NEXT_PUBLIC_SUPABASE_URL</li>
                    <li className="font-mono text-xs bg-gray-100 p-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                  </ul>
                </li>
                <li>Recarga esta página</li>
              </ol>
            </div>

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">✓ Recargando...</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="opacity-50 pointer-events-none">
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="url">Project URL (Solo referencia)</Label>
                  <Input
                    id="url"
                    type="text"
                    placeholder="https://xxxxx.supabase.co"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    disabled
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="key">Anon Public Key (Solo referencia)</Label>
                  <Input
                    id="key"
                    type="password"
                    placeholder="eyJhbGc..."
                    value={anonKey}
                    onChange={(e) => setAnonKey(e.target.value)}
                    disabled
                  />
                </div>

                {error && <p className="text-sm text-red-500 font-semibold">{error}</p>}

                <Button type="submit" disabled>
                  Usar Vars de v0 en su lugar
                </Button>
              </div>
            </form>

            <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-900 font-semibold mb-1">💡 Tip:</p>
              <p className="text-xs text-amber-800">
                Una vez agregues las variables en el panel Vars de v0, recarga esta página y deberías ir a login
                automáticamente.
              </p>
            </div>

            <div className="mt-4 text-center text-xs text-gray-500">
              <Link href="https://supabase.com/docs" target="_blank" className="text-blue-600 hover:underline">
                Ver documentación de Supabase →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

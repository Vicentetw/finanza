"use client"

import { useState, useEffect } from "react"
import { crearMovimiento} from "@/app/actions/movimientos"
import { obtenerMonedas } from "@/app/actions/catalogos"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"

export default function NuevoMovimientoPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [monedas, setMonedas] = useState<{ id: string; codigo_iso: string; simbolo: string }[]>([])

  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split("T")[0],
    tipo: "ingreso" as const,
    monto: "",
    moneda_id: "",
    descripción: "",
  })

  useEffect(() => {
    async function loadMonedas() {
      try {
        const monedasDB = await obtenerMonedas()
        setMonedas(monedasDB)
      } catch (error) {
        console.error(error)
        toast({
          title: "Error",
          description: "No se pudieron cargar las monedas",
          variant: "destructive",
        })
      }
    }

    loadMonedas()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await crearMovimiento({
        fecha: formData.fecha,
        tipo: formData.tipo,
        monto: Number.parseFloat(formData.monto),
        moneda_id: formData.moneda_id,
        descripción: formData.descripción,
      })

      if (result.success) {
        toast({
          title: "Éxito",
          description: "Movimiento registrado correctamente",
        })
        router.push("/movimientos")
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/movimientos">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Nuevo Movimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(val: any) => setFormData({ ...formData, tipo: val })}
                  >
                    <SelectTrigger id="tipo">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ingreso">Ingreso</SelectItem>
                      <SelectItem value="egreso">Egreso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="monto">Monto</Label>
                  <Input
                    id="monto"
                    type="number"
                    step="0.01"
                    placeholder="1000"
                    value={formData.monto}
                    onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="moneda">Moneda</Label>
                  <Select
                    value={formData.moneda_id}
                    onValueChange={(val) => setFormData({ ...formData, moneda_id: val })}
                  >
                    <SelectTrigger id="moneda">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {monedas.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.codigo_iso} ({m.simbolo})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="descripción">Descripción</Label>
                <Input
                  id="descripción"
                  placeholder="Detalles del movimiento"
                  value={formData.descripción}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      descripción: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Guardando..." : "Registrar Movimiento"}
                </Button>
                <Link href="/movimientos">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

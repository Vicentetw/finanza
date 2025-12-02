"use client"

import { useState, useEffect } from "react"
import { crearInversión } from "@/app/actions/inversiones"
import { obtenerPlataformas, obtenerInstrumentos, obtenerMonedas } from "@/app/actions/catalogos"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"

export default function NuevaInversiónPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [plataformas, setPlataformas] = useState<{ id: string; nombre: string }[]>([])
  const [instrumentos, setInstrumentos] = useState<{ id: string; nombre: string }[]>([])
  const [monedas, setMonedas] = useState<{ id: string; codigo_iso: string; simbolo: string }[]>([])

  const [formData, setFormData] = useState({
    plataforma_id: "",
    instrumento_id: "",
    moneda_id: "",
    fecha_compra: new Date().toISOString().split("T")[0],
    ppc_promedio: "",
    cantidad: "",
    notas: "",
  })

  useEffect(() => {
    async function loadCatalogos() {
      try {
        const [plats, insts, mons] = await Promise.all([
          obtenerPlataformas(),
          obtenerInstrumentos(),
          obtenerMonedas(),
        ])
        setPlataformas(plats)
        setInstrumentos(insts)
        setMonedas(mons)
      } catch (error) {
        console.error(error)
        toast({ title: "Error", description: "No se pudieron cargar los catálogos", variant: "destructive" })
      }
    }
    loadCatalogos()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await crearInversión({
        plataforma_id: formData.plataforma_id,
        instrumento_id: formData.instrumento_id,
        moneda_id: formData.moneda_id,
        fecha_compra: formData.fecha_compra,
        ppc_promedio: Number.parseFloat(formData.ppc_promedio),
        cantidad: Number.parseFloat(formData.cantidad),
        notas: formData.notas,
      })

      if (result.success) {
        toast({
          title: "Éxito",
          description: "Inversión creada correctamente",
        })
        router.push("/inversiones")
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
        <Link href="/inversiones">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Nueva Inversión</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="plataforma">Plataforma</Label>
                  <Select
                    value={formData.plataforma_id}
                    onValueChange={(val) => setFormData({ ...formData, plataforma_id: val })}
                  >
                    <SelectTrigger id="plataforma">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {plataformas.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="instrumento">Instrumento</Label>
                  <Select
                    value={formData.instrumento_id}
                    onValueChange={(val) => setFormData({ ...formData, instrumento_id: val })}
                  >
                    <SelectTrigger id="instrumento">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {instrumentos.map((i) => (
                        <SelectItem key={i.id} value={i.id}>
                          {i.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

                <div>
                  <Label htmlFor="fecha">Fecha de Compra</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={formData.fecha_compra}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fecha_compra: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="ppc">Precio Promedio de Costo</Label>
                  <Input
                    id="ppc"
                    type="number"
                    step="0.01"
                    placeholder="125.50"
                    value={formData.ppc_promedio}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ppc_promedio: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="cantidad">Cantidad</Label>
                  <Input
                    id="cantidad"
                    type="number"
                    step="0.0001"
                    placeholder="20"
                    value={formData.cantidad}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cantidad: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notas">Notas</Label>
                <Input
                  id="notas"
                  placeholder="Detalles adicionales"
                  value={formData.notas}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      notas: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Creando..." : "Crear Inversión"}
                </Button>
                <Link href="/inversiones">
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

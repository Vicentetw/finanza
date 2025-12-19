"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

import { obtenerMovimientoPorId, actualizarMovimiento } from "@/lib/client/movimientos"
import { obtenerMonedas, obtenerOrigenes, obtenerDestinos, obtenerInversiones } from "@/app/actions/catalogos"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function EditarMovimientoPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)

  const [monedas, setMonedas] = useState<any[]>([])
  const [origenes, setOrigenes] = useState<any[]>([])
  const [destinos, setDestinos] = useState<any[]>([])
  const [inversiones, setInversiones] = useState<any[]>([])

  const [formData, setFormData] = useState({
    fecha: "",
    tipo: "ingreso",
    monto: "",
    moneda_id: "",
    origen_id: "none",
    destino_id: "none",
    inversión_id: "none",
    descripción: "",
  })

  // ============================
  // CARGAR CATÁLOGOS
  // ============================
  useEffect(() => {
    async function loadCat() {
      try {
        const [mons, orgs, dests, invs] = await Promise.all([
          obtenerMonedas(),
          obtenerOrigenes(),
          obtenerDestinos(),
          obtenerInversiones(),
        ])
        setMonedas(mons)
        setOrigenes(orgs)
        setDestinos(dests)
        setInversiones(invs)
      } catch (err) {
        toast({ title: "Error", description: "No se pudieron cargar los catálogos", variant: "destructive" })
      }
    }
    loadCat()
  }, [])

  // ============================
  // CARGAR MOVIMIENTO EXISTENTE
  // ============================
  useEffect(() => {
    async function loadMovimiento() {
      try {
        const mov = await obtenerMovimientoPorId(params.id as string)

        if (!mov) {
          toast({ title: "Error", description: "Movimiento no encontrado", variant: "destructive" })
          router.push("/movimientos")
          return
        }

        setFormData({
          fecha: mov.fecha?.split("T")[0] || "",
          tipo: mov.tipo || "ingreso",
          monto: mov.monto?.toString() || "",
          moneda_id: mov.moneda_id || "",
          origen_id: mov.origen_id || "none",
          destino_id: mov.destino_id || "none",
          inversión_id: mov.inversión_id || "none",
          descripción: mov.descripción || "",
        })
      } catch (err) {
        toast({ title: "Error", description: "No se pudo cargar el movimiento", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }

    loadMovimiento()
  }, [params.id])

  // ============================
  // SUBMIT
  // ============================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await actualizarMovimiento(params.id as string, {
        fecha: formData.fecha,
        tipo: formData.tipo,
        monto: parseFloat(formData.monto),
        moneda_id: formData.moneda_id,
        origen_id: formData.origen_id === "none" ? null : formData.origen_id,
        destino_id: formData.destino_id === "none" ? null : formData.destino_id,
        inversión_id: formData.inversión_id === "none" ? null : formData.inversión_id,

        descripción: formData.descripción,
      })

      if (result.success) {
        toast({ title: "Movimiento actualizado" })
        router.push("/movimientos")
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" })
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando movimiento...
      </div>
    )

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
            <CardTitle>Editar Movimiento</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Fecha */}
              <div>
                <Label>Fecha</Label>
                <Input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                />
              </div>

              {/* Tipo */}
              <div>
                <Label>Tipo</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(val) => setFormData({ ...formData, tipo: val })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ingreso">Ingreso</SelectItem>
                    <SelectItem value="egreso">Egreso</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Monto */}
              <div>
                <Label>Monto</Label>
                <Input
                  type="number"
                  value={formData.monto}
                  onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                />
              </div>

              {/* Moneda */}
              <div>
                <Label>Moneda</Label>
                <Select
                  value={formData.moneda_id}
                  onValueChange={(val) => setFormData({ ...formData, moneda_id: val })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {monedas.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.codigo_iso} ({m.simbolo})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Origen */}
              <div>
                <Label>Origen</Label>
                <Select
                  value={formData.origen_id}
                  onValueChange={(val) => setFormData({ ...formData, origen_id: val })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin origen</SelectItem>
                    {origenes.map((o) => (
                      <SelectItem key={o.id} value={o.id}>{o.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Destino */}
              <div>
                <Label>Destino</Label>
                <Select
                  value={formData.destino_id}
                  onValueChange={(val) => setFormData({ ...formData, destino_id: val })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin destino</SelectItem>
                    {destinos.map((d) => (
                      <SelectItem key={d.id} value={d.id}>{d.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Inversión */}
              <div>
                <Label>Inversión asociada (opcional)</Label>
                <Select
                  value={formData.inversión_id}
                  onValueChange={(val) => setFormData({ ...formData, inversión_id: val })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin asignar</SelectItem>
                    {inversiones.map((inv) => (
                      <SelectItem key={inv.id} value={inv.id}>
                        {inv.instrumentos?.nombre} - {inv.plataformas?.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Descripción */}
              <div>
                <Label>Descripción</Label>
                <Input
                  value={formData.descripción}
                  onChange={(e) => setFormData({ ...formData, descripción: e.target.value })}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Guardando..." : "Guardar cambios"}
                </Button>
                <Link href="/movimientos">
                  <Button variant="outline">Cancelar</Button>
                </Link>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

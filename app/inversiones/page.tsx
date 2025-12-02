"use client"

import { useEffect, useState } from "react"
import { obtenerInversiones, eliminarInversion } from "@/app/actions/inversiones"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { calcularROI, calcularMontoInvertido } from "@/lib/utils/calculos"
import BackButton from "@/components/BackButton"
import { useToast } from "@/hooks/use-toast"

export default function InversionesPage() {
  const [inversiones, setInversiones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const cargarInversiones = async () => {
    setLoading(true)
    try {
      const data = await obtenerInversiones()
      setInversiones(data)
    } catch (error) {
      console.error(error)
      toast({ title: "Error", description: "No se pudieron cargar las inversiones", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarInversiones()
  }, [])

  const handleEliminar = async (id: string) => {
    if (!confirm("¿Seguro quieres eliminar esta inversión?")) return

    try {
      await eliminarInversion(id)
      toast({ title: "Inversión eliminada", variant: "destructive" })
      cargarInversiones()
    } catch (error) {
      console.error(error)
      toast({ title: "Error", description: "No se pudo eliminar la inversión", variant: "destructive" })
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando inversiones...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="flex gap-4">
        <BackButton href="/" />
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inversiones</h1>
            <p className="text-gray-500">Todas tus inversiones</p>
          </div>
          <Link href="/inversiones/nueva">
            <Button>+ Nueva Inversión</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Listado de Inversiones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Instrumento</TableHead>
                    <TableHead>Plataforma</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>PPC</TableHead>
                    <TableHead>Invertido</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>ROI</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inversiones.map((inv) => {
                    const montoInv = calcularMontoInvertido(inv.ppc_promedio, inv.cantidad, inv.comision_compra)
                    const roi =
                      inv.precio_venta && inv.cantidad_vendida
                        ? calcularROI(montoInv, inv.precio_venta * inv.cantidad_vendida - inv.comision_venta)
                        : null

                    return (
                      <TableRow key={inv.id}>
                        <TableCell className="font-medium">{inv.instrumentos.nombre}</TableCell>
                        <TableCell>{inv.plataformas.nombre}</TableCell>
                        <TableCell>{inv.cantidad}</TableCell>
                        <TableCell>${inv.ppc_promedio.toFixed(2)}</TableCell>
                        <TableCell>${montoInv.toLocaleString("es-AR")}</TableCell>
                        <TableCell>
                          <Badge variant={inv.estado === "activa" ? "default" : "secondary"}>{inv.estado}</Badge>
                        </TableCell>
                        <TableCell>
                          {roi ? <span className={roi >= 0 ? "text-green-600" : "text-red-600"}>{roi.toFixed(2)}%</span> : "-"}
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <Link href={`/inversiones/editar/${inv.id}`}>
                            <Button size="sm" variant="outline">Editar</Button>
                          </Link>
                          <Button size="sm" variant="destructive" onClick={() => handleEliminar(inv.id)}>Eliminar</Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

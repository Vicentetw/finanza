"use client"

import { useEffect, useState } from "react"
import { obtenerMovimientos, eliminarMovimiento } from "@/lib/client/movimientos"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Table, TableHead, TableRow, TableHeader, TableCell, TableBody } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import BackButton from "@/components/BackButton"

export default function MovimientosPage() {
  const { toast } = useToast()
  const [movimientos, setMovimientos] = useState([])
  const [loading, setLoading] = useState(true)

  const cargar = async () => {
    setLoading(true)
    try {
      const data = await obtenerMovimientos()
      setMovimientos(data)
    } catch (e) {
      toast({ title: "Error", description: "No se pudieron cargar los movimientos", variant: "destructive" })
    }
    setLoading(false)
  }

  useEffect(() => { cargar() }, [])

  const handleEliminar = async (id: string) => {
    if (!confirm("¿Eliminar movimiento?")) return

    const res = await eliminarMovimiento(id)
    if (res.success) {
      toast({ title: "Movimiento eliminado" })
      cargar()
    } else {
      toast({ title: "Error", description: res.error, variant: "destructive" })
    }
  }

  if (loading) return <p>Cargando movimientos...</p>

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100">
      <BackButton href="/" />

      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Movimientos</h1>
            <p className="text-gray-500">Historial de ingresos y egresos</p>
          </div>

          <Link href="/movimientos/nuevo">
            <Button>+ Nuevo Movimiento</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Listado de Movimientos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Moneda</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {movimientos.map((m: any) => (
                  <TableRow key={m.id}>
                    <TableCell>{new Date(m.fecha).toLocaleDateString("es-AR")}</TableCell>
                    <TableCell>
                      <Badge className={m.tipo === "ingreso" ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"}>
                        {m.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell>${m.monto.toLocaleString("es-AR")}</TableCell>
                    <TableCell>{m.monedas?.codigo_iso}</TableCell>
                    <TableCell>{m.descripción || "-"}</TableCell>
                    <TableCell className="flex gap-2">
                      <Link href={`/movimientos/editar/${m.id}`}>
                        <Button variant="outline" size="sm">Editar</Button>
                      </Link>
                      <Button size="sm" variant="destructive" onClick={() => handleEliminar(m.id)}>
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

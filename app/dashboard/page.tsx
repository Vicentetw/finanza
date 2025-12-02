"use client"

import { useEffect, useState } from "react"
import { obtenerInversiones } from "@/app/actions/inversiones"
import { obtenerMovimientos } from "@/app/actions/movimientos"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import Link from "next/link"
import { calcularROI, calcularMontoInvertido } from "@/lib/utils/calculos"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { InversionesActivasCard } from "@/components/dashboard/inversiones-activas-card"
import { UltimosMovimientos } from "@/components/dashboard/ultimos-movimientos"

interface Investment {
  id: string
  plataformas: { nombre: string }
  instrumentos: { nombre: string }
  monedas: { codigo_iso: string }
  ppc_promedio: number
  cantidad: number
  comision_compra: number
  precio_venta?: number
  cantidad_vendida?: number
  comision_venta?: number
}

interface Movement {
  id: string
  fecha: string
  tipo: string
  monto: number
  monedas: { codigo_iso: string; simbolo: string }
  descripción?: string
}

export default function DashboardPage() {
  const [inversiones, setInversiones] = useState<Investment[]>([])
  const [movimientos, setMovimientos] = useState<Movement[]>([])
  const [loading, setLoading] = useState(true)
  const [saldoTotal, setSaldoTotal] = useState(0)
  const [roiTotal, setRoiTotal] = useState(0)

  useEffect(() => {
    async function loadData() {
      try {
        const [invData, movData] = await Promise.all([obtenerInversiones(), obtenerMovimientos()])

        setInversiones(invData)
        setMovimientos(movData)

        // Calcular saldo total
        let saldo = 0
        movData.forEach((mov: Movement) => {
          if (mov.tipo === "ingreso") {
            saldo += mov.monto
          } else {
            saldo -= mov.monto
          }
        })
        setSaldoTotal(saldo)

        // Calcular ROI promedio
        const inversionesFinalizadas = invData.filter((inv: Investment) => inv.precio_venta)
        if (inversionesFinalizadas.length > 0) {
          let roiSum = 0
          inversionesFinalizadas.forEach((inv: Investment) => {
            const montoInv = calcularMontoInvertido(inv.ppc_promedio, inv.cantidad, inv.comision_compra)
            const montoVenta = (inv.precio_venta || 0) * (inv.cantidad_vendida || 0) - (inv.comision_venta || 0)
            const roi = calcularROI(montoInv, montoVenta)
            roiSum += roi
          })
          setRoiTotal(roiSum / inversionesFinalizadas.length)
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const gananciasData = [
    { mes: "Ene", ganancia: 250 },
    { mes: "Feb", ganancia: 180 },
    { mes: "Mar", ganancia: 420 },
    { mes: "Abr", ganancia: 300 },
    { mes: "May", ganancia: 550 },
    { mes: "Jun", ganancia: 480 },
  ]

  const composicionData = [
    { name: "CEDEAR", value: 35 },
    { name: "Plazo Fijo", value: 25 },
    { name: "Cripto", value: 20 },
    { name: "Otros", value: 20 },
  ]

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <DashboardHeader saldoTotal={saldoTotal} roiTotal={roiTotal} inversionesActivas={inversiones.length} />

      <div className="px-4 md:px-8 pb-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ganancias Mensuales</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gananciasData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="ganancia" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Composición de Cartera</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={composicionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {composicionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <InversionesActivasCard inversiones={inversiones} />

        <UltimosMovimientos movimientos={movimientos.slice(0, 5)} />

        <div className="flex gap-4">
          <Link href="/inversiones">
            <Button variant="outline">Ver Todas las Inversiones</Button>
          </Link>
          <Link href="/movimientos">
            <Button variant="outline">Ver Todos los Movimientos</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

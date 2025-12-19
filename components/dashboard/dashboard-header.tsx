"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
// 🔥 BOTÓN DE LOGOUT
import { logout } from "@/app/actions/auth"; 

interface DashboardHeaderProps {
  saldoTotal: number
  roiTotal: number
  inversionesActivas: number
}

export function DashboardHeader({ saldoTotal, roiTotal, inversionesActivas }: DashboardHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 md:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Resumen de tus inversiones</p>
          </div>
          <Link href="/inversiones/nueva">
            <Button>+ Nueva Inversión</Button>
          </Link>
          <form action={logout}>
                    <Button variant="destructive">Cerrar sesión</Button>
                  </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Saldo Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                $
                {saldoTotal.toLocaleString("es-AR", {
                  maximumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-gray-500 mt-1">USD</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">ROI Promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-green-600">{roiTotal.toFixed(2)}%</div>
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Inversiones cerradas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Inversiones Activas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{inversionesActivas}</div>
              <p className="text-xs text-gray-500 mt-1">En seguimiento</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

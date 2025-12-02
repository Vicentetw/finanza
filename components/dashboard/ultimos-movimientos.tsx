"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownLeft } from "lucide-react"

interface UltimosMovimientosProps {
  movimientos: any[]
}

export function UltimosMovimientos({ movimientos }: UltimosMovimientosProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Últimos Movimientos</CardTitle>
      </CardHeader>
      <CardContent>
        {movimientos.length === 0 ? (
          <p className="text-gray-500">No hay movimientos</p>
        ) : (
          <div className="space-y-3">
            {movimientos.map((mov) => (
              <div key={mov.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {mov.tipo === "ingreso" ? (
                    <ArrowDownLeft className="w-5 h-5 text-green-600" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-red-600" />
                  )}
                  <div>
                    <div className="font-medium text-gray-900">
                      {mov.descripción || (mov.tipo === "ingreso" ? "Ingreso" : "Egreso")}
                    </div>
                    <div className="text-xs text-gray-500">{new Date(mov.fecha).toLocaleDateString("es-AR")}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${mov.tipo === "ingreso" ? "text-green-600" : "text-red-600"}`}>
                    {mov.tipo === "ingreso" ? "+" : "-"}${mov.monto.toLocaleString("es-AR")}
                  </div>
                  <div className="text-xs text-gray-500">{mov.monedas?.código_iso}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

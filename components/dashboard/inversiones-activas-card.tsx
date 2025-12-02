"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { calcularMontoInvertido } from "@/lib/utils/calculos"

interface InversionesActivasCardProps {
  inversiones: any[]
}

export function InversionesActivasCard({ inversiones }: InversionesActivasCardProps) {
  const activas = inversiones.filter((inv) => !inv.precio_venta)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inversiones Activas</CardTitle>
      </CardHeader>
      <CardContent>
        {activas.length === 0 ? (
          <p className="text-gray-500">No tienes inversiones activas</p>
        ) : (
          <div className="space-y-4">
            {activas.slice(0, 5).map((inv) => {
              const montoInv = calcularMontoInvertido(inv.ppc_promedio, inv.cantidad, inv.comision_compra)

              return (
                <div
                  key={inv.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {inv.instrumentos.nombre} - {inv.plataformas.nombre}
                    </div>
                    <div className="text-sm text-gray-500">
                      {inv.cantidad} unidades @ ${inv.ppc_promedio}
                    </div>
                    <div className="text-xs text-gray-400">Invertido: ${montoInv.toLocaleString("es-AR")}</div>
                  </div>
                  <Badge variant="outline">{inv.monedas.código_iso}</Badge>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

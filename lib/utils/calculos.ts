export function calcularROI(monto_invertido: number, monto_venta: number): number {
  if (monto_invertido === 0) return 0
  return ((monto_venta - monto_invertido) / monto_invertido) * 100
}

export function calcularComisión(monto: number, porcentaje: number): number {
  return (monto * porcentaje) / 100
}

export function calcularDiasInvertido(fecha_compra: Date, fecha_venta?: Date): number {
  const fin = fecha_venta || new Date()
  return Math.floor((fin.getTime() - fecha_compra.getTime()) / (1000 * 60 * 60 * 24))
}

export function calcularMontoInvertido(ppc: number, cantidad: number, comisión: number): number {
  return ppc * cantidad + comisión
}

export function convertirMoneda(monto: number, tasa: number): number {
  return monto * tasa
}

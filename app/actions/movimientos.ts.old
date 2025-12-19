"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function crearMovimiento(formData: {
  fecha: string
  tipo: "ingreso" | "egreso"
  monto: number
  moneda_id: string
  origen_id?: string
  destino_id?: string
  descripción?: string
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  try {
    const { error } = await supabase.from("movimientos").insert({
      usuario_id: user.id,
      fecha: formData.fecha,
      tipo: formData.tipo,
      monto: formData.monto,
      moneda_id: formData.moneda_id,
      origen_id: formData.origen_id,
      destino_id: formData.destino_id,
      descripción: formData.descripción,
    })

    if (error) throw error

    revalidatePath("/dashboard")
    revalidatePath("/movimientos")

    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function obtenerMovimientos() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("movimientos")
    .select(
      `
      *,
      monedas(codigo_iso, simbolo),
      orígenes(nombre),
      destinos(nombre)
    `,
    )
    .eq("usuario_id", user.id)
    .order("fecha", { ascending: false })

  if (error) throw error

  return data
}

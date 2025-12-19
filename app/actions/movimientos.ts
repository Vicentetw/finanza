"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// =============================
// OBTENER TODOS LOS MOVIMIENTOS
// =============================
export async function obtenerMovimientos() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("No autenticado")

  const { data, error } = await supabase
    .from("movimientos")
    .select(`
      *,
      monedas ( codigo_iso, simbolo ),
      origenes:orígenes ( nombre ),
      destinos ( nombre ),
      inversiones ( id, cantidad, ppc_promedio )
    `)
    .eq("usuario_id", user.id)
    .order("fecha", { ascending: false })

  if (error) throw error

  return data
}

// =============================
// OBTENER MOVIMIENTO POR ID
// =============================
export async function obtenerMovimientoPorId(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("movimientos")
    .select("*")
    .eq("id", id)
    .single()

  if (error) return null
  return data
}

// =============================
// CREAR MOVIMIENTO
// =============================
export async function crearMovimiento(values: any) {
  const supabase = await createClient()

  const { data: auth } = await supabase.auth.getUser()
  if (!auth?.user) return { success: false, error: "No autenticado" }

  const { error } = await supabase.from("movimientos").insert({
    ...values,
    usuario_id: auth.user.id,
  })

  if (error) return { success: false, error: error.message }

  revalidatePath("/movimientos")
  return { success: true, message: "Movimiento creado correctamente" }
}

// =============================
// ACTUALIZAR MOVIMIENTO
// =============================
export async function actualizarMovimiento(id: string, values: any) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("movimientos")
    .update(values)
    .eq("id", id)
    .select("*")

  if (error) return { success: false, error: error.message }

  revalidatePath(`/movimientos/editar/${id}`)
  revalidatePath("/movimientos")
  return { success: true, message: "Movimiento actualizado correctamente" }
}

// =============================
// ELIMINAR MOVIMIENTO
// =============================
export async function eliminarMovimiento(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("movimientos")
    .delete()
    .eq("id", id)

  if (error) return { success: false, error: error.message }

  revalidatePath("/movimientos")
  return { success: true, message: "Movimiento eliminado correctamente" }
}

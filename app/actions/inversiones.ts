"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Crear inversión
export async function crearInversión(formData: {
  plataforma_id: string
  instrumento_id: string
  moneda_id: string
  fecha_compra: string
  ppc_promedio: number
  cantidad: number
  notas?: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  try {
    const { data: comision } = await supabase
      .from("comisiones_plataforma")
      .select("porcentaje_compra")
      .eq("plataforma_id", formData.plataforma_id)
      .eq("instrumento_id", formData.instrumento_id)
      .single()

    const porcentaje = comision?.porcentaje_compra || 0
    const comision_compra = formData.ppc_promedio * formData.cantidad * (porcentaje / 100)

    const { data, error } = await supabase
      .from("inversiones")
      .insert({
        usuario_id: user.id,
        plataforma_id: formData.plataforma_id,
        instrumento_id: formData.instrumento_id,
        moneda_id: formData.moneda_id,
        fecha_compra: formData.fecha_compra,
        ppc_promedio: formData.ppc_promedio,
        cantidad: formData.cantidad,
        comision_compra,
        estado: "activa",
        notas: formData.notas,
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath("/dashboard")
    revalidatePath("/inversiones")

    return { success: true, data }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

// Obtener todas las inversiones
export async function obtenerInversiones() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("inversiones")
    .select(`
      *,
      plataformas(nombre),
      instrumentos(nombre),
      monedas(codigo_iso, simbolo)
    `)
    .eq("usuario_id", user.id)
    .order("fecha_compra", { ascending: false })

  if (error) throw error
  return data
}

// Obtener inversión por ID
export async function obtenerInversionPorId(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("inversiones")
    .select("*")
    .eq("usuario_id", user.id)
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}

// Actualizar inversión
export async function actualizarInversion(id: string, formData: any) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("inversiones")
    .update(formData)
    .eq("usuario_id", user.id)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/dashboard")
  revalidatePath("/inversiones")
  return { success: true, data }
}

// Eliminar inversión
export async function eliminarInversion(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { error } = await supabase
    .from("inversiones")
    .delete()
    .eq("usuario_id", user.id)
    .eq("id", id)

  if (error) throw error

  revalidatePath("/dashboard")
  revalidatePath("/inversiones")
  return { success: true }
}

// Vender inversión
export async function venderInversion(formData: {
  inversion_id: string
  cantidad_vendida: number
  precio_venta: number
  fecha_venta: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  try {
    const { data: inversion, error: getError } = await supabase
      .from("inversiones")
      .select("*")
      .eq("id", formData.inversion_id)
      .eq("usuario_id", user.id)
      .single()

    if (getError || !inversion) throw new Error("Investment not found")

    const { data: comision } = await supabase
      .from("comisiones_plataforma")
      .select("porcentaje_venta")
      .eq("plataforma_id", inversion.plataforma_id)
      .eq("instrumento_id", inversion.instrumento_id)
      .single()

    const porcentaje = comision?.porcentaje_venta || 0
    const comision_venta = formData.precio_venta * formData.cantidad_vendida * (porcentaje / 100)

    const { error: updateError } = await supabase
      .from("inversiones")
      .update({
        fecha_venta: formData.fecha_venta,
        precio_venta: formData.precio_venta,
        cantidad_vendida: formData.cantidad_vendida,
        comision_venta,
        estado: "finalizada",
      })
      .eq("id", formData.inversion_id)

    if (updateError) throw updateError

    revalidatePath("/dashboard")
    revalidatePath("/inversiones")
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

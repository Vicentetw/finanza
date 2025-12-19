// app/actions/catalogos.ts
"use server"
import { createClient } from "@/lib/supabase/server"

export async function obtenerPlataformas() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("plataformas").select("id, nombre")
  if (error) throw error
  return data
}

export async function obtenerInstrumentos() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("instrumentos").select("id, nombre")
  if (error) throw error
  return data
}

export async function obtenerMonedas() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("monedas").select("id, codigo_iso, simbolo")
  if (error) throw error
  return data
}
// ============================
// ORÍGENES (por usuario)
// ============================
export async function obtenerOrigenes() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("orígenes")
    .select("id, nombre")
    .eq("usuario_id", user.id)
    .eq("activo", true)
    .order("nombre")

  if (error) throw error
  return data
}

// ============================
// DESTINOS (por usuario)
// ============================
export async function obtenerDestinos() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("destinos")
    .select("id, nombre")
    .eq("usuario_id", user.id)
    .eq("activo", true)
    .order("nombre")

  if (error) throw error
  return data
}

// ============================
// INVERSIONES (para select)
// ============================
export async function obtenerInversiones() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("inversiones")
    .select(`
      id,
      instrumentos ( nombre ),
      plataformas ( nombre )
    `)
    .eq("usuario_id", user.id)
    .order("creada_en", { ascending: false })

  if (error) throw error
  return data
}
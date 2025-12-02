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

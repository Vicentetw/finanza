// app/actions/plataformas.ts
"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function obtenerPlataformasAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("plataformas").select("*").order("nombre");
  if (error) throw error;
  return data;
}

export async function crearPlataformaServer(payload: any) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("plataformas").insert(payload).select().single();
  if (error) throw error;
  revalidatePath("/plataformas");
  return data;
}

export async function actualizarPlataformaServer(id: string, payload: any) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("plataformas").update(payload).eq("id", id).select().single();
  if (error) throw error;
  revalidatePath("/plataformas");
  return data;
}

export async function eliminarPlataformaServer(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("plataformas").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/plataformas");
  return true;
}

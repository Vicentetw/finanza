"use server";

import { createClient } from "@/lib/supabase/server";

export async function obtenerComision(
  plataforma_id: string,
  instrumento_id: string,
  tipo: "compra" | "venta" = "compra"
) {
  const supabase = await createClient();

  // Log de IDs que llegan
  console.log("[obtenerComision] plataforma_id:", plataforma_id, "instrumento_id:", instrumento_id);

  if (!plataforma_id || !instrumento_id) {
    console.warn("[obtenerComision] Falta plataforma_id o instrumento_id, devolviendo 0");
    return { porcentaje: 0 };
  }

  const { data, error } = await supabase
    .from("comisiones_plataforma")
    .select("porcentaje_compra, porcentaje_venta, plataforma_id, instrumento_id")
    .eq("plataforma_id", plataforma_id)
    .eq("instrumento_id", instrumento_id)
    .maybeSingle();

  if (error) {
    console.error("[obtenerComision] Error en consulta:", error);
    return { porcentaje: 0 };
  }

  if (!data) {
    console.warn("[obtenerComision] No se encontró comisión, devolviendo 0");
    return { porcentaje: 0 };
  }

  const porcentaje = tipo === "compra" ? parseFloat(data.porcentaje_compra) : parseFloat(data.porcentaje_venta);
  console.log("[obtenerComision] Comisión encontrada:", porcentaje);

  return { porcentaje };
}
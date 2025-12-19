"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// -----------------------------------------
// OBTENER TODAS LAS INVERSIONES
// -----------------------------------------
export async function obtenerInversiones() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("inversiones")
    .select(`
      *,
      instrumentos ( nombre ),
      plataformas ( nombre ),
      monedas ( codigo_iso )
    `)
    .order("creada_en", { ascending: false });

  if (error) throw error;
  return data;
}

// -----------------------------------------
// CREAR UNA INVERSIÓN
// -----------------------------------------

export async function crearInversion(values: any) {
  const supabase = await createClient();

  try {
    const { data: authUser } = await supabase.auth.getUser();
    if (!authUser?.user) {
      return { success: false, error: "No autenticado" };
    }

    const { error } = await supabase
      .from("inversiones")
      .insert({
        ...values,
        usuario_id: authUser.user.id,
      });

    if (error) {
      console.error("Error creando inversión:", error);
      return { success: false, error: error.message };
    }

    // Revalidamos la cache
    revalidatePath("/inversiones");

    return { success: true, message: "Inversión creada correctamente" };
  } catch (err: any) {
    console.error("Error creando inversión:", err);
    return { success: false, error: err.message };
  }
}


// -----------------------------------------
// ACTUALIZAR UNA INVERSIÓN
// -----------------------------------------
export async function actualizarInversion(id: string, values: any) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("inversiones")
    .update(values)
    .eq("id", id)
    .select("*"); // <- Aquí agregamos select para traer todas las columnas

  if (error) {
    console.error("Error actualizando inversión:", error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/inversiones/editar/${id}`);
  revalidatePath("/inversiones");
  return { success: true, message: "Inversión actualizada correctamente" };
}

// -----------------------------------------
// ELIMINAR UNA INVERSIÓN
// -----------------------------------------
export async function eliminarInversion(id: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("inversiones")
      .delete()
      .eq("id", id); // <- NO select()

    if (error) {
      console.error("Error eliminando inversión:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/inversiones");

    return { success: true, message: "Inversión eliminada correctamente" };
  } catch (err: any) {
    console.error("Error eliminando inversión:", err);
    return { success: false, error: err.message };
  }
}

// -----------------------------------------
// OBTENER UNA INVERSIÓN POR ID
// -----------------------------------------
export async function obtenerInversionPorId(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("inversiones")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error obteniendo inversión:", error);
    return null;
  }

  return data;
}

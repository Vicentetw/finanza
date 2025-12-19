import { eliminarInversion as eliminarInversionServer } from "@/app/actions/inversiones";
// Obtener todas las inversiones
export async function obtenerInversiones() {
  const res = await fetch("/api/inversiones", { cache: "no-store" });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error || "Error obteniendo inversiones");
  }
  return res.json();
}

// Crear inversión
export async function crearInversion(data: any) {
  const res = await fetch("/api/inversiones", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error || "Error creando inversión");
  }
  return res.json();
}

// Actualizar inversión
export async function actualizarInversion(id: string, data: any) {
  const res = await fetch(`/api/inversiones/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error || "Error actualizando inversión");
  }
  return res.json();
}

// Eliminar inversión
export async function eliminarInversion(id: string) {
  const result = await eliminarInversionServer(id);

  if (!result.success) {
    throw new Error(result.error ?? "Error eliminando inversión");
  }

  return true;
}

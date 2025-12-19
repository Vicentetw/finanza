"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Plataforma = {
  id: string;
  nombre: string;
  logo_url?: string | null;
  url_oficial?: string | null;
  activa?: boolean;
  notas?: string | null;
  comision_default?: number;
};

export default function PlataformasPage() {
  const [plataformas, setPlataformas] = useState<Plataforma[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/plataformas");
    const json = await res.json();
    if (json.success) setPlataformas(json.data || []);
    else toast.error(json.error || "Error al cargar plataformas");
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar plataforma?")) return;
    const res = await fetch("/api/plataformas", { method: "DELETE", body: JSON.stringify({ id }) });
    const json = await res.json();
    if (json.success) {
      toast.success("Plataforma eliminada");
      setPlataformas((p) => p.filter((x) => x.id !== id));
    } else {
      toast.error(json.error || "Error al eliminar");
    }
  }

  if (loading) return <div className="p-8">Cargando plataformas...</div>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Plataformas</h1>
        <Link href="/plataformas/nueva">
          <Button>Agregar Plataforma</Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {plataformas.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{p.nombre}</span>
                <div className="flex gap-2">
                  <Link href={`/api/plataformas/editar/${p.id}`}>
                    <Button size="sm">Editar</Button>
                  </Link>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}>
                    Eliminar
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Comisión % (default)</Label>
                <div>{(p.comision_default ?? 0).toString()}</div>
              </div>
              <div>
                <Label>URL</Label>
                <div>{p.url_oficial}</div>
              </div>
              <div>
                <Label>Activa</Label>
                <div>{p.activa ? "Sí" : "No"}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

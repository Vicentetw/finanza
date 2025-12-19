"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function EditarPlataformaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    url_oficial: "",
    logo_url: "",
    comision_default: "0",
    notas: "",
    activa: true,
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch("/api/plataformas");
      const json = await res.json();
      if (json.success) {
        const p = json.data.find((x: any) => x.id === id);
        if (p) {
          setForm({
            nombre: p.nombre || "",
            url_oficial: p.url_oficial || "",
            logo_url: p.logo_url || "",
            comision_default: (p.comision_default ?? 0).toString(),
            notas: p.notas || "",
            activa: p.activa ?? true,
          });
        } else {
          toast.error("Plataforma no encontrada");
          router.push("/plataformas");
        }
      } else {
        toast.error(json.error || "Error al cargar");
      }
      setLoading(false);
    }
    if (id) load();
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      id,
      nombre: form.nombre,
      url_oficial: form.url_oficial,
      logo_url: form.logo_url,
      comision_default: Number(form.comision_default || 0),
      notas: form.notas,
      activa: form.activa,
    };
    const res = await fetch("/api/plataformas", { method: "PUT", body: JSON.stringify(payload) });
    const json = await res.json();
    setSaving(false);
    if (json.success) {
      toast.success("Guardado");
      router.push("/plataformas");
    } else {
      toast.error(json.error || "Error al guardar");
    }
  }

  if (loading) return <div className="p-8">Cargando...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Editar Plataforma</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label>Nombre</Label>
              <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            </div>

            <div>
              <Label>URL oficial</Label>
              <Input value={form.url_oficial} onChange={(e) => setForm({ ...form, url_oficial: e.target.value })} />
            </div>

            <div>
              <Label>Logo URL</Label>
              <Input value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} />
            </div>

            <div>
              <Label>Comisión % por defecto</Label>
              <Input
                type="number"
                step="0.01"
                value={form.comision_default}
                onChange={(e) => setForm({ ...form, comision_default: e.target.value })}
              />
            </div>

            <div>
              <Label>Notas</Label>
              <Input value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>{saving ? "Guardando..." : "Guardar"}</Button>
              <Button variant="outline" onClick={() => router.push("/plataformas")}>Cancelar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

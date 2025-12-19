"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function NuevaPlataformaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    url_oficial: "",
    logo_url: "",
    comision_default: "0",
    notas: "",
    activa: true,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      comision_default: Number(form.comision_default || 0),
    };
    const res = await fetch("/api/plataformas", { method: "POST", body: JSON.stringify(payload) });
    const json = await res.json();
    setLoading(false);
    if (json.success) {
      toast.success("Plataforma creada");
      router.push("/plataformas");
    } else {
      toast.error(json.error || "Error al crear");
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Nueva Plataforma</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nombre</Label>
              <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
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
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Crear"}
              </Button>
              <Button variant="outline" onClick={() => router.push("/plataformas")}>Cancelar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// app/api/plataformas/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("plataformas")
      .select("*")
      .order("nombre", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = await createClient();

    const payload = {
      nombre: body.nombre,
      logo_url: body.logo_url ?? null,
      url_oficial: body.url_oficial ?? null,
      activa: body.activa ?? true,
      notas: body.notas ?? null,
      comision_default: body.comision_default ?? 0,
    };

    const { data, error } = await supabase.from("plataformas").insert(payload).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;
    if (!id) return NextResponse.json({ success: false, error: "id required" }, { status: 400 });

    const supabase = await createClient();
    const payload: any = {
      nombre: body.nombre,
      logo_url: body.logo_url ?? null,
      url_oficial: body.url_oficial ?? null,
      activa: body.activa ?? true,
      notas: body.notas ?? null,
      comision_default: body.comision_default ?? 0,
    };

    const { data, error } = await supabase.from("plataformas").update(payload).eq("id", id).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;
    if (!id) return NextResponse.json({ success: false, error: "id required" }, { status: 400 });

    const supabase = await createClient();
    const { error } = await supabase.from("plataformas").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

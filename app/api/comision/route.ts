import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const { plataforma_id, instrumento_id, tipo_operacion } = await req.json()

  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("comisiones_plataforma")
      .select("*")
      .eq("plataforma_id", plataforma_id)
      .eq("instrumento_id", instrumento_id)
      .eq("tipo_operacion", tipo_operacion)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data })
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}


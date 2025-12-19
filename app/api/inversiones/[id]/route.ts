import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(_: any, { params }: any) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("inversiones")
    .select("*, instrumentos(*), plataformas(*)")
    .eq("id", params.id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(request: Request, { params }: any) {
  const supabase = await createClient()
  const body = await request.json()

  const { data, error } = await supabase
    .from("inversiones")
    .update(body)
    .eq("id", params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_: any, { params }: any) {
  const supabase = await createClient()

  const { error } = await supabase.from("inversiones").delete().eq("id", params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

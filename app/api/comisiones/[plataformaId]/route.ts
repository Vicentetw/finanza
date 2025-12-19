import { createClient } from "@/lib/supabase/server";

export async function GET(
  req: Request,
  { params }: { params: { plataformaId: string } }
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("comisiones_plataforma")
    .select("comision")
    .eq("plataforma_id", params.plataformaId)
    .single();

  if (error) {
    return Response.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return Response.json({ comision: data.comision });
}

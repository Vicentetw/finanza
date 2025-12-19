export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { id, email } = await req.json();
  const supabase = createClient();

  const { data, error } = await supabase
    .from("users")
    .upsert({ id, email }, { onConflict: "id" });

  if (error) return NextResponse.json({ success: false, error: error.message });

  return NextResponse.json({ success: true, data });
}

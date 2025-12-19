import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set(name, value, options)
            } catch (e) {
              console.error("cannot set cookie:", e)
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set(name, "", { ...options, maxAge: 0 })
            } catch (e) {
              console.error("cannot remove cookie:", e)
            }
          }
        }
      }
    )

    const { data, error } = await supabase
      .from("inversiones")
      .select(`
        *,
        plataformas(*),
        instrumentos(*)
      `)
      .order("creada_en", { ascending: false })

    if (error) {
      console.error("SUPABASE ERROR:", error)
      return NextResponse.json({ error: true, message: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (e) {
    console.error("API ERROR:", e)
    return NextResponse.json({ error: true, message: "Server error" }, { status: 500 })
  }
}

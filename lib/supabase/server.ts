// lib/supabase/server.ts
import { cookies as getCookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createClient() {
  const cookieStore = await getCookies(); // 👈 NECESARIO EN NEXT 15/16

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options) {
          try {
            cookieStore.set(name, value, options);
          } catch {
            // Ignorar errores de server actions
          }
        },
        remove(name: string, options) {
          try {
            cookieStore.set(name, "", options);
          } catch {}
        },
      },
    }
  );
}

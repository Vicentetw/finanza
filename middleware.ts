import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value ?? null,
        set: (name, value, options) => {
          try {
            response.cookies.set(name, value, options as any);
          } catch {}
        },
        remove: (name, options) => {
          try {
            response.cookies.delete(name);
          } catch {}
        },
      },
    }
  );

  return response;
}

// ❗❗ IMPORTANTÍSIMO: NO INTERCEPTAR /api
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};

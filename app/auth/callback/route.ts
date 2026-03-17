import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in search params, use it as the redirection URL
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        // we can be sure that origin is http://localhost:3000
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Forward error params from Supabase (e.g. otp_expired) so the error page can show a helpful message
  const errorCode = searchParams.get("error_code");
  const errorDesc = searchParams.get("error_description");
  const params = new URLSearchParams();
  if (errorCode) params.set("error_code", errorCode);
  if (errorDesc) params.set("error_description", errorDesc);
  const qs = params.toString();
  const errorPath = `/auth/auth-code-error${qs ? `?${qs}` : ""}`;
  return NextResponse.redirect(`${origin}${errorPath}`);
}

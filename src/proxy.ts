import { NextResponse, type NextRequest } from "next/server";
import { decrypt, SESSION_COOKIE } from "@/lib/jwt";

// Optimistic redirect only; pages and server actions re-check via verifySession().
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await decrypt(req.cookies.get(SESSION_COOKIE)?.value);
  const isLogin = pathname === "/admin/login";

  if (!session && !isLogin) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }
  if (session && isLogin) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

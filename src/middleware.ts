import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "portfolio_admin_session";

function isPublicApi(pathname: string, method: string) {
  if (pathname === "/api/auth/login" || pathname === "/api/auth/logout") return true;
  // Public reads
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method.toUpperCase();

  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isApi = pathname.startsWith("/api/");

  if (isApi && isPublicApi(pathname, method)) {
    return NextResponse.next();
  }

  if (!isAdminPage && !isApi) {
    return NextResponse.next();
  }

  // Protect admin pages + mutating API routes
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    if (isApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("no secret");
    await jwtVerify(token, new TextEncoder().encode(secret));
    return NextResponse.next();
  } catch {
    if (isApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};

import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const PROTECTED_PATHS = ["/admin", "/inquiries"];
const PUBLIC_PATHS = ["/admin/login", "/inquiries/login"];

function safeRedirect(destination: string, req: NextRequest): NextResponse {
  const url = req.nextUrl.clone();
  url.pathname = destination;
  url.search = "";
  return NextResponse.redirect(url);
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  if (!isProtected || isPublic) return NextResponse.next();

  const token =
    req.cookies.get("admin-token")?.value ??
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    if (pathname.startsWith("/inquiries")) return safeRedirect("/inquiries/login", req);
    return safeRedirect("/admin/login", req);
  }

  const payload = verifyToken(token);
  if (!payload) {
    if (pathname.startsWith("/inquiries")) return safeRedirect("/inquiries/login", req);
    return safeRedirect("/admin/login", req);
  }

  // Admin routes require admin role
  if (pathname.startsWith("/admin") && payload.role !== "admin") {
    return safeRedirect("/admin/login", req);
  }

  const res = NextResponse.next();
  res.headers.set("x-user-id", String(payload.userId));
  res.headers.set("x-user-role", payload.role);
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/inquiries", "/inquiries/((?!login).+)"],
};

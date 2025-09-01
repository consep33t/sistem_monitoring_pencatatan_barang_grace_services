// middleware.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Boleh lewat tanpa login
  if (pathname === "/" || pathname.startsWith("/api/auth/login")) {
    return NextResponse.next();
  }

  // Ambil token dari cookie
  const token = req.cookies.get("token")?.value;

  // Kalau tidak ada token
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    // Verifikasi token
    jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.next();
  } catch (err) {
    // Token invalid / expired
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"], //
};

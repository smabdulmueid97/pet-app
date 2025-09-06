// File: src/middleware.ts

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!token;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  if (isAuthPage) {
    if (isLoggedIn) {
      // If logged in, redirect away from auth pages to the main dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    // If not logged in, allow access to the auth page
    return null;
  }

  // For any other page, if the user is not logged in, redirect to the login page
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role-based redirects for logged-in users
  const userRole = token.role;
  if (
    pathname.startsWith("/admin") &&
    userRole !== "admin" &&
    userRole !== "staff"
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  if (pathname.startsWith("/dashboard") && userRole !== "customer") {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login", "/register"],
};

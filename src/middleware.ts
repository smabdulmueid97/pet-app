// File: src/middleware.ts

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!token;

  // --- NEW: Rule for the Homepage ---
  if (pathname === "/") {
    if (isLoggedIn) {
      // If logged in, redirect to their appropriate dashboard
      const dashboardUrl =
        token.role === "admin" || token.role === "staff"
          ? "/admin/dashboard"
          : "/dashboard";
      return NextResponse.redirect(new URL(dashboardUrl, req.url));
    }
    // If not logged in, redirect to the login page
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password");

  // Rule for Logged-In Users
  if (isLoggedIn) {
    if (isAuthPage) {
      const dashboardUrl =
        token.role === "admin" || token.role === "staff"
          ? "/admin/dashboard"
          : "/dashboard";
      return NextResponse.redirect(new URL(dashboardUrl, req.url));
    }

    const userRole = token.role;
    if (pathname.startsWith("/admin") && userRole === "customer") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    if (
      pathname.startsWith("/dashboard") &&
      (userRole === "admin" || userRole === "staff")
    ) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  }

  // Rule for Logged-Out Users
  if (!isLoggedIn) {
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

// This config specifies which routes the middleware should run on.
export const config = {
  matcher: [
    "/", // ADDED: The root homepage route
    "/admin/:path*",
    "/dashboard/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};

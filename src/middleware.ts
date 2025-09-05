// File: src/middleware.ts

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // Get the token from the request to check for a session
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;
  const isLoggedIn = !!token;

  // Define pages that logged-in users should be redirected AWAY from
  const publicOnlyPaths = [
    "/login",
    "/admin/login",
    "/register",
    "/forgot-password",
  ];

  // --- REDIRECT LOGIC ---

  // 1. If a user is logged in and tries to access a login/register page
  if (isLoggedIn && publicOnlyPaths.includes(pathname)) {
    // Redirect them to their appropriate dashboard
    if (token.role === "admin" || token.role === "staff") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    // All other roles (e.g., "customer") go to the main dashboard
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 2. If a user is NOT logged in and tries to access a protected page
  const isProtectedRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  if (!isLoggedIn && isProtectedRoute) {
    // If trying to access an admin page, redirect to admin login
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    // Otherwise, redirect to the general customer login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 3. If a logged-in user tries to access a page they don't have the role for
  if (isLoggedIn) {
    const userRole = token.role;
    // Customer trying to access admin pages
    if (userRole === "customer" && pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/dashboard", req.url)); // Redirect to their own dashboard
    }
    // Admin/Staff trying to access customer dashboard
    if (
      (userRole === "admin" || userRole === "staff") &&
      pathname.startsWith("/dashboard")
    ) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url)); // Redirect to their own dashboard
    }
  }

  // If none of the above conditions are met, allow the request to continue
  return NextResponse.next();
}

// This config specifies which routes the middleware should run on.
export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/login",
    "/admin/login",
    "/register",
    "/forgot-password",
  ],
};

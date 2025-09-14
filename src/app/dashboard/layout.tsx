// File: src/app/dashboard/layout.tsx

"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  // Redirect if user is not a customer
  if (session?.user?.role !== "customer") {
    redirect("/login");
    return null;
  }

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "My Profile", href: "/dashboard/profile" },
    { name: "My Appointments", href: "/dashboard/my-appointments" },
  ];

  return (
    <div className="flex min-h-screen bg-amber-50 dark:bg-black">
      {/* Sidebar */}
      <aside
        className={`w-64 bg-white p-4 dark:bg-gray-800 text-gray-900 dark:text-white transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative h-full md:h-auto z-20 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-2xl font-bold">
            PetApp
          </Link>
        </div>
        <nav className="space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`block px-4 py-2 rounded ${
                pathname === link.href
                  ? "bg-amber-500 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => setIsSidebarOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header for mobile */}
        <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 md:justify-end">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <span>Welcome, {session.user?.name}!</span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-4 py-2 text-sm font-semibold text-white bg-amber-500 rounded-md hover:bg-amber-600"
            >
              Sign Out
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

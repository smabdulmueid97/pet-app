// File: src/app/admin/layout.tsx

"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function AdminLayout({
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

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!session || !["admin", "staff"].includes(session.user?.role || "")) {
    redirect("/login");
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <aside
        className={`w-64 bg-white p-4 dark:bg-gray-800 text-gray-900 dark:text-white transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative h-full md:h-auto z-20 transition-transform duration-300 ease-in-out`}
      >
        <h1 className="mb-6 text-2xl font-bold">Admin Portal</h1>
        <nav className="space-y-2">
          <Link
            href="/admin/dashboard"
            className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsSidebarOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="#"
            className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsSidebarOpen(false)}
          >
            Appointments
          </Link>

          {session.user?.role === "admin" && (
            <>
              <hr className="my-2 border-gray-200 dark:border-gray-600" />
              <p className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 uppercase">
                Management
              </p>
              <Link
                href="/admin/managestaff"
                className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsSidebarOpen(false)}
              >
                Manage Staff
              </Link>
              <Link
                href="#"
                className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsSidebarOpen(false)}
              >
                Services
              </Link>
            </>
          )}
        </nav>
      </aside>

      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 md:hidden">
          <h1 className="text-xl font-bold">Admin Portal</h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
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
        </header>
        <main className="flex-1 p-4 md:p-8 bg-amber-50 dark:bg-black">
          {children}
        </main>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

// File: src/app/admin/layout.tsx

import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

// This is a server component, so we can fetch session data directly
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  // Redirect if the user is not an admin or staff
  // This is a secondary check; the primary check is in the middleware.
  if (!session || !["admin", "staff"].includes(session.user?.role || "")) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="w-64 p-4 text-white bg-gray-800">
        <h1 className="mb-6 text-2xl font-bold">Admin Portal</h1>
        <nav className="space-y-2">
          <Link
            href="/admin/dashboard"
            className="block px-4 py-2 rounded hover:bg-gray-700"
          >
            Dashboard
          </Link>
          <Link href="#" className="block px-4 py-2 rounded hover:bg-gray-700">
            Appointments
          </Link>

          {/* Admin-only links */}
          {session.user?.role === "admin" && (
            <>
              <hr className="my-2 border-gray-600" />
              <p className="px-4 py-2 text-xs text-gray-400 uppercase">
                Management
              </p>
              <Link
                href="#"
                className="block px-4 py-2 rounded hover:bg-gray-700"
              >
                Manage Staff
              </Link>
              <Link
                href="#"
                className="block px-4 py-2 rounded hover:bg-gray-700"
              >
                Services
              </Link>
            </>
          )}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 bg-amber-50">{children}</main>
    </div>
  );
}

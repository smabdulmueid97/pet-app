// File: src/app/dashboard/page.tsx

import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function CustomerDashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-amber-50">
      <div className="w-full max-w-2xl p-8 space-y-6 text-center bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold">Welcome, {session?.user?.name}!</h1>
        <p className="text-lg text-gray-600">
          This is your personal dashboard. Here you can manage your appointments
          and pets.
        </p>
        <div className="pt-4">
          <Link
            href="#"
            className="px-6 py-3 font-semibold text-white bg-amber-500 rounded-md hover:bg-amber-600"
          >
            Book a New Appointment
          </Link>
        </div>
        <div className="pt-2">
          <Link
            href="/api/auth/signout"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Sign Out
          </Link>
        </div>
      </div>
    </main>
  );
}

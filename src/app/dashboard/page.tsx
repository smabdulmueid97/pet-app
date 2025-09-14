// File: src/app/dashboard/page.tsx

import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function CustomerDashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="w-full max-w-4xl p-8 space-y-6 text-center bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h1 className="text-4xl font-bold">Welcome, {session?.user?.name}!</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        This is your personal dashboard. Here you can manage your appointments
        and pets.
      </p>
      <div className="pt-4">
        <Link
          href="/dashboard/book-appointment"
          className="px-6 py-3 font-semibold text-white bg-amber-500 rounded-md hover:bg-amber-600"
        >
          Book a New Appointment
        </Link>
      </div>
    </div>
  );
}

// File: src/app/admin/dashboard/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold">Welcome, {session?.user?.name}!</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Here are the latest metrics and revenue at a glance.
      </p>

      {/* Placeholder for Metrics and Graphs */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Total Revenue</h3>
          <p className="mt-2 text-3xl font-bold">$12,345</p>
          <p className="mt-1 text-sm text-green-500">+5% from last month</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">New Customers</h3>
          <p className="mt-2 text-3xl font-bold">67</p>
          <p className="mt-1 text-sm text-green-500">+12% from last month</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Appointments</h3>
          <p className="mt-2 text-3xl font-bold">124</p>
          <p className="mt-1 text-sm text-red-500">-2% from last month</p>
        </div>
        {/* You can add more metric cards or graph components here */}
      </div>
    </div>
  );
}

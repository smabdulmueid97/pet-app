// File: src/app/admin/managestaff/page.tsx

import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import { authOptions } from "../../api/auth/[...nextauth]/route";

interface DbUser {
  _id: ObjectId;
  name?: string | null;
  email?: string | null;
  role?: string | null;
}

interface User {
  _id: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
}

async function getUsers(): Promise<User[]> {
  const client = await clientPromise;
  const db = client.db();
  const users = await db.collection<DbUser>("users").find({}).toArray();
  return users.map((user) => ({
    ...user,
    _id: user._id.toString(),
  }));
}

export default async function ManageStaffPage() {
  const users = await getUsers();

  return (
    <div className="text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold">User Management</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        View and manage all users in the system.
      </p>

      <div className="mt-8">
        {/* Responsive User List */}
        <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          {/* Desktop Table Head */}
          <div className="hidden md:grid md:grid-cols-3 p-4 font-semibold border-b border-gray-200 dark:border-gray-700">
            <div>Name</div>
            <div>Email</div>
            <div>Role</div>
          </div>

          {/* User Rows / Cards */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <div
                key={user._id}
                className="grid grid-cols-1 p-4 md:grid-cols-3 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {/* Mobile view with labels */}
                <div className="md:hidden">
                  <div className="flex justify-between">
                    <span className="font-semibold">Name:</span>
                    <span>{user.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Email:</span>
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Role:</span>
                    <span className="capitalize">{user.role}</span>
                  </div>
                </div>

                {/* Desktop view */}
                <div className="hidden md:block">{user.name}</div>
                <div className="hidden md:block">{user.email}</div>
                <div className="hidden md:block capitalize">{user.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

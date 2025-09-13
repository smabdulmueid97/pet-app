// File: src/app/admin/dashboard/page.tsx

import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb"; // Import ObjectId for database typing
import { authOptions } from "../../api/auth/[...nextauth]/route";

// Define the shape of a user document coming directly from MongoDB
interface DbUser {
  _id: ObjectId;
  name?: string | null;
  email?: string | null;
  role?: string | null;
  // Add any other fields you expect
}

// Define the shape of the user data after we process it for the component
interface User {
  _id: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
}

async function getUsers(): Promise<User[]> {
  const client = await clientPromise;
  const db = client.db();

  // Tell the collection what type of documents to expect
  const users = await db.collection<DbUser>("users").find({}).toArray();

  // The map function will now return the correct User type
  return users.map((user) => ({
    ...user,
    _id: user._id.toString(),
  }));
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  const users = await getUsers();

  return (
    <div className="text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold">Welcome, {session?.user?.name}!</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        You are logged in as an{" "}
        <span className="font-semibold">{session?.user?.role}</span>.
      </p>

      <div className="mt-8">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="p-4 mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <table className="w-full text-left">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {/* TypeScript now understands the shape of 'user' */}
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2 capitalize">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

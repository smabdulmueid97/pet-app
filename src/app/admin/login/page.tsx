// File: src/app/admin/login/page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { GoogleIcon } from "@/components/GoogleIcon";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Staff"); // Role state is for UI, not sent to signIn
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Handle redirect manually
    });

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
    } else if (result?.ok) {
      // On success, redirect to the admin dashboard
      router.push("/admin/dashboard");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>

      <div className="w-full max-w-sm p-6 space-y-4 text-center">
        <img
          src="/images/logo.png"
          alt="Pet Grooming Logo"
          width="240"
          height="80"
          className="mx-auto"
        />

        <div className="login-card">
          <div className="text-center">
            <h1 className="card-header">Team Portal</h1>
            <p className="card-subheader">Admin & Staff Login</p>
          </div>

          <button
            onClick={() =>
              signIn("google", { callbackUrl: "/admin/dashboard" })
            }
            className="google-btn"
          >
            <GoogleIcon className="w-6 h-6" />
            Sign In with Google
          </button>

          <div className="flex items-center my-4">
            <hr className="w-full border-gray-300 dark:border-gray-700" />
            <span className="px-2 text-sm text-gray-500 dark:text-gray-400">
              OR
            </span>
            <hr className="w-full border-gray-300 dark:border-gray-700" />
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <p className="text-sm text-center text-red-500">{error}</p>
            )}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="Work Email Address"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Password"
            />

            <div className="flex items-center justify-end text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-amber-600 hover:text-amber-500 dark:text-amber-500 dark:hover:text-amber-400"
              >
                Forgot password?
              </Link>
            </div>

            <fieldset>
              <div className="flex items-center justify-around">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="Staff"
                    checked={role === "Staff"}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-offset-gray-900"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Staff
                  </span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="Admin"
                    checked={role === "Admin"}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-offset-gray-900"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Admin
                  </span>
                </label>
              </div>
            </fieldset>
            <button
              type="submit"
              className="w-full px-4 py-3 font-semibold text-white bg-amber-500 rounded-md shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-300 dark:focus:ring-offset-black"
            >
              Sign In
            </button>
          </form>
        </div>

        <p className="text-xs text-center text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} TEST. All rights reserved.
        </p>
      </div>
    </main>
  );
}

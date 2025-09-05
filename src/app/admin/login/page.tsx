// File: src/app/admin/login/page.tsx

"use client";

import { useState } from "react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Staff");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Admin/Staff login attempt with:", { email, password, role });
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>

      <div className="w-full max-w-sm p-6 space-y-6 text-center">
        <img
          src="/images/logo.png"
          alt="Pet Grooming Logo"
          width="240"
          height="80"
          className="mx-auto"
        />

        <div className="login-card">
          <div className="text-center">
            {/* UPDATED: Using new custom classes */}
            <h1 className="card-header">Team Portal</h1>
            <p className="card-subheader">Admin & Staff Login</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
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
      </div>
    </main>
  );
}

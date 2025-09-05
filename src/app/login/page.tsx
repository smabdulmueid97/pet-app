// File: src/app/login/page.tsx

"use client";

import { useState } from "react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export default function CustomerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Customer login attempt with:", { email, password });
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
            <h1 className="card-header">Welcome!</h1>
            <p className="card-subheader">Sign in to your account.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="Email Address"
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
              <a
                href="#"
                className="font-medium text-amber-600 hover:text-amber-500 dark:text-amber-500 dark:hover:text-amber-400"
              >
                Forgot password?
              </a>
            </div>
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

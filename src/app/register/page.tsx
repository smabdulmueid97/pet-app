// File: src/app/register/page.tsx

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { GoogleIcon } from "@/components/GoogleIcon"; // We will create this component

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // This is where you would call your backend API endpoint
    // to handle email/password registration and save the user to MongoDB.
    console.log("Registering with:", { name, email, password });
    // Example:
    /*
    await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    */
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
            <h1 className="card-header">Create Account</h1>
            <p className="card-subheader">Only for customers</p>
          </div>

          <div className="flex flex-col w-full gap-2">
            <button
              onClick={() => signIn("google", { callbackUrl: "/" })} // Redirect to home page after sign-in
              className="flex items-center justify-center w-full gap-3 px-4 py-3 font-semibold text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:border-gray-700"
            >
              <GoogleIcon className="w-6 h-6" />
              Sign Up with Google
            </button>
          </div>

          <div className="flex items-center my-4">
            <hr className="w-full border-gray-300 dark:border-gray-700" />
            <span className="px-2 text-sm text-gray-500 dark:text-gray-400">
              OR
            </span>
            <hr className="w-full border-gray-300 dark:border-gray-700" />
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              placeholder="Full Name"
            />
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
            <button
              type="submit"
              className="w-full px-4 py-3 font-semibold text-white bg-amber-500 rounded-md shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-300 dark:focus:ring-offset-black"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

// File: src/app/register/page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { GoogleIcon } from "@/components/GoogleIcon";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    // Step 1: Call our new registration API endpoint
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      // If registration failed, show the error message
      setError(data.message || "Something went wrong.");
      return;
    }

    // Step 2: If registration is successful, automatically sign the user in
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      // This might happen if auto-login fails, show an error but acknowledge registration
      setError(
        "Account created, but auto-login failed. Please log in manually."
      );
    } else if (result?.ok) {
      // On successful login, refresh the page. The middleware will redirect them.
      router.refresh();
    }
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

          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="google-btn"
          >
            <GoogleIcon className="w-6 h-6" />
            Sign Up with Google
          </button>

          <div className="flex items-center my-4">
            <hr className="w-full border-gray-300 dark:border-gray-700" />
            <span className="px-2 text-sm text-gray-500 dark:text-gray-400">
              OR
            </span>
            <hr className="w-full border-gray-300 dark:border-gray-700" />
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && <p className="text-sm text-red-500">{error}</p>}
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
          <div className="pt-4 text-center">
            <Link
              href="/login"
              className="text-sm font-medium text-amber-600 hover:text-amber-500 dark:text-amber-500 dark:hover:text-amber-400"
            >
              Already have an account? Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

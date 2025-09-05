// File: src/app/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { GoogleIcon } from "@/components/GoogleIcon";

export default function CustomerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
    } else if (result?.ok) {
      // UPDATED: Redirect to the customer dashboard
      router.push("/dashboard");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      {/* ... (rest of the JSX remains the same) ... */}
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
            <h1 className="card-header">Welcome!</h1>
            <p className="card-subheader">Sign in to your account.</p>
          </div>
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
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
            {error && <p className="text-sm text-red-500">{error}</p>}
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
            <div className="flex items-center justify-between text-sm">
              <Link
                href="/register"
                className="font-medium text-amber-600 hover:text-amber-500 dark:text-amber-500 dark:hover:text-amber-400"
              >
                Create an account
              </Link>
              <Link
                href="/forgot-password"
                className="font-medium text-amber-600 hover:text-amber-500 dark:text-amber-500 dark:hover:text-amber-400"
              >
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-3 font-semibold text-white bg-amber-500 rounded-md shadow-sm hover:bg-amber-600"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

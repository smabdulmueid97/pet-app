// File: src/components/ResetPasswordForm.tsx

"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const resetToken = searchParams.get("token");
    setToken(resetToken);
  }, [searchParams]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    const response = await fetch("/api/auth/password-reset/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage(data.message);
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="login-card">
      <div className="text-center">
        <h1 className="card-header">Set New Password</h1>
        <p className="card-subheader">Enter your new password below.</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
          placeholder="New Password"
        />
        <input
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="form-input"
          placeholder="Confirm New Password"
        />

        {message && (
          <div>
            <p className="text-sm text-green-500">{message}</p>
            <Link
              href="/login"
              className="mt-2 inline-block text-sm font-medium text-amber-600 hover:text-amber-500"
            >
              Proceed to Login
            </Link>
          </div>
        )}
        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full px-4 py-3 font-semibold text-white bg-amber-500 rounded-md shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-300 dark:focus:ring-offset-black"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}

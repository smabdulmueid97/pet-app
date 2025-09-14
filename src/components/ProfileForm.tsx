// File: src/components/ProfileForm.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfileForm({ user }: { user: any }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    });

    if (res.ok) {
      setSuccess("Profile updated successfully!");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.message || "Failed to update profile.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full Name"
        className="form-input"
      />
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone Number"
        className="form-input"
      />
      <button
        type="submit"
        className="w-full px-4 py-3 font-semibold text-white bg-amber-500 rounded-md shadow-sm hover:bg-amber-600"
      >
        Update Profile
      </button>
    </form>
  );
}

// File: src/components/PetForm.tsx

"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function PetForm() {
  const { update } = useSession();
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch("/api/pets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, breed, age }),
    });

    if (res.ok) {
      setSuccess("Pet added successfully!");
      setName("");
      setBreed("");
      setAge("");
      await update(); // This line refreshes the session
    } else {
      const data = await res.json();
      setError(data.message || "Failed to add pet.");
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
        placeholder="Pet Name"
        className="form-input"
        required
      />
      <input
        type="text"
        value={breed}
        onChange={(e) => setBreed(e.target.value)}
        placeholder="Breed"
        className="form-input"
        required
      />
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        placeholder="Age"
        className="form-input"
        required
      />
      <button
        type="submit"
        className="w-full px-4 py-3 font-semibold text-white bg-amber-500 rounded-md shadow-sm hover:bg-amber-600"
      >
        Add Pet
      </button>
    </form>
  );
}

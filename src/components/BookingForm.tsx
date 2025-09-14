// File: src/components/BookingForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BookingForm({
  user,
  services,
}: {
  user: any;
  services: any[];
}) {
  const [petId, setPetId] = useState(user?.pets[0]?._id || "");
  const [serviceId, setServiceId] = useState(services[0]?._id || "");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!petId || !serviceId || !appointmentDate) {
      setError("Please fill out all fields.");
      return;
    }

    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ petId, serviceId, appointmentDate }),
    });

    if (res.ok) {
      setSuccess("Appointment booked successfully! Redirecting...");
      setTimeout(() => router.push("/dashboard/my-appointments"), 2000);
    } else {
      const data = await res.json();
      setError(data.message || "Failed to book appointment.");
    }
  };

  return (
    <div className="max-w-md p-6 mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-500">{success}</p>}

        <div>
          <label
            htmlFor="pet"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Select Pet
          </label>
          <select
            id="pet"
            value={petId}
            onChange={(e) => setPetId(e.target.value)}
            className="w-full mt-1 form-input"
          >
            {user?.pets?.map((pet: any) => (
              <option key={pet._id} value={pet._id}>
                {pet.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="service"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Select Service
          </label>
          <select
            id="service"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="w-full mt-1 form-input"
          >
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.name} - ${service.price}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Select Date & Time
          </label>
          <input
            id="date"
            type="datetime-local"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            className="w-full mt-1 form-input"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-3 font-semibold text-white bg-amber-500 rounded-md shadow-sm hover:bg-amber-600"
        >
          Book Now
        </button>
      </form>
    </div>
  );
}

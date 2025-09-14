// File: src/app/admin/appointments/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Appointment {
  _id: string;
  customerName: string;
  petName: string;
  serviceName: string;
  appointmentDate: string;
  status: string;
  staffNames: string[];
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { update } = useSession();

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/staff/appointments");
      const data = await res.json();
      setAppointments(data);
    } catch (error) {
      console.error("Failed to fetch appointments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok && newStatus === "Completed") {
        // Refetch session to get updated points for header
        const sessionRes = await fetch("/api/auth/session?update");
        const newSession = await sessionRes.json();
        await update(newSession);
      }
      fetchAppointments(); // Refresh the list
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Manage Appointments</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">Customer</th>
              <th className="px-6 py-3 text-left">Pet</th>
              <th className="px-6 py-3 text-left">Assigned Staff</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {appointments.map((app) => (
              <tr key={app._id}>
                <td className="px-6 py-4">{app.customerName}</td>
                <td className="px-6 py-4">{app.petName}</td>
                <td className="px-6 py-4">{app.staffNames.join(", ")}</td>
                <td className="px-6 py-4">
                  {new Date(app.appointmentDate).toLocaleString()}
                </td>
                <td className="px-6 py-4">{app.status}</td>
                <td className="px-6 py-4">
                  <select
                    value={app.status}
                    onChange={(e) =>
                      handleStatusChange(app._id, e.target.value)
                    }
                    className="form-input"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

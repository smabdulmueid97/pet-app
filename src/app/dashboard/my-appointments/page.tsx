// File: src/app/dashboard/my-appointments/page.tsx

"use client";
import { useState, useEffect } from "react";

interface Staff {
  name: string;
  email: string;
}

interface Appointment {
  _id: string;
  petName: string;
  serviceName: string;
  appointmentDate: string;
  status: string;
  assignedStaff: Staff[];
}

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch("/api/appointments/user"); // UPDATED
        const data = await res.json();
        setAppointments(data);
      } catch (error) {
        console.error("Failed to fetch appointments", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  if (loading) {
    return <div>Loading appointments...</div>;
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">My Appointments</h1>
      {appointments.length === 0 ? (
        <p>You have no appointments scheduled.</p>
      ) : (
        <div className="space-y-6">
          {appointments.map((app) => (
            <div
              key={app._id}
              className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
            >
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                  <h2 className="text-2xl font-semibold">
                    {app.serviceName} for {app.petName}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Date: {new Date(app.appointmentDate).toLocaleString()}
                  </p>
                </div>
                <p className="mt-2 md:mt-0">
                  Status:{" "}
                  <span className="px-3 py-1 text-sm font-semibold text-white bg-blue-500 rounded-full">
                    {app.status}
                  </span>
                </p>
              </div>
              <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="font-semibold">Your Grooming Team:</h3>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  {app.assignedStaff.map((staff) => (
                    <li key={staff.email}>
                      {staff.name} ({staff.email})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

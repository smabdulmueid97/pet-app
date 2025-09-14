// File: src/app/dashboard/book-appointment/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import BookingForm from "@/components/BookingForm";

async function getBookingData() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { user: null, services: [] };

  const client = await clientPromise;
  const db = client.db();

  const user = await db
    .collection("users")
    .findOne({ email: session.user.email });
  const services = await db.collection("services").find({}).toArray();

  return {
    user: JSON.parse(JSON.stringify(user)),
    services: JSON.parse(JSON.stringify(services)),
  };
}

export default async function BookAppointmentPage() {
  const { user, services } = await getBookingData();

  if (!user) {
    return <p>Please log in to book an appointment.</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Book an Appointment</h1>
      <BookingForm user={user} services={services} />
    </div>
  );
}

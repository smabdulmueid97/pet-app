// File: src/app/api/appointments/route.ts

import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getToken } from "next-auth/jwt";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || token.role !== "customer") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { petId, serviceId, appointmentDate } = await req.json();

    if (!petId || !serviceId || !appointmentDate) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Find the 3 staff members with the least points.
    const staffWithLeastPoints = await db
      .collection("users")
      .find({ role: "staff" })
      .sort({ points: 1 })
      .limit(3)
      .toArray();

    if (staffWithLeastPoints.length < 3) {
      return NextResponse.json(
        { message: "Not enough available staff for booking." },
        { status: 503 }
      );
    }

    const assignedStaffIds = staffWithLeastPoints.map((staff) => staff._id);
    const user = await db.collection("users").findOne({ email: token.email });

    const newAppointment = {
      userId: user?._id,
      petId: new ObjectId(petId),
      serviceId: new ObjectId(serviceId),
      appointmentDate: new Date(appointmentDate),
      assignedStaffIds,
      status: "Scheduled",
      createdAt: new Date(),
    };

    await db.collection("appointments").insertOne(newAppointment);

    return NextResponse.json(
      { message: "Appointment booked successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Appointment booking error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}

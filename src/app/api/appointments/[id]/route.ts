// File: src/app/api/appointments/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getToken } from "next-auth/jwt";
import { ObjectId } from "mongodb";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = await getToken({ req });
  if (!token || !["admin", "staff"].includes(token.role as string)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { status } = await req.json();
    const { id } = params;

    if (!status) {
      return NextResponse.json(
        { message: "Status is required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const appointmentId = new ObjectId(id);

    // If the status is 'Completed', award points
    if (status === "Completed") {
      const appointment = await db
        .collection("appointments")
        .findOne({ _id: appointmentId });
      if (
        appointment &&
        appointment.serviceId &&
        appointment.assignedStaffIds
      ) {
        const service = await db
          .collection("services")
          .findOne({ _id: appointment.serviceId });
        if (service && service.points > 0) {
          await db
            .collection("users")
            .updateMany(
              { _id: { $in: appointment.assignedStaffIds } },
              { $inc: { points: service.points } }
            );
        }
      }
    }

    const result = await db
      .collection("appointments")
      .updateOne({ _id: appointmentId }, { $set: { status } });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Appointment not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Appointment status updated." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update appointment error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}

// File: src/app/api/appointments/user/route.ts

import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || token.role !== "customer") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection("users").findOne({ email: token.email });

    const appointments = await db
      .collection("appointments")
      .aggregate([
        { $match: { userId: user?._id } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "customer",
          },
        },
        {
          $lookup: {
            from: "services",
            localField: "serviceId",
            foreignField: "_id",
            as: "service",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "assignedStaffIds",
            foreignField: "_id",
            as: "assignedStaff",
          },
        },
        { $unwind: "$customer" },
        { $unwind: "$service" },
        {
          $project: {
            "customer.pets": {
              $filter: {
                input: "$customer.pets",
                as: "pet",
                cond: { $eq: ["$$pet._id", "$petId"] },
              },
            },
            appointmentDate: 1,
            status: 1,
            serviceName: "$service.name",
            "assignedStaff.name": 1,
            "assignedStaff.email": 1,
          },
        },
        {
          $project: {
            petName: { $arrayElemAt: ["$customer.pets.name", 0] },
            appointmentDate: 1,
            status: 1,
            serviceName: 1,
            assignedStaff: 1,
          },
        },
      ])
      .toArray();

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Failed to fetch appointments:", error);
    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}

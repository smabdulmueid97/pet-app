// File: src/app/api/staff/appointments/route.ts

import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getToken } from "next-auth/jwt";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || !["admin", "staff"].includes(token.role as string)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    let matchQuery = {};
    if (token.role === "staff") {
      const staffUser = await db
        .collection("users")
        .findOne({ email: token.email });
      matchQuery = { assignedStaffIds: staffUser?._id };
    }

    const appointments = await db
      .collection("appointments")
      .aggregate([
        { $match: matchQuery },
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
            as: "staff",
          },
        },
        { $unwind: "$customer" },
        { $unwind: "$service" },
        {
          $project: {
            "customer.name": 1,
            "customer.phone": 1,
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
            staffNames: "$staff.name",
          },
        },
        {
          $project: {
            _id: 1,
            customerName: "$customer.name",
            customerPhone: "$customer.phone",
            petName: { $arrayElemAt: ["$customer.pets.name", 0] },
            appointmentDate: 1,
            status: 1,
            serviceName: 1,
            staffNames: 1,
          },
        },
      ])
      .toArray();

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Failed to fetch staff appointments:", error);
    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}

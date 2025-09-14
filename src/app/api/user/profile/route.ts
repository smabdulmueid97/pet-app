// File: src/app/api/user/profile/route.ts

import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getToken } from "next-auth/jwt";

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, phone } = await req.json();

    if (!name && !phone) {
      return NextResponse.json(
        { message: "Nothing to update." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const updateData: { name?: string; phone?: string } = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    await db
      .collection("users")
      .updateOne({ email: token.email }, { $set: updateData });

    return NextResponse.json(
      { message: "Profile updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

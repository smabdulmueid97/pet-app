// File: src/app/api/pets/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getToken } from "next-auth/jwt";
import { ObjectId } from "mongodb";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { message: "Pet ID is required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db
      .collection("users")
      .updateOne(
        { email: token.email },
        { $pull: { pets: { _id: new ObjectId(id) } } }
      );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        {
          message: "Pet not found or you do not have permission to delete it.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Pet deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete pet error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

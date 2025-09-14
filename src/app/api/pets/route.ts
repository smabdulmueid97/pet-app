// File: src/app/api/pets/route.ts

import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getToken } from "next-auth/jwt";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, breed, age } = await req.json();

    if (!name || !breed || !age) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const newPet = {
      _id: new ObjectId(),
      name,
      breed,
      age: parseInt(age, 10),
    };

    await db
      .collection("users")
      .updateOne({ email: token.email }, { $push: { pets: newPet } });

    return NextResponse.json(
      { message: "Pet added successfully.", pet: newPet },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add pet error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

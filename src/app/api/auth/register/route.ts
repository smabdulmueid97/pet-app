// File: src/app/api/auth/register/route.ts

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists." },
        { status: 409 }
      );
    }

    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user document
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: "customer", // Automatically set the role to customer
      emailVerified: null, // Email is not verified until they click a link (future feature)
      image: `https://avatars.dicebear.com/api/initials/${name}.svg`, // A default avatar
    };

    // Insert the new user into the database
    await db.collection("users").insertOne(newUser);

    return NextResponse.json(
      { message: "User registered successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

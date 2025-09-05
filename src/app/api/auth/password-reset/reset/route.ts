// File: src/app/api/auth/password-reset/reset/route.ts

import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: "Invalid request." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Find the user with a valid, non-expired token
    const user = await db.collection("users").findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() }, // Check if the token is not expired
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired password reset token." },
        { status: 400 }
      );
    }

    // Hash the new password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password and clear the reset token fields
    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: { password: hashedPassword },
        $unset: { passwordResetToken: "", passwordResetExpires: "" },
      }
    );

    return NextResponse.json(
      { message: "Password has been reset successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

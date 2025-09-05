// File: src/app/api/auth/password-reset/request/route.ts

import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const client = await clientPromise;
    const db = client.db();

    // Find the user by their email address
    const user = await db.collection("users").findOne({ email });

    // If no user is found, we don't want to reveal that.
    // We send a generic success message to prevent email enumeration attacks.
    if (!user) {
      return NextResponse.json(
        {
          message:
            "If an account with this email exists, a reset link has been sent.",
        },
        { status: 200 }
      );
    }

    // Generate a secure, random token
    const resetToken = crypto.randomBytes(32).toString("hex");
    // Set an expiration date for the token (e.g., 1 hour from now)
    const passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour

    // Update the user document with the token and expiration date
    await db
      .collection("users")
      .updateOne(
        { _id: user._id },
        { $set: { passwordResetToken: resetToken, passwordResetExpires } }
      );

    // Create the reset link
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    // Send the email using Resend
    await resend.emails.send({
      from: "onboarding@resend.dev", // Must be a verified domain or this address
      to: email, // On the free plan, this must be your own email
      subject: "Your Password Reset Link",
      html: `<p>Click here to reset your password: <a href="${resetLink}">Reset Password</a></p>`,
    });

    return NextResponse.json(
      {
        message:
          "If an account with this email exists, a reset link has been sent.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset request error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

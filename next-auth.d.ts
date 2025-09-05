// File: next-auth.d.ts

import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

/**
 * Extends the built-in session.user type to include the 'role' property.
 */
declare module "next-auth" {
  interface Session {
    user: {
      role?: string; // Add your custom property here
    } & DefaultSession["user"]; // Keep the default properties
  }

  // Also extend the User model if you need to access the role from it
  interface User extends DefaultUser {
    role?: string;
  }
}

/**
 * Extends the built-in JWT type to include the 'role' property.
 */
declare module "next-auth/jwt" {
  interface JWT {
    role?: string; // Add your custom property here
  }
}

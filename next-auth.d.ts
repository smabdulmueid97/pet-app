// File: next-auth.d.ts

import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      role?: string;
      phone?: string;
      pets?: any[];
      points?: number; // ADDED
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: string;
    phone?: string;
    pets?: any[];
    points?: number; // ADDED
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    phone?: string;
    pets?: any[];
    points?: number; // ADDED
  }
}

// File: scripts/seed.mjs

import { MongoClient } from "mongodb";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";

// Explicitly load the .env.local file from the project root
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    'Invalid/Missing environment variable: "MONGODB_URI". Please check your .env.local file.'
  );
}

/**
 * Generates an array of user objects with a specified role.
 */
function generateUsers(count, role) {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      // Hash the password with a salt round of 10
      password: bcrypt.hashSync(faker.internet.password(), 10),
      role: role,
      emailVerified: new Date(),
      image: faker.image.avatar(),
    });
  }
  return users;
}

async function main() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected successfully to MongoDB");

    const db = client.db();
    const usersCollection = db.collection("users");

    console.log("🔥 Deleting existing users...");
    await usersCollection.deleteMany({});

    console.log("🌱 Generating dummy data...");
    const customers = generateUsers(100, "customer");
    const staff = generateUsers(20, "staff");
    // Generate admins, but also add one known admin for testing
    const admins = generateUsers(4, "admin");

    // ADDING KNOWN USERS FOR EASY TESTING
    const knownAdmin = {
      name: "Test Admin",
      email: "admin@test.com",
      password: bcrypt.hashSync("password123", 10),
      role: "admin",
      emailVerified: new Date(),
      image: "",
    };

    const knownCustomer = {
      name: "Test Customer",
      email: "customer@test.com",
      password: bcrypt.hashSync("password123", 10),
      role: "customer",
      emailVerified: new Date(),
      image: "",
    };

    const knownStaff = {
      name: "Test Staff",
      email: "staff@test.com",
      password: bcrypt.hashSync("password123", 10),
      role: "staff",
      emailVerified: new Date(),
      image: "",
    };

    const allUsers = [
      ...customers,
      ...staff,
      ...admins,
      knownAdmin,
      knownCustomer,
      knownStaff,
    ];

    console.log("📥 Inserting dummy data into the database...");
    const result = await usersCollection.insertMany(allUsers);
    console.log(`✅ Successfully inserted ${result.insertedCount} users.`);
  } catch (err) {
    console.error("❌ An error occurred while seeding the database:", err);
  } finally {
    await client.close();
    console.log("🔚 Database connection closed.");
  }
}

main().catch(console.error);

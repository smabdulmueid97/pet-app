// File: scripts/seed.mjs

import { MongoClient } from "mongodb";
import { faker } from "@faker-js/faker";
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
      password: faker.internet.password(),
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
    const admins = generateUsers(5, "admin");

    const allUsers = [...customers, ...staff, ...admins];

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

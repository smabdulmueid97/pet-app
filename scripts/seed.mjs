// File: scripts/seed.mjs

import { MongoClient, ObjectId } from "mongodb";
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

const servicesData = [
  { name: "Bath & Brush", price: 50, duration: 60, points: 10 },
  { name: "Full Groom", price: 90, duration: 120, points: 25 },
  { name: "Nail Trim", price: 20, duration: 15, points: 5 },
  { name: "Teeth Cleaning", price: 40, duration: 30, points: 15 },
];

function generateUsers(count, role) {
  const users = [];
  for (let i = 0; i < count; i++) {
    const petId = new ObjectId();
    users.push({
      _id: new ObjectId(),
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: bcrypt.hashSync("password123", 10), // UPDATED
      role: role,
      points: role === "staff" ? faker.number.int({ min: 0, max: 50 }) : 0,
      emailVerified: new Date(),
      image: faker.image.avatar(),
      phone: faker.phone.number(),
      pets:
        role === "customer"
          ? [
              {
                _id: petId,
                name: faker.animal.dog(),
                breed: faker.animal.dog(),
                age: faker.number.int({ min: 1, max: 15 }),
              },
            ]
          : [],
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
    const servicesCollection = db.collection("services");
    const appointmentsCollection = db.collection("appointments");

    console.log("🔥 Deleting existing data...");
    await usersCollection.deleteMany({});
    await servicesCollection.deleteMany({});
    await appointmentsCollection.deleteMany({});

    console.log("🌱 Generating dummy data...");
    const customers = generateUsers(20, "customer");
    const staff = generateUsers(5, "staff");
    const admins = generateUsers(2, "admin");

    const knownAdmin = {
      _id: new ObjectId(),
      name: "Test Admin",
      email: "admin@test.com",
      password: bcrypt.hashSync("password123", 10),
      role: "admin",
      points: 0,
      emailVerified: new Date(),
      image: "",
      phone: "123-456-7890",
      pets: [],
    };
    const knownCustomer = {
      _id: new ObjectId(),
      name: "Test Customer",
      email: "customer@test.com",
      password: bcrypt.hashSync("password123", 10),
      role: "customer",
      points: 0,
      emailVerified: new Date(),
      image: "",
      phone: "123-456-7890",
      pets: [
        {
          _id: new ObjectId(),
          name: "Buddy",
          breed: "Golden Retriever",
          age: 5,
        },
      ],
    };
    const knownStaff = {
      _id: new ObjectId(),
      name: "Test Staff",
      email: "staff@test.com",
      password: bcrypt.hashSync("password123", 10),
      role: "staff",
      points: 10,
      emailVerified: new Date(),
      image: "",
      phone: "123-456-7890",
      pets: [],
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
    await usersCollection.insertMany(allUsers);
    await servicesCollection.insertMany(
      servicesData.map((s) => ({ ...s, _id: new ObjectId() }))
    );
    console.log(
      `✅ Successfully inserted ${allUsers.length} users and ${servicesData.length} services.`
    );
  } catch (err) {
    console.error("❌ An error occurred while seeding the database:", err);
  } finally {
    await client.close();
    console.log("🔚 Database connection closed.");
  }
}

main().catch(console.error);

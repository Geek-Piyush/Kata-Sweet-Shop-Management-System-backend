import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Sweet from "./models/Sweet.js";
import Purchase from "./models/Purchase.js";
import { hashPassword } from "./utils/password.js";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/sweet-shop";

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Sweet.deleteMany({});
    await Purchase.deleteMany({});
    console.log("🧹 Cleared existing data");

    // Create admin user
    const adminPasswordHash = await hashPassword("Admin@123");
    const admin = await User.create({
      name: "Admin User",
      email: "admin@sweetshop.com",
      passwordHash: adminPasswordHash,
      role: "admin",
    });
    console.log("👤 Created admin user:", admin.email);

    // Create regular users
    const userPasswordHash = await hashPassword("User@1234");
    const user1 = await User.create({
      name: "John Doe",
      email: "john@example.com",
      passwordHash: userPasswordHash,
      role: "user",
    });
    console.log("👤 Created user:", user1.email);

    const user2 = await User.create({
      name: "Jane Smith",
      email: "jane@example.com",
      passwordHash: userPasswordHash,
      role: "user",
    });
    console.log("👤 Created user:", user2.email);

    // Create sweets
    const sweets = await Sweet.create([
      {
        name: "Ladoo",
        category: "Indian",
        price: 10,
        quantity: 50,
      },
      {
        name: "Jalebi",
        category: "Indian",
        price: 5,
        quantity: 100,
      },
      {
        name: "Gulab Jamun",
        category: "Indian",
        price: 8,
        quantity: 75,
      },
      {
        name: "Chocolate Truffle",
        category: "Western",
        price: 15,
        quantity: 30,
      },
      {
        name: "Vanilla Cupcake",
        category: "Western",
        price: 12,
        quantity: 40,
      },
      {
        name: "Strawberry Cake",
        category: "Western",
        price: 20,
        quantity: 20,
      },
      {
        name: "Barfi",
        category: "Indian",
        price: 6,
        quantity: 60,
      },
      {
        name: "Rasgulla",
        category: "Indian",
        price: 7,
        quantity: 80,
      },
    ]);
    console.log(`🍬 Created ${sweets.length} sweets`);

    // Create sample purchases for analytics testing
    const purchases = [];
    const now = new Date();

    // Create purchases from the past 30 days
    for (let i = 0; i < 30; i++) {
      const purchaseDate = new Date(now);
      purchaseDate.setDate(purchaseDate.getDate() - i);

      // Random purchases for different sweets
      const randomSweet = sweets[Math.floor(Math.random() * sweets.length)];
      const randomUser = Math.random() > 0.5 ? user1 : user2;
      const quantity = Math.floor(Math.random() * 5) + 1; // 1-5 items

      purchases.push({
        sweet: randomSweet._id,
        sweetName: randomSweet.name,
        category: randomSweet.category,
        quantity: quantity,
        pricePerUnit: randomSweet.price,
        totalAmount: randomSweet.price * quantity,
        user: randomUser._id,
        purchaseDate: purchaseDate,
      });
    }

    await Purchase.create(purchases);
    console.log(`📊 Created ${purchases.length} sample purchase records`);

    console.log("\n✨ Seed data created successfully!\n");
    console.log("📝 Login credentials:");
    console.log("   Admin: admin@sweetshop.com / Admin@123");
    console.log("   User:  john@example.com / User@1234");
    console.log("   User:  jane@example.com / User@1234\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedData();

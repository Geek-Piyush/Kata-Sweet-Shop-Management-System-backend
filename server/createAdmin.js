import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.js";
import { hashPassword } from "./src/utils/password.js";

dotenv.config();

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@sweetshop.com" });

    if (existingAdmin) {
      console.log("⚠️  Admin user already exists!");
      console.log("Email: admin@sweetshop.com");
      console.log("Password: Admin@123");
      process.exit(0);
    }

    // Create admin user
    const passwordHash = await hashPassword("Admin@123");

    const admin = await User.create({
      name: "Admin User",
      email: "admin@sweetshop.com",
      passwordHash,
      role: "admin",
    });

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email: admin@sweetshop.com");
    console.log("🔑 Password: Admin@123");
    console.log("\nYou can now login with these credentials.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
}

createAdmin();

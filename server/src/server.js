import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/sweet-shop";

// Production-ready MongoDB connection with options
const mongooseOptions = {
  // These options help with connection stability in production
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
};

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, mongooseOptions)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`💚 Ready to accept requests`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });

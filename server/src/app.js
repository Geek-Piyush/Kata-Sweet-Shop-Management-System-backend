import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import sweetsRoutes from "./routes/sweets.js";
import analyticsRoutes from "./routes/analytics.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS configuration - Allow requests from React frontend
// For production, set FRONTEND_URL and FRONTEND_CUSTOM_DOMAIN in .env
const allowedOrigins = [
  "http://localhost:3000", // Development
  process.env.FRONTEND_URL, // Production Vercel URL
  process.env.FRONTEND_CUSTOM_DOMAIN, // Custom domain (if any)
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetsRoutes);
app.use("/api/analytics", analyticsRoutes);
// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;

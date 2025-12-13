import express from "express";
import authRoutes from "./routes/auth.js";
import sweetsRoutes from "./routes/sweets.js";
import { errorHandler } from "./middlewares/errorHandler.js";
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetsRoutes);
// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;

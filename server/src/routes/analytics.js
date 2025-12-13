import express from "express";
import {
  getWeeklyStats,
  getMonthlyStats,
  getCustomRangeStats,
} from "../controllers/analyticsController.js";
import { authMiddleware } from "../middlewares/auth.js";
import { cacheMiddleware } from "../middlewares/cache.js";

const router = express.Router();

// Analytics routes (protected)
// Cache for 60 seconds since analytics data changes frequently with purchases
router.get("/weekly", authMiddleware, cacheMiddleware(60), getWeeklyStats);
router.get("/monthly", authMiddleware, cacheMiddleware(60), getMonthlyStats);
router.get("/custom", authMiddleware, cacheMiddleware(60), getCustomRangeStats);

export default router;

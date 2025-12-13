import express from "express";
import {
  createSweet,
  getAllSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
} from "../controllers/sweetsController.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.js";
import { cacheMiddleware } from "../middlewares/cache.js";

const router = express.Router();

// Public/Protected routes (with caching)
router.get("/", authMiddleware, cacheMiddleware(300), getAllSweets);
router.get("/search", authMiddleware, cacheMiddleware(180), searchSweets);

// Admin only routes
router.post("/", authMiddleware, adminMiddleware, createSweet);
router.put("/:id", authMiddleware, adminMiddleware, updateSweet);
router.delete("/:id", authMiddleware, adminMiddleware, deleteSweet);

// Inventory routes
router.post("/:id/purchase", authMiddleware, purchaseSweet);
router.post("/:id/restock", authMiddleware, adminMiddleware, restockSweet);

export default router;

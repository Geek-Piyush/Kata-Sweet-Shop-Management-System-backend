import express from "express";
import {
  createSweet,
  getAllSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
  uploadSweetPhoto,
} from "../controllers/sweetsController.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.js";
import { cacheMiddleware } from "../middlewares/cache.js";
import upload from "../utils/upload.js";

const router = express.Router();

// Public/Protected routes (with caching)
router.get("/", authMiddleware, cacheMiddleware(300), getAllSweets);
router.get("/search", authMiddleware, cacheMiddleware(180), searchSweets);

// Admin only routes
router.post("/", authMiddleware, adminMiddleware, createSweet);
router.put("/:id", authMiddleware, adminMiddleware, updateSweet);
router.delete("/:id", authMiddleware, adminMiddleware, deleteSweet);

// Photo upload route (admin only)
router.post(
  "/:id/photo",
  authMiddleware,
  adminMiddleware,
  upload.single("photo"),
  uploadSweetPhoto
);

// Inventory routes
router.post("/:id/purchase", authMiddleware, purchaseSweet);
router.post("/:id/restock", authMiddleware, adminMiddleware, restockSweet);

export default router;

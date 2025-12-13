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

const router = express.Router();

// Public/Protected routes
router.get("/", authMiddleware, getAllSweets);
router.get("/search", authMiddleware, searchSweets);

// Admin only routes
router.post("/", authMiddleware, adminMiddleware, createSweet);
router.put("/:id", authMiddleware, adminMiddleware, updateSweet);
router.delete("/:id", authMiddleware, adminMiddleware, deleteSweet);

export default router;

import express from "express";
import {
  register,
  login,
  uploadProfilePhoto,
  getProfile,
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/auth.js";
import upload from "../utils/upload.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/profile", authMiddleware, getProfile);
router.post(
  "/profile/photo",
  authMiddleware,
  upload.single("profilePhoto"),
  uploadProfilePhoto
);

export default router;

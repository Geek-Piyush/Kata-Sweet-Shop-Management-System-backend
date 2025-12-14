import User from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";
import { processProfilePhoto, deleteImage } from "../utils/imageProcessor.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Password validation regex
    // Must be at least 8 characters, contain uppercase, lowercase, number, and special character
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character (@$!%*?&)",
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await User.create({
      name,
      email,
      passwordHash,
    });

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      userId: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
      profilePhoto: user.profilePhoto,
      createdAt: user.createdAt,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      userId: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
      profilePhoto: user.profilePhoto,
      createdAt: user.createdAt,
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload or update profile photo
 */
export const uploadProfilePhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Process image (resize to 300x300)
    await processProfilePhoto(req.file.path);

    // Get relative path for storage
    const relativePath = `/uploads/profiles/${req.file.filename}`;

    // Update user profile
    const user = await User.findById(req.user._id);

    // Delete old profile photo if exists
    if (user.profilePhoto) {
      const oldPhotoPath = path.join(__dirname, "../../", user.profilePhoto);
      deleteImage(oldPhotoPath);
    }

    user.profilePhoto = relativePath;
    await user.save();

    res.status(200).json({
      message: "Profile photo uploaded successfully",
      profilePhoto: relativePath,
    });
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      deleteImage(req.file.path);
    }
    next(error);
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-passwordHash");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

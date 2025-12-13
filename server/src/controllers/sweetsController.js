import Sweet from "../models/Sweet.js";
import Purchase from "../models/Purchase.js";
import { deleteCachePattern } from "../utils/cache.js";
import { compressSweetImage, deleteImage } from "../utils/imageProcessor.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createSweet = async (req, res, next) => {
  try {
    const { name, category, price, quantity } = req.body;

    // Validation
    if (!name || !category || price === undefined || quantity === undefined) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (price < 0) {
      return res.status(400).json({ error: "Price cannot be negative" });
    }

    if (quantity < 0) {
      return res.status(400).json({ error: "Quantity cannot be negative" });
    }

    const sweet = await Sweet.create({ name, category, price, quantity });

    // Invalidate cache
    deleteCachePattern("cache_*");

    res.status(201).json({ sweet });
  } catch (error) {
    next(error);
  }
};

export const getAllSweets = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, minPrice, maxPrice } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sweets = await Sweet.find(filter)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 }); // Sort results by newest first using creation date

    res.status(200).json(sweets);
  } catch (error) {
    next(error);
  }
};

export const searchSweets = async (req, res, next) => {
  try {
    const { q, category, minPrice, maxPrice } = req.query;

    const filter = {};

    // Add search filter if query exists
    if (q) {
      filter.$or = [
        // Case-insensitive search by name
        { name: { $regex: q, $options: "i" } },
        // Case-insensitive search by category
        { category: { $regex: q, $options: "i" } },
      ];
    }

    if (category) filter.category = category;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sweets = await Sweet.find(filter).sort({ createdAt: -1 });

    res.status(200).json(sweets);
  } catch (error) {
    next(error);
  }
};

export const updateSweet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate price and quantity if provided
    if (updates.price !== undefined && updates.price < 0) {
      return res.status(400).json({ error: "Price cannot be negative" });
    }

    if (updates.quantity !== undefined && updates.quantity < 0) {
      return res.status(400).json({ error: "Quantity cannot be negative" });
    }

    const sweet = await Sweet.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!sweet) {
      return res.status(404).json({ error: "Sweet not found" });
    }

    // Invalidate cache
    deleteCachePattern("cache_*");

    res.status(200).json({ sweet });
  } catch (error) {
    next(error);
  }
};

export const deleteSweet = async (req, res, next) => {
  try {
    const { id } = req.params;

    const sweet = await Sweet.findByIdAndDelete(id);

    if (!sweet) {
      return res.status(404).json({ error: "Sweet not found" });
    }

    // Invalidate cache
    deleteCachePattern("cache_*");

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const purchaseSweet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }

    // Use findOneAndUpdate with conditions to handle race conditions
    const sweet = await Sweet.findOneAndUpdate(
      { _id: id, quantity: { $gte: quantity } },
      { $inc: { quantity: -quantity } },
      { new: true }
    );

    if (!sweet) {
      // Check if sweet exists
      const existingSweet = await Sweet.findById(id);
      if (!existingSweet) {
        return res.status(404).json({ error: "Sweet not found" });
      }
      return res.status(400).json({ error: "Insufficient stock" });
    }

    // Log purchase transaction for analytics
    await Purchase.create({
      sweet: sweet._id,
      sweetName: sweet.name,
      category: sweet.category,
      quantity: quantity,
      pricePerUnit: sweet.price,
      totalAmount: sweet.price * quantity,
      user: req.user._id,
      purchaseDate: new Date(),
    });

    // Invalidate cache
    deleteCachePattern("cache_*");

    res.status(200).json({ sweet });
  } catch (error) {
    next(error);
  }
};

export const restockSweet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }

    const sweet = await Sweet.findByIdAndUpdate(
      id,
      { $inc: { quantity: quantity } },
      { new: true }
    );

    if (!sweet) {
      return res.status(404).json({ error: "Sweet not found" });
    }

    // Invalidate cache
    deleteCachePattern("cache_*");

    res.status(200).json({ sweet });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload or update sweet photo
 */
export const uploadSweetPhoto = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Compress and resize image to 512x512
    await compressSweetImage(req.file.path);

    // Get relative path for storage
    const relativePath = `/uploads/sweets/${req.file.filename}`;

    // Update sweet photo
    const sweet = await Sweet.findById(id);

    if (!sweet) {
      deleteImage(req.file.path);
      return res.status(404).json({ error: "Sweet not found" });
    }

    // Delete old photo if exists
    if (sweet.photo) {
      const oldPhotoPath = path.join(__dirname, "../../", sweet.photo);
      deleteImage(oldPhotoPath);
    }

    sweet.photo = relativePath;
    await sweet.save();

    // Invalidate cache
    deleteCachePattern("cache_*");

    res.status(200).json({
      message: "Sweet photo uploaded successfully",
      photo: relativePath,
      sweet,
    });
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      deleteImage(req.file.path);
    }
    next(error);
  }
};

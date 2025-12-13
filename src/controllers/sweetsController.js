import Sweet from "../models/Sweet.js";

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

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

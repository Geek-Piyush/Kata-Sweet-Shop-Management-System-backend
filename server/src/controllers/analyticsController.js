import Purchase from "../models/Purchase.js";

/**
 * Get weekly purchase statistics per category and per sweet
 */
export const getWeeklyStats = async (req, res, next) => {
  try {
    // Calculate the date 7 days ago
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Aggregate by category
    const categoryStats = await Purchase.aggregate([
      {
        $match: {
          purchaseDate: { $gte: weekAgo },
        },
      },
      {
        $group: {
          _id: "$category",
          totalQuantity: { $sum: "$quantity" },
          totalRevenue: { $sum: "$totalAmount" },
          purchaseCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalQuantity: 1,
          totalRevenue: 1,
          purchaseCount: 1,
        },
      },
      {
        $sort: { totalRevenue: -1 },
      },
    ]);

    // Aggregate by sweet
    const sweetStats = await Purchase.aggregate([
      {
        $match: {
          purchaseDate: { $gte: weekAgo },
        },
      },
      {
        $group: {
          _id: "$sweet",
          sweetName: { $first: "$sweetName" },
          category: { $first: "$category" },
          totalQuantity: { $sum: "$quantity" },
          totalRevenue: { $sum: "$totalAmount" },
          purchaseCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          sweetId: "$_id",
          sweetName: 1,
          category: 1,
          totalQuantity: 1,
          totalRevenue: 1,
          purchaseCount: 1,
        },
      },
      {
        $sort: { totalRevenue: -1 },
      },
    ]);

    res.status(200).json({
      period: "weekly",
      startDate: weekAgo,
      endDate: new Date(),
      byCategory: categoryStats,
      bySweet: sweetStats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get monthly purchase statistics per category and per sweet
 */
export const getMonthlyStats = async (req, res, next) => {
  try {
    // Calculate the date 30 days ago
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);

    // Aggregate by category
    const categoryStats = await Purchase.aggregate([
      {
        $match: {
          purchaseDate: { $gte: monthAgo },
        },
      },
      {
        $group: {
          _id: "$category",
          totalQuantity: { $sum: "$quantity" },
          totalRevenue: { $sum: "$totalAmount" },
          purchaseCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalQuantity: 1,
          totalRevenue: 1,
          purchaseCount: 1,
        },
      },
      {
        $sort: { totalRevenue: -1 },
      },
    ]);

    // Aggregate by sweet
    const sweetStats = await Purchase.aggregate([
      {
        $match: {
          purchaseDate: { $gte: monthAgo },
        },
      },
      {
        $group: {
          _id: "$sweet",
          sweetName: { $first: "$sweetName" },
          category: { $first: "$category" },
          totalQuantity: { $sum: "$quantity" },
          totalRevenue: { $sum: "$totalAmount" },
          purchaseCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          sweetId: "$_id",
          sweetName: 1,
          category: 1,
          totalQuantity: 1,
          totalRevenue: 1,
          purchaseCount: 1,
        },
      },
      {
        $sort: { totalRevenue: -1 },
      },
    ]);

    res.status(200).json({
      period: "monthly",
      startDate: monthAgo,
      endDate: new Date(),
      byCategory: categoryStats,
      bySweet: sweetStats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get custom date range statistics
 */
export const getCustomRangeStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "startDate and endDate are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    if (start > end) {
      return res
        .status(400)
        .json({ error: "startDate must be before endDate" });
    }

    // Aggregate by category
    const categoryStats = await Purchase.aggregate([
      {
        $match: {
          purchaseDate: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$category",
          totalQuantity: { $sum: "$quantity" },
          totalRevenue: { $sum: "$totalAmount" },
          purchaseCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalQuantity: 1,
          totalRevenue: 1,
          purchaseCount: 1,
        },
      },
      {
        $sort: { totalRevenue: -1 },
      },
    ]);

    // Aggregate by sweet
    const sweetStats = await Purchase.aggregate([
      {
        $match: {
          purchaseDate: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$sweet",
          sweetName: { $first: "$sweetName" },
          category: { $first: "$category" },
          totalQuantity: { $sum: "$quantity" },
          totalRevenue: { $sum: "$totalAmount" },
          purchaseCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          sweetId: "$_id",
          sweetName: 1,
          category: 1,
          totalQuantity: 1,
          totalRevenue: 1,
          purchaseCount: 1,
        },
      },
      {
        $sort: { totalRevenue: -1 },
      },
    ]);

    res.status(200).json({
      period: "custom",
      startDate: start,
      endDate: end,
      byCategory: categoryStats,
      bySweet: sweetStats,
    });
  } catch (error) {
    next(error);
  }
};

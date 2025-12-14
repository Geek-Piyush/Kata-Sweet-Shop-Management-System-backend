import Purchase from "../models/Purchase.js";

/**
 * Get weekly purchase statistics per category and per sweet
 */
export const getWeeklyStats = async (req, res, next) => {
  try {
    // Calculate the date 7 days ago
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Get all purchases in the period
    const purchases = await Purchase.find({
      purchaseDate: { $gte: weekAgo },
    });

    // Calculate totals
    const totalRevenue = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
    const totalOrders = purchases.length;
    const totalItemsSold = purchases.reduce((sum, p) => sum + p.quantity, 0);

    // Revenue trend by date
    const revenueTrend = await Purchase.aggregate([
      { $match: { purchaseDate: { $gte: weekAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$purchaseDate" },
          },
          revenue: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Revenue by category
    const revenueByCategory = await Purchase.aggregate([
      { $match: { purchaseDate: { $gte: weekAgo } } },
      {
        $group: {
          _id: "$category",
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    // Best sellers
    const bestSellers = await Purchase.aggregate([
      { $match: { purchaseDate: { $gte: weekAgo } } },
      {
        $group: {
          _id: "$sweet",
          name: { $first: "$sweetName" },
          totalSold: { $sum: "$quantity" },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      totalRevenue,
      totalOrders,
      totalItemsSold,
      revenueTrend,
      revenueByCategory,
      bestSellers,
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

    // Get all purchases in the period
    const purchases = await Purchase.find({
      purchaseDate: { $gte: monthAgo },
    });

    // Calculate totals
    const totalRevenue = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
    const totalOrders = purchases.length;
    const totalItemsSold = purchases.reduce((sum, p) => sum + p.quantity, 0);

    // Revenue trend by date
    const revenueTrend = await Purchase.aggregate([
      { $match: { purchaseDate: { $gte: monthAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$purchaseDate" },
          },
          revenue: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Revenue by category
    const revenueByCategory = await Purchase.aggregate([
      { $match: { purchaseDate: { $gte: monthAgo } } },
      {
        $group: {
          _id: "$category",
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    // Best sellers
    const bestSellers = await Purchase.aggregate([
      { $match: { purchaseDate: { $gte: monthAgo } } },
      {
        $group: {
          _id: "$sweet",
          name: { $first: "$sweetName" },
          totalSold: { $sum: "$quantity" },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      totalRevenue,
      totalOrders,
      totalItemsSold,
      revenueTrend,
      revenueByCategory,
      bestSellers,
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
    end.setHours(23, 59, 59, 999); // Include the entire end date

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    if (start > end) {
      return res
        .status(400)
        .json({ error: "startDate must be before endDate" });
    }

    // Get all purchases in the period
    const purchases = await Purchase.find({
      purchaseDate: { $gte: start, $lte: end },
    });

    // Calculate totals
    const totalRevenue = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
    const totalOrders = purchases.length;
    const totalItemsSold = purchases.reduce((sum, p) => sum + p.quantity, 0);

    // Revenue trend by date
    const revenueTrend = await Purchase.aggregate([
      { $match: { purchaseDate: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$purchaseDate" },
          },
          revenue: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Revenue by category
    const revenueByCategory = await Purchase.aggregate([
      { $match: { purchaseDate: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: "$category",
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    // Best sellers
    const bestSellers = await Purchase.aggregate([
      { $match: { purchaseDate: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: "$sweet",
          name: { $first: "$sweetName" },
          totalSold: { $sum: "$quantity" },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      totalRevenue,
      totalOrders,
      totalItemsSold,
      revenueTrend,
      revenueByCategory,
      bestSellers,
    });
  } catch (error) {
    next(error);
  }
};

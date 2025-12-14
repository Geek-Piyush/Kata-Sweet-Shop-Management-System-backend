import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Navbar from "../components/Navbar";
import analyticsService from "../services/analytics.service";
import "./Analytics.css";

const COLORS = [
  "#667eea",
  "#764ba2",
  "#f093fb",
  "#4facfe",
  "#43e97b",
  "#fa709a",
];

const Analytics = () => {
  const [weeklyData, setWeeklyData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [customData, setCustomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("weekly");

  const [customDates, setCustomDates] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const [weekly, monthly] = await Promise.all([
        analyticsService.getWeeklyAnalytics(),
        analyticsService.getMonthlyAnalytics(),
      ]);

      setWeeklyData(weekly);
      setMonthlyData(monthly);
    } catch (err) {
      setError("Failed to fetch analytics data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomDateSubmit = async (e) => {
    e.preventDefault();

    if (!customDates.startDate || !customDates.endDate) {
      alert("Please select both start and end dates");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await analyticsService.getCustomAnalytics(
        customDates.startDate,
        customDates.endDate
      );

      setCustomData(data);
      setViewMode("custom");
    } catch (err) {
      setError("Failed to fetch custom analytics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentData = () => {
    switch (viewMode) {
      case "weekly":
        return weeklyData;
      case "monthly":
        return monthlyData;
      case "custom":
        return customData;
      default:
        return weeklyData;
    }
  };

  const formatRevenueTrend = (data) => {
    if (!data || !data.revenueTrend || data.revenueTrend.length === 0) {
      return [];
    }

    return data.revenueTrend.map((item) => ({
      date: new Date(item._id).toLocaleDateString(),
      revenue: item.revenue,
      orders: item.count,
    }));
  };

  const formatCategoryRevenue = (data) => {
    if (
      !data ||
      !data.revenueByCategory ||
      data.revenueByCategory.length === 0
    ) {
      return [];
    }

    return data.revenueByCategory.map((item) => ({
      name: item._id,
      revenue: item.revenue,
    }));
  };

  const formatBestSellers = (data) => {
    if (!data || !data.bestSellers || data.bestSellers.length === 0) {
      return [];
    }

    return data.bestSellers.map((item) => ({
      name: item.name,
      sold: item.totalSold,
      revenue: item.revenue,
    }));
  };

  if (loading && !weeklyData && !monthlyData) {
    return (
      <div className="analytics-page">
        <Navbar />
        <div className="analytics-container">
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  const currentData = getCurrentData();

  return (
    <div className="analytics-page">
      <Navbar />
      <div className="analytics-container">
        <h1>Sales Analytics</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="analytics-controls">
          <div className="view-selector">
            <button
              className={viewMode === "weekly" ? "active" : ""}
              onClick={() => setViewMode("weekly")}
            >
              Weekly
            </button>
            <button
              className={viewMode === "monthly" ? "active" : ""}
              onClick={() => setViewMode("monthly")}
            >
              Monthly
            </button>
            <button
              className={viewMode === "custom" ? "active" : ""}
              onClick={() => setViewMode("custom")}
            >
              Custom Range
            </button>
          </div>

          {viewMode === "custom" && (
            <form
              onSubmit={handleCustomDateSubmit}
              className="custom-date-form"
            >
              <input
                type="date"
                value={customDates.startDate}
                onChange={(e) =>
                  setCustomDates({ ...customDates, startDate: e.target.value })
                }
                required
              />
              <input
                type="date"
                value={customDates.endDate}
                onChange={(e) =>
                  setCustomDates({ ...customDates, endDate: e.target.value })
                }
                required
              />
              <button type="submit" className="btn btn-primary">
                Apply
              </button>
            </form>
          )}
        </div>

        {currentData && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Revenue</h3>
                <p className="stat-value">
                  ₹{currentData.totalRevenue?.toFixed(2) || "0.00"}
                </p>
              </div>
              <div className="stat-card">
                <h3>Total Orders</h3>
                <p className="stat-value">{currentData.totalOrders || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Items Sold</h3>
                <p className="stat-value">{currentData.totalItemsSold || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Average Order</h3>
                <p className="stat-value">
                  ₹
                  {currentData.totalOrders > 0
                    ? (
                        currentData.totalRevenue / currentData.totalOrders
                      ).toFixed(2)
                    : "0.00"}
                </p>
              </div>
            </div>

            <div className="charts-grid">
              {formatRevenueTrend(currentData).length > 0 && (
                <div className="chart-card">
                  <h2>Revenue Trend</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={formatRevenueTrend(currentData)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#667eea"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {formatCategoryRevenue(currentData).length > 0 && (
                <div className="chart-card">
                  <h2>Revenue by Category</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={formatCategoryRevenue(currentData)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) =>
                          `${entry.name}: ₹${entry.revenue.toFixed(0)}`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="revenue"
                      >
                        {formatCategoryRevenue(currentData).map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          )
                        )}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {formatBestSellers(currentData).length > 0 && (
                <div className="chart-card full-width">
                  <h2>Best Selling Sweets</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={formatBestSellers(currentData)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sold" fill="#667eea" name="Units Sold" />
                      <Bar
                        dataKey="revenue"
                        fill="#43e97b"
                        name="Revenue (₹)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {!formatRevenueTrend(currentData).length &&
              !formatCategoryRevenue(currentData).length &&
              !formatBestSellers(currentData).length && (
                <div className="no-data">
                  <p>No analytics data available for the selected period.</p>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;

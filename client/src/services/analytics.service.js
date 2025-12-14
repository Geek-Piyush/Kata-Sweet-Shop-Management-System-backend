import axios from "../utils/axios";
import cache from "../utils/cache";

const analyticsService = {
  getWeeklyAnalytics: async (skipCache = false) => {
    if (!skipCache) {
      const cached = cache.get("analytics_weekly");
      if (cached) return cached;
    }

    const response = await axios.get("/analytics/weekly");
    cache.set("analytics_weekly", response.data, 60); // Cache for 1 minute
    return response.data;
  },

  getMonthlyAnalytics: async (skipCache = false) => {
    if (!skipCache) {
      const cached = cache.get("analytics_monthly");
      if (cached) return cached;
    }

    const response = await axios.get("/analytics/monthly");
    cache.set("analytics_monthly", response.data, 60);
    return response.data;
  },

  getCustomAnalytics: async (startDate, endDate) => {
    const cacheKey = `analytics_${startDate}_${endDate}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const response = await axios.get("/analytics/custom", {
      params: { startDate, endDate },
    });
    cache.set(cacheKey, response.data, 300); // Cache for 5 minutes
    return response.data;
  },

  clearCache: () => {
    cache.clear();
  },
};

export default analyticsService;

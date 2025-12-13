import { getCache, setCache } from "../utils/cache.js";

/**
 * Middleware to cache GET requests
 * @param {number} duration - Cache duration in seconds (default: 300)
 * @returns {Function} Express middleware
 */
export const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    // Generate cache key from URL and query parameters
    const key = `cache_${req.originalUrl || req.url}`;

    // Try to get cached response
    const cachedResponse = getCache(key);

    if (cachedResponse) {
      // Return cached response
      return res.status(200).json(cachedResponse);
    }

    // Store original res.json function
    const originalJson = res.json.bind(res);

    // Override res.json to cache the response
    res.json = (body) => {
      // Only cache successful responses (2xx status codes)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        setCache(key, body, duration);
      }
      return originalJson(body);
    };

    next();
  };
};

import NodeCache from "node-cache";

// Initialize cache with default TTL of 5 minutes (300 seconds)
const cache = new NodeCache({
  stdTTL: 300,
  checkperiod: 60, // Check for expired keys every 60 seconds
  useClones: false, // Better performance for read-heavy operations
});

/**
 * Get value from cache
 * @param {string} key - Cache key
 * @returns {any} Cached value or undefined
 */
export const getCache = (key) => {
  return cache.get(key);
};

/**
 * Set value in cache
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {number} ttl - Time to live in seconds (optional)
 * @returns {boolean} Success status
 */
export const setCache = (key, value, ttl) => {
  return cache.set(key, value, ttl);
};

/**
 * Delete specific key from cache
 * @param {string} key - Cache key to delete
 * @returns {number} Number of deleted entries
 */
export const deleteCache = (key) => {
  return cache.del(key);
};

/**
 * Delete all keys matching a pattern
 * @param {string} pattern - Pattern to match (e.g., "sweets_*")
 * @returns {number} Number of deleted entries
 */
export const deleteCachePattern = (pattern) => {
  const keys = cache.keys();
  const matchingKeys = keys.filter((key) => {
    const regex = new RegExp(pattern.replace("*", ".*"));
    return regex.test(key);
  });
  return cache.del(matchingKeys);
};

/**
 * Clear all cache
 */
export const clearCache = () => {
  cache.flushAll();
};

/**
 * Get cache statistics
 * @returns {object} Cache stats
 */
export const getCacheStats = () => {
  return cache.getStats();
};

export default cache;

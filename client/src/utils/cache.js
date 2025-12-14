import config from "../config";

class SimpleCache {
  constructor() {
    this.cache = {};
  }

  set(key, data, ttlSeconds = null) {
    const ttl = ttlSeconds ? ttlSeconds * 1000 : config.CACHE_DURATION;
    this.cache[key] = {
      data,
      timestamp: Date.now(),
      ttl,
    };
  }

  get(key) {
    const cached = this.cache[key];
    if (!cached) return null;

    const age = Date.now() - cached.timestamp;
    const maxAge = cached.ttl || config.CACHE_DURATION;

    if (age > maxAge) {
      delete this.cache[key];
      return null;
    }

    return cached.data;
  }

  clear(key) {
    if (key) {
      delete this.cache[key];
    } else {
      this.cache = {};
    }
  }

  clearAll() {
    this.cache = {};
  }
}

const cacheInstance = new SimpleCache();
export default cacheInstance;

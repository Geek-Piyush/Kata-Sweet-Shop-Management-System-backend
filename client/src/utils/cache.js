import config from "../config";

class SimpleCache {
  constructor() {
    this.cache = {};
  }

  set(key, data) {
    this.cache[key] = {
      data,
      timestamp: Date.now(),
    };
  }

  get(key) {
    const cached = this.cache[key];
    if (!cached) return null;

    const age = Date.now() - cached.timestamp;
    if (age > config.CACHE_DURATION) {
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

export default new SimpleCache();

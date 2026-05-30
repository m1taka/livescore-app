// Simple localStorage-based cache with TTL (Time To Live)

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

const CACHE_PREFIX = 'livescore_cache_';

export const cache = {
  // Set a cache item with TTL (default 5 minutes)
  set: <T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void => {
    try {
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl,
      };
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
    } catch (error) {
      console.warn('Error setting cache:', error);
    }
  },

  // Get a cache item if it exists and hasn't expired
  get: <T>(key: string): T | null => {
    try {
      const itemStr = localStorage.getItem(CACHE_PREFIX + key);
      if (!itemStr) return null;

      const item: CacheItem<T> = JSON.parse(itemStr);
      const now = Date.now();

      // Check if cache has expired
      if (now - item.timestamp > item.ttl) {
        // Remove expired cache
        localStorage.removeItem(CACHE_PREFIX + key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.warn('Error getting cache:', error);
      return null;
    }
  },

  // Remove a specific cache item
  remove: (key: string): void => {
    try {
      localStorage.removeItem(CACHE_PREFIX + key);
    } catch (error) {
      console.warn('Error removing cache:', error);
    }
  },

  // Clear all cache items
  clearAll: (): void => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Error clearing cache:', error);
    }
  },

  // Check if a cache item exists and is valid
  has: (key: string): boolean => {
    return cache.get(key) !== null;
  },
};

const redis = require("./redisClient");

const getCache = async (key) => {
  if (!redis || typeof redis.get !== "function") return null;

  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.warn("Redis cache get failed:", err.message || err);
    return null;
  }
};

const setCache = async (key, value, ttl = 600) => {
  if (!redis || typeof redis.set !== "function") return;

  try {
    const payload = JSON.stringify(value);

    if (typeof redis.setEx === "function") {
      await redis.setEx(key, ttl, payload);
      return;
    }

    await redis.set(key, payload, "EX", ttl);
  } catch (err) {
    console.warn("Redis cache set failed:", err.message || err);
  }
};

module.exports = { getCache, setCache };
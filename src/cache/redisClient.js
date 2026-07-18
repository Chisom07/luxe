const Redis = require("ioredis");
require("dotenv").config();

const redisUrl = process.env.REDIS_URL || null;
const fallbackStore = new Map();

const fallbackClient = {
  status: "ready",
  async get(key) {
    const value = fallbackStore.get(key);
    return value === undefined ? null : value;
  },
  async set(key, value) {
    fallbackStore.set(key, value);
    return "OK";
  },
  async setEx(key, seconds, value) {
    fallbackStore.set(key, value);
    return "OK";
  },
  async keys(pattern) {
    const regex = new RegExp(
      `^${pattern
        .replace(/([.+^=!:${}()|[\]\/\\])/g, "\\$1")
        .replace(/\*/g, ".*")
        .replace(/\?/g, ".")}$`
    );
    return Array.from(fallbackStore.keys()).filter((key) => regex.test(key));
  },
  async del(key) {
    return fallbackStore.delete(key) ? 1 : 0;
  },
  on() {
    return this;
  },
};

let activeClient = fallbackClient;
let cacheMode = "memory fallback";

const redis = {
  get(...args) {
    return activeClient.get(...args);
  },
  set(...args) {
    return activeClient.set(...args);
  },
  setEx(...args) {
    return activeClient.setEx(...args);
  },
  keys(...args) {
    return activeClient.keys(...args);
  },
  del(...args) {
    return activeClient.del(...args);
  },
  on(...args) {
    return activeClient.on(...args);
  },
  get status() {
    return activeClient.status;
  },
};

const initRedis = async () => {
  if (!redisUrl) {
    console.warn("Redis is not configured; using the in-memory cache.");
    cacheMode = "memory fallback";
    return;
  }

  const client = new Redis(redisUrl, {
    lazyConnect: true,
    connectTimeout: 2000,
    enableOfflineQueue: false,
    maxRetriesPerRequest: 0,
    retryStrategy: () => null,
  });

  // The failed connection is handled below. An error listener is still
  // required because ioredis emits an event before connect() rejects.
  client.on("error", () => {});

  try {
    await client.connect();
    activeClient = client;
    cacheMode = "redis";
    console.log("Redis connected.");
  } catch (err) {
    client.disconnect();
    cacheMode = "memory fallback";
    console.warn(
      `Redis is unavailable (${err.message || err}); using the in-memory cache.`
    );
  }
};

initRedis().finally(() => {
  console.log(`Cache mode: ${cacheMode}`);
});

module.exports = redis;
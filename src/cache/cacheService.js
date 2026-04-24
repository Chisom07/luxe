// const redis = require("./redisClient");

// const getCache = async (key) => {
//     const data = await redis.get(key);
//     return data ? JSON.parse(data) : null;
// };

// const setCache = async (key, value, ttl = 3600) => {
//     await redis.setEx(key, ttl, JSON.stringify(value));
//     // await redis.set(key, JSON.stringify(value), 'EX', ttl);
// };

// module.exports = {
//     getCache,
//     setCache,
// };

const redis = require("./redisClient");


const getCache = async (key) => {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
};

const setCache = async (key, value, ttl = 600) => {
    await redis.set(key, JSON.stringify(value), "EX", ttl);
};

module.exports = { getCache, setCache };
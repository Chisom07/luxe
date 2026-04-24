// const { v4: uuid } = require("uuid");

const e = require("express");

// let bookmarks = [];

// const addBookmark = (item) => {
//   const newItem = { id: uuid(), ...item };
//   bookmarks.push(newItem);
//   return newItem;
// };

// const getBookmarks = () => bookmarks;

// const deleteBookmark = (id) => {
//   bookmarks = bookmarks.filter((b) => b.id !== id);
// };

// module.exports = { addBookmark, getBookmarks, deleteBookmark };


const redis = require("../cache/redisClient");

exports.saveBookmark = async (data) => {
    const id = Date.now();
    await redis.set(`bookmark:${id}`, JSON.stringify(data));
    return { id, ...data };
};

exports.getBookmarks = async () => {
    const keys = await redis.keys("bookmark:*");
    
    const data = await Promise.all(
        keys.map(async (k) => JSON.parse(await redis.get(k)))
    );

    return data;
};
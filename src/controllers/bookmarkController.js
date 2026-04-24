// // src/controllers/bookmarkController.js
// const {
//   addBookmark,
//   getBookmarks,
//   deleteBookmark,
// } = require("../services/bookmarkService");

// const create = (req, res) => {
//   res.json(addBookmark(req.body));
// };

// const getAll = (req, res) => {
//   res.json(getBookmarks());
// };

// const remove = (req, res) => {
//   deleteBookmark(req.params.id);
//   res.json({ message: "Deleted" });
// };

// module.exports = { create, getAll, remove };


const {
    saveBookmark,
    getBookmarks
} = require("../services/bookmarkService");

exports.addBookmark = async (req, res) => {
    const data = await saveBookmark(req.body);
    res.json(data);
};

exports.fetchBookmarks = async (req, res) => {
    const data = await getBookmarks();
    res.json(data);
};
// const express = require("express");
// const router = express.Router();

// const ctrl = require("../controllers/bookmarkController");

// router.post("/bookmarks", ctrl.create);
// router.get("/bookmarks", ctrl.getAll);
// router.delete("/bookmarks/:id", ctrl.remove);

// module.exports = router;


const router = require("express").Router();
const {
    addBookmark,
    fetchBookmarks
} = require("../controllers/bookmarkController");

router.post("/", addBookmark);
router.get("/", fetchBookmarks);

module.exports = router;
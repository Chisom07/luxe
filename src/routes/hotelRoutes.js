// const express = require("express");
// const router = express.Router();
// const hotelController = require("../controllers/hotelController");

// router.get("/search", hotelController.searchHotels);

// module.exports = router;

const router = require("express").Router();
const { searchHotels } = require("../controllers/hotelController");

router.get("/", searchHotels);

module.exports = router;
// const express = require("express");
// const router = express.Router();
// const flightController = require("../controllers/flightController");

// router.get("/search", flightController.searchFlights);

// module.exports = router;

const router = require("express").Router();
const { searchFlights } = require("../controllers/flightController");

router.get("/", searchFlights);

module.exports = router;
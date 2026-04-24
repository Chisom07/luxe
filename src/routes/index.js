// // src/routes/index.js
// const express = require("express");
// const router = express.Router();

// // import route modules
// const flightRoutes = require("./flightRoutes");
// const hotelRoutes = require("./hotelRoutes");
// const bookmarkRoutes = require("./bookmarkRoutes");

// // mount routes properly
// router.use("/flights", flightRoutes);
// router.use("/hotels", hotelRoutes);
// router.use("/bookmarks", bookmarkRoutes);

// module.exports = router;


const  router = require("express").Router();

router.use("/flights", require("./flightRoutes"));
router.use("/hotels", require("./hotelRoutes"));
router.use("/bookmarks", require("./bookmarkRoutes"));
router.use("/search", require("./searchRoutes"));

module.exports = router;
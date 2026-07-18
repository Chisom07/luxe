const router = require("express").Router();
const {
  suggestFlightLocations,
  suggestHotelLocations,
} = require("../controllers/locationController");

router.get("/flights", suggestFlightLocations);
router.get("/hotels", suggestHotelLocations);

module.exports = router;

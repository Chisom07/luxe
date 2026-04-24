const router = require("express").Router();
const {searchAll} = require("../controllers/searchController");

router.get("/", searchAll);

module.exports = router;

// const { searchAirport, getFlights, getHotels } = require("../integrations/skyscanner");

// exports.search = async (req, res) => {
//   try {
//     const { from, to, date, city } = req.query;
    // const flights = await getFlights({ from, to, date });
    // const hotels = await getHotels({ city });
//    res.json({ flights, hotels });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Search failed" });
//   }
// };
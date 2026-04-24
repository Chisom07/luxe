// // controllers/searchController.js

// const { getFlights } = require("../services/flightService");
// const { getHotels } = require("../services/hotelService");
// const { getCache, setCache } = require("../utils/cache");

// const search = async (req, res) => {
//   try {
//     const {
//       from,
//       to,
//       date,
//       city,
//       sortBy,
//       maxPrice,
//       maxStops,
//       airline,
//     } = req.query;

//     const cacheKey = `search:${JSON.stringify(req.query)}`;

//     const cached = await getCache(cacheKey);
//     if (cached) return res.json(cached);

//     const [flights, hotels] = await Promise.all([
//       getFlights({ from, to, date, sortBy, maxPrice, maxStops, airline }),
//       getHotels({ city, maxPrice }),
//     ]);

//     const response = {
//       meta: {
//         totalFlights: flights.length,
//         totalHotels: hotels.length,
//       },
//       data: {
//         flights,
//         hotels,
//       },
//     };

//     await setCache(cacheKey, response);

//     res.json(response);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Search failed" });
//   }
// };

// module.exports = { search };

const { getFlights } = require("../services/flightService");
const { getHotels } = require("../services/hotelService");

exports.searchAll = async(req, res) => {
    const [flights, hotels] = await Promise.all([
        getFlights(req.query),
        getHotels(req.query)
    ]);

    res.json({ flights, hotels });
};
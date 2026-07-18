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
const { getCache, setCache } = require("../cache/cacheService");

exports.searchAll = async (req, res) => {
  const cacheKey = `search:${JSON.stringify(req.query)}`;
  const cached = await getCache(cacheKey);
  if (cached) return res.json(cached);

  try {
    const [flightResult, hotelResult] = await Promise.all([
      getFlights(req.query),
      getHotels(req.query),
    ]);

    const response = {
      meta: {
        flights: {
          total: flightResult.total,
          page: flightResult.page,
          totalPages: flightResult.totalPages,
        },
        hotels: {
          total: hotelResult.total,
          page: hotelResult.page,
          totalPages: hotelResult.totalPages,
        },
      },
      data: {
        flights: flightResult.results,
        hotels: hotelResult.results,
      },
    };

    await setCache(cacheKey, response, 600);
    res.json(response);
  } catch (err) {
    console.error("Error in searchAll:", err.response?.data || err.message);

    const status = err.response?.status;
    const upstreamMessage = err.response?.data?.message;

    if (status === 429) {
      return res.status(429).json({
        error:
          upstreamMessage ||
          "The travel data provider rate limit or monthly quota has been reached. Please try again later.",
      });
    }

    res.status(status || 500).json({
      error: upstreamMessage || err.message || "Search failed",
    });
  }
};
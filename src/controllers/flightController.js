// const { searchFlightsService } = require("../services/flightService");
// const { getCache, setCache } = require("../cache/cacheService");

// const searchFlights = async (req, res) => {
//   const { from, to, date, filter, page, limit } = req.query;

//   const key = `flights:${from}-${to}-${date}-${filter}-${page}-${limit}`;

//   const cached = await getCache(key);
//   if (cached) return res.json(cached);

//   const data = await searchFlightsService({
//     from,
//     to,
//     date,
//     filter,
//     page,
//     limit,
//   });

//   await setCache(key, data);

//   res.json(data);
// };

// module.exports = { searchFlights };


const { getFlights } = require("../services/flightService");
const { getCache, setCache } = require("../cache/cacheService");
const { flightSchema } = require("../validators/flightValidator");
const express = require("express");

const app = express();

const searchFlights = app.get ("/flights", async (req, res) => {
    try {
        const { error } = flightSchema.validate(req.query);
        if (error) return res.status(400).json({ error: error.message });

        const key = `flights:${JSON.stringify(req.query)}`;

        const cached = await getCache(key);
        if (cached) return res.json({ source: "cache", data: cached });

        const flights = await getFlights(req.query);

        await setCache(key, flights);

        res.json({ source: "api", data: flights });

    } catch (error) {
        console.error("Error in searchFlights:", error);
        return res.status(500).json({ error: error.message });
    };
    
});

module.exports = { searchFlights };
// const { searchHotelsService } = require("../services/hotelService");

// const searchHotels = async (req, res) => {
//   const { destination } = req.query;

//   const hotels = await searchHotelsService(destination);

//   res.json({ hotels });
// };

// module.exports = { searchHotels };


const { getHotels } = require("../services/hotelService");
const { getCache, setCache } = require("../cache/cacheService");
const  { hotelSchema } = require("../validators/hotelValidator");

exports.searchHotels = async (req, res) => {
    const { error } = hotelSchema.validate(req.query);
    if (error) return res.status(400).json({ error: error.message });

    const key = `hotels:${JSON.stringify(req.query)}`;

    const cached = await getCache(key);
    if (cached) return res.json({ source: "cache", data: cached });

    const hotels = await getHotels(req.query);

    await setCache(key, hotels);

    res.json({ source: "api", data: hotels });
};
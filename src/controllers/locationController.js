const { suggestAirports, suggestHotelDestinations } = require("../integrations/skyscanner");
const { getCache, setCache } = require("../cache/cacheService");

const buildHandler = (type, suggest) => async (req, res) => {
  const query = (req.query.query || "").trim();

  if (query.length < 2) {
    return res.json({ data: [] });
  }

  try {
    const key = `suggest:${type}:${query.toLowerCase()}`;

    const cached = await getCache(key);
    if (cached) return res.json({ source: "cache", data: cached });

    const suggestions = await suggest(query);

    await setCache(key, suggestions, 86400);

    res.json({ source: "api", data: suggestions });
  } catch (error) {
    console.error(`Error in ${type} suggestions:`, error.message || error);
    res.json({ data: [] });
  }
};

exports.suggestFlightLocations = buildHandler("flights", suggestAirports);
exports.suggestHotelLocations = buildHandler("hotels", suggestHotelDestinations);

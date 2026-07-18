// const { searchAirport, getFlights } = require("../integrations/skyscanner");
// const { applyFilters, paginate } = require("../utils/filters");

// const searchFlightsService = async ({
//   from,
//   to,
//   date,
//   filter,
//   page,
//   limit,
// }) => {
//   const origin = await searchAirport(from);
//   const dest = await searchAirport(to);

//   const res = await getFlights({
//     originSkyId: origin.skyId,
//     destinationSkyId: dest.skyId,
//     originEntityId: origin.entityId,
//     destinationEntityId: dest.entityId,
//     date,
//     adults: 1,
//     market: "US",
//     currency: "USD",
//     countryCode: "US",
//   });

//   let flights = (res.data.itineraries || []).map((it) => {
//     const leg = it.legs?.[0];

//     return {
//       airline: leg?.carriers?.marketing?.[0]?.name || "Unknown",
//       price: parseFloat(it.price?.formatted?.replace("$", "")) || 0,
//       durationMinutes: leg?.durationInMinutes || 0,
//       duration: `${Math.floor(
//         leg.durationInMinutes / 60
//       )}h ${leg.durationInMinutes % 60}m`,
//       stops: leg?.stopCount ?? 0,
//       from: leg?.origin?.name,
//       to: leg?.destination?.name,
//     };
//   });

//   flights = applyFilters(flights, filter);

//   return paginate(flights, page, limit);
// };

// module.exports = { searchFlightsService };


const { searchFlights } = require("../integrations/skyscanner");
const { convertToNGN } = require("./currencyService");
const { applySort } = require("../utils/sort");
const { applyFilters } = require("../utils/filters");
const { paginate } = require("../utils/pagination");

const normalizePrice = (price) => {
  if (!price) return 0;
  if (typeof price === "number") return price;
  if (typeof price === "string") return parseFloat(price.replace(/[^0-9.]/g, "")) || 0;
  return price.amount || 0;
};

exports.getFlights = async (query) => {
  const { from, to, date, passengers, sortBy, stops, airline, page = 1, limit = 10 } = query;
  const data = await searchFlights({ from, to, date, passengers: passengers || 1 });

  const itineraries = data?.data?.itineraries || data?.itineraries || [];

  let flights = await Promise.all(
    itineraries.map(async (flight) => {
      const leg = flight.legs?.[0] || {};
      const durationMinutes =
        leg.durationMinutes || leg.durationInMinutes || leg.duration || 0;
      const carriers = leg.carriers?.marketing || leg.carriers || [];
      const airline =
        carriers[0]?.name ||
        carriers[0]?.marketing?.[0]?.name ||
        "Unknown Airline";
      const priceUSD = normalizePrice(
        flight.price?.amount ?? flight.price?.formatted ?? flight.price
      );

      return {
        airline,
        durationMinutes,
        duration: `${Math.floor(durationMinutes / 60)}h ${Math.round(durationMinutes % 60)}m`,
        stops: leg.stopCount ?? 0,
        from: leg.origin?.name || leg.origin || from,
        to: leg.destination?.name || leg.destination || to,
        priceUSD,
        priceNGN: Math.round(await convertToNGN(priceUSD)),
      };
    })
  );

  flights = applyFilters(flights, { stops, airline });
  flights = applySort(flights, sortBy);

  return paginate(flights, page, limit);
};
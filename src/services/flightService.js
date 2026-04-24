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

exports.getFlights = async (query) => {
    const data = await searchFlights(query);

    const flights = await Promise.all(
        data?.itineraries?.map(async f => {
        const usd = f.price.amount || 0;
        return {
            airline: f.legs[0].carriers.marketing[0].name,
            duration: f.legs[0].durationInMinutes,
            stops: f.legs[0].stopCount,
            priceUSD: usd,
            priceNGN: Math.round(await convertToNGN(usd))
        };
    })
    );

    return flights;
};
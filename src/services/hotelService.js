// const { searchAirport, getHotels } = require("../integrations/skyscanner");

// const searchHotelsService = async (destination) => {
//   const dest = await searchAirport(destination);

//   const res = await getHotels({
//     entityId: dest.entityId,
//     checkin: "2026-08-01",
//     checkout: "2026-08-05",
//     adults: 1,
//     rooms: 1,
//     market: "US",
//     currency: "USD",
//   });

//   return (res.data.hotels || []).map((h) => ({
//     name: h.name,
//     price: h.price?.formatted || "N/A",
//     rating: h.starRating || "N/A",
//     address: h.address,
//   }));
// };

// module.exports = { searchHotelsService };


const { searchHotels } = require("../integrations/skyscanner");
const { convertToNGN } = require("./currencyService");

exports.getHotels = async (query) => {
    const data = await searchHotels(query);

    const hotels = data?.results?.map(async (hotel) => {
        const priceUSD = hotel.price || 0;
        const priceNGN = await convertToNGN(priceUSD);

        return {
            name: hotel.name,
            rating: hotel.rating,
            priceUSD,
            priceNGN: Math.round(priceNGN)
        };
    });

    return Promise.all(hotels);
};
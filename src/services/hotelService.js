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
const { applySort } = require("../utils/sort");
const { paginate } = require("../utils/pagination");

const normalizePrice = (price) => {
  if (!price) return 0;
  if (typeof price === "number") return price;
  if (typeof price === "string") return parseFloat(price.replace(/[^0-9.]/g, "")) || 0;
  return price.amount || 0;
};

exports.getHotels = async (query) => {
  const { cityCode, checkIn, checkOut, passengers, sortBy, page = 1, limit = 10 } = query;
  const data = await searchHotels({ cityCode, checkIn, checkOut, passengers: passengers || 1 });

  const hotels =
    data?.hotels ||
    data?.results ||
    data?.data?.hotels ||
    data?.data?.results ||
    (Array.isArray(data?.data) ? data.data : []) ||
    [];

  let normalized = await Promise.all(
    hotels.map(async (hotel) => {
      const priceUSD = normalizePrice(
        hotel.price?.amount ?? hotel.price?.formatted ?? hotel.price ?? hotel.minPrice
      );
      return {
        name: hotel.name || hotel.hotelName || "Unknown Hotel",
        rating: hotel.rating || hotel.stars || hotel.starRating || "N/A",
        address: hotel.distance || hotel.address || hotel.location || "N/A",
        image: hotel.images?.[0] || null,
        priceUSD,
        priceNGN: Math.round(await convertToNGN(priceUSD)),
      };
    })
  );

  normalized = applySort(normalized, sortBy);
  return paginate(normalized, page, limit);
};
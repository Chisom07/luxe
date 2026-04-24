// // src/integrations/skyscanner.js

// const axios = require("axios");

// const BASE_URL = "https://skyscanner-flights-travel-api.p.rapidapi.com";

// const headers = {
//   "x-rapidapi-key": process.env.RAPIDAPI_KEY,
//   "x-rapidapi-host": process.env.RAPIDAPI_HOST,
// };

// // 🔹 STEP 1: Search airport/location
// const searchAirport = async (query) => {
//   try {
//     const res = await axios.get(`${BASE_URL}/locations/search`, {
//       params: { query },
//       headers,
//     });

//     const places = res.data?.data || [];

//     if (!places.length) {
//       throw new Error("No location found");
//     }

//     const best =
//       places.find((p) => p.placeType === "CITY") ||
//       places.find((p) => p.placeType === "AIRPORT") ||
//       places[0];

//     return {
//       skyId: best.skyId,
//       entityId: best.entityId,
//       name: best.name,
//     };
//   } catch (err) {
//     console.error("❌ searchAirport error:", err.response?.data || err.message);
//     throw err;
//   }
// };

// // 🔹 STEP 2: Flights (FIXED)
// const getFlights = async ({ from, to, date }) => {
//   try {
//     const origin = await searchAirport(from);
//     const destination = await searchAirport(to);

//     const res = await axios.get(`${BASE_URL}/flights/searchFlights`, {
//       params: {
//         countryCode: "US",
//         market: "US",
//         currency: "USD",
//         adults: 1,
//         infants: 0,
//         childrens: 0,
//         cabinClass: "economy",

//         originSkyId: origin.skyId,
//         originEntityId: origin.entityId,
//         destinationSkyId: destination.skyId,
//         destinationEntityId: destination.entityId,

//         date,
//         returnDate: "",
//       },
//       headers,
//     });

//     return res.data;
//   } catch (err) {
//     console.error("❌ getFlights error:", err.response?.data || err.message);
//     throw err;
//   }
// };

// // 🔹 STEP 3: Hotels (SAFE VERSION)
// // (Skyscanner hotel API is tricky → fallback mock if it fails)
// const getHotels = async ({ city }) => {
//   try {
//     const location = await searchAirport(city);

//     const res = await axios.get(`${BASE_URL}/hotels/searchHotels`, {
//       params: {
//         entityId: location.entityId,
//         checkin: "2026-08-01",
//         checkout: "2026-08-05",
//         adults: 1,
//         rooms: 1,
//         currency: "USD",
//         market: "US",
//         countryCode: "US",
//       },
//       headers,
//     });

//     return res.data;
//   } catch (err) {
//     console.error("⚠️ Hotels API failed, using fallback");

//     // ✅ fallback so your app NEVER crashes
//     return [
//       { id: 1, name: "Mock Hotel 1", city, price: 120 },
//       { id: 2, name: "Mock Hotel 2", city, price: 90 },
//     ];
//   }
// };

// module.exports = {
//   searchAirport,
//   getFlights,
//   getHotels,
// };

const axios = require("axios");

const BASE_URL = "https://skyscanner-flights-travel-api.p.rapidapi.com";

const headers = {
  "x-rapidapi-key": process.env.RAPIDAPI_KEY,
  "x-rapidapi-host": process.env.RAPIDAPI_HOST,
};



exports.searchFlights = async (params) => {
    const res = await axios.get(`${BASE_URL}/flights/searchFlights`, {
        headers,
        params
    });
    
    return res.data;
};

exports.searchHotels = async (params) => {
    const res = await axios.get(`${BASE_URL}/hotels/searchHotels`, {
        headers,
        params
    });
    return res.data;
};
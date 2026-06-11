const axios = require("axios");

const BASE_URL = "https://skyscanner-flights-travel-api.p.rapidapi.com";

const headers = {
  "x-rapidapi-key": process.env.RAPIDAPI_KEY,
  "x-rapidapi-host": process.env.RAPIDAPI_HOST,
};

const searchAirport = async (query) => {
  try {
    const res = await axios.get(`${BASE_URL}/locations/search`, {
      params: { query },
      headers,
    });

    const places = res.data?.data || [];
    if (!places.length) {
      throw new Error(`Location not found for ${query}`);
    }

    const best =
      places.find((p) => p.placeType === "CITY") ||
      places.find((p) => p.placeType === "AIRPORT") ||
      places[0];

    return {
      skyId: best.skyId,
      entityId: best.entityId,
      name: best.name,
    };
  } catch (err) {
    console.error("❌ searchAirport error:", err.response?.data || err.message);
    throw err;
  }
};

exports.searchFlights = async ({ from, to, date, passengers = 1 }) => {
  const origin = await searchAirport(from);
  const destination = await searchAirport(to);

  const res = await axios.get(`${BASE_URL}/flights/searchFlights`, {
    headers,
    params: {
      countryCode: "US",
      market: "US",
      currency: "USD",
      adults: passengers,
      infants: 0,
      childrens: 0,
      cabinClass: "economy",
      originSkyId: origin.skyId,
      originEntityId: origin.entityId,
      destinationSkyId: destination.skyId,
      destinationEntityId: destination.entityId,
      date,
      returnDate: "",
    },
  });

  return res.data;
};

exports.searchHotels = async ({ cityCode, checkIn, checkOut, passengers = 1 }) => {
  const location = await searchAirport(cityCode);

  const res = await axios.get(`${BASE_URL}/hotels/searchHotels`, {
    headers,
    params: {
      entityId: location.entityId,
      checkin: checkIn,
      checkout: checkOut,
      adults: passengers,
      rooms: 1,
      currency: "USD",
      market: "US",
      countryCode: "US",
    },
  });

  return res.data;
};
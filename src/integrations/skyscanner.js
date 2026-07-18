const axios = require("axios");

const rapidApiHost =
  process.env.RAPIDAPI_HOST ||
  "skyscanner-flights-travel-api.p.rapidapi.com";
const BASE_URL = `https://${rapidApiHost}`;

const headers = {
  "x-rapidapi-key": process.env.RAPIDAPI_KEY,
  "x-rapidapi-host": rapidApiHost,
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const asList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.places)) return payload.places;
  if (Array.isArray(payload?.data?.places)) return payload.data.places;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const requestWithRetry = async (request, attempts = 3) => {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await request();
    } catch (error) {
      lastError = error;
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message || "";
      const retryable =
        status === 429 ||
        status === 503 ||
        /temporarily unavailable|too many requests|retry/i.test(message);

      if (!retryable || attempt === attempts) break;
      await sleep(attempt * 1500);
    }
  }

  throw lastError;
};

const searchAirport = async (query) => {
  const res = await requestWithRetry(() =>
    axios.get(`${BASE_URL}/flights/searchAirport`, {
      headers,
      params: {
        query,
        market: "US",
        locale: "en-US",
      },
    })
  );

  const places = asList(res.data);
  if (!places.length) {
    throw new Error(`Location not found for ${query}`);
  }

  const best =
    places.find((place) => place.placeType === "CITY" || place.type === "city") ||
    places.find((place) => place.placeType === "AIRPORT" || place.type === "airport") ||
    places[0];

  if (!best?.skyId || !best?.entityId) {
    throw new Error(`Incomplete location data for ${query}`);
  }

  return {
    skyId: best.skyId,
    entityId: String(best.entityId),
    name: best.name,
  };
};

const searchHotelDestination = async (query) => {
  const res = await requestWithRetry(() =>
    axios.get(`${BASE_URL}/hotels/searchDestination`, {
      headers,
      params: {
        query,
        market: "US",
        locale: "en-US",
      },
    })
  );

  const destinations = asList(res.data);
  if (!destinations.length) {
    throw new Error(`Hotel destination not found for ${query}`);
  }

  const best =
    destinations.find((destination) => destination.type === "city" && destination.entityId) ||
    destinations.find((destination) => destination.entityId) ||
    destinations[0];

  if (!best?.entityId) {
    throw new Error(`Incomplete hotel destination data for ${query}`);
  }

  return {
    entityId: String(best.entityId),
    name: best.name,
  };
};

exports.suggestAirports = async (query) => {
  const res = await requestWithRetry(() =>
    axios.get(`${BASE_URL}/flights/searchAirport`, {
      headers,
      params: {
        query,
        market: "US",
        locale: "en-US",
      },
    })
  );

  return asList(res.data)
    .filter((place) => place.name)
    .slice(0, 8)
    .map((place) => ({
      name: place.name,
      code: place.iataCode || place.skyId || "",
      type: place.placeType || place.type || "",
      hierarchy: place.hierarchy || "",
    }));
};

exports.suggestHotelDestinations = async (query) => {
  const res = await requestWithRetry(() =>
    axios.get(`${BASE_URL}/hotels/searchDestination`, {
      headers,
      params: {
        query,
        market: "US",
        locale: "en-US",
      },
    })
  );

  return asList(res.data)
    .filter((place) => place.name && place.entityId)
    .slice(0, 8)
    .map((place) => ({
      name: place.name,
      code: place.entityId || "",
      type: place.type || place.placeType || "",
      hierarchy: place.hierarchy || "",
    }));
};

const pollIncompleteFlights = async (sessionToken, initialItineraries = []) => {
  let status = "RESULT_STATUS_INCOMPLETE";
  let token = sessionToken;
  let itineraries = [...initialItineraries];

  for (let attempt = 0; attempt < 5 && status === "RESULT_STATUS_INCOMPLETE" && token; attempt += 1) {
    await sleep(1000);

    const res = await axios.get(`${BASE_URL}/flights/searchIncomplete`, {
      headers,
      params: { sessionId: token },
    });

    const next = res.data || {};
    itineraries = [...itineraries, ...(next.itineraries || next.data?.itineraries || [])];
    status = next.status || "RESULT_STATUS_COMPLETE";
    token = next.sessionToken || token;
  }

  return { itineraries, status, sessionToken: token };
};

exports.searchFlights = async ({ from, to, date, passengers = 1 }) => {
  const origin = await searchAirport(from);
  const destination = await searchAirport(to);

  const res = await axios.get(`${BASE_URL}/flights/searchFlights`, {
    headers,
    params: {
      originSkyId: origin.skyId,
      destinationSkyId: destination.skyId,
      originEntityId: origin.entityId,
      destinationEntityId: destination.entityId,
      date,
      adults: passengers,
      cabinClass: "economy",
      currency: "USD",
      market: "US",
      countryCode: "US",
    },
  });

  const data = res.data || {};
  let itineraries = data.itineraries || data.data?.itineraries || [];
  let status = data.status;
  let sessionToken = data.sessionToken;

  if (status === "RESULT_STATUS_INCOMPLETE" || (!itineraries.length && sessionToken)) {
    const polled = await pollIncompleteFlights(sessionToken, itineraries);
    itineraries = polled.itineraries;
    status = polled.status;
    sessionToken = polled.sessionToken;
  }

  return {
    ...data,
    itineraries,
    status,
    sessionToken,
  };
};

exports.searchHotels = async ({ cityCode, checkIn, checkOut, passengers = 1 }) => {
  const location = await searchHotelDestination(cityCode);

  const res = await requestWithRetry(() =>
    axios.get(`${BASE_URL}/hotels/searchHotels`, {
      headers,
      params: {
        entityId: location.entityId,
        checkIn,
        checkOut,
        adults: passengers || 2,
        rooms: 1,
        currency: "USD",
        market: "US",
      },
    })
  );

  return res.data;
};

const combinedForm = document.getElementById("combinedForm");
const combinedStatus = document.getElementById("combinedStatus");
const flightForm = document.getElementById("flightForm");
const hotelForm = document.getElementById("hotelForm");
const flightStatus = document.getElementById("flightStatus");
const hotelStatus = document.getElementById("hotelStatus");
const flightResults = document.getElementById("flightResults");
const hotelResults = document.getElementById("hotelResults");
const flightPagination = document.getElementById("flightPagination");
const hotelPagination = document.getElementById("hotelPagination");

const PAGE_SIZE = 10;

const searchState = {
  flights: { params: null, page: 1 },
  hotels: { params: null, page: 1 },
};

const images = {
  flights: [
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=700&h=440&fit=crop",
    "https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=700&h=440&fit=crop",
    "https://images.unsplash.com/photo-1542296332-2e4473faf563?w=700&h=440&fit=crop",
  ],
  hotels: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700&h=440&fit=crop",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=700&h=440&fit=crop",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=700&h=440&fit=crop",
  ],
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const getResults = (payload) => payload?.data?.results || [];

const setFormLoading = (form, loading, label) => {
  const button = form.querySelector('button[type="submit"]');
  button.disabled = loading;
  button.textContent = loading ? "Searching..." : label;
};

const renderFlights = (flights) => {
  flightResults.innerHTML = flights
    .map((flight, index) => {
      const stops = Number(flight.stops) || 0;
      return `
        <article class="flight-row" style="animation-delay: ${index * 40}ms">
          <div class="flight-media">
            <img src="${images.flights[index % images.flights.length]}" alt="Passenger plane in flight">
            <span class="card-badge">${stops === 0 ? "Direct" : `${stops} stop${stops === 1 ? "" : "s"}`}</span>
          </div>
          <div class="flight-body">
            <div class="flight-top">
              <div>
                <p class="flight-kicker">${escapeHtml(flight.airline || "Airline")}</p>
                <h3>${escapeHtml(flight.from)} <span>→</span> ${escapeHtml(flight.to)}</h3>
              </div>
              <strong class="price-tag">${formatCurrency(flight.priceNGN)}</strong>
            </div>
            <div class="flight-meta">
              <span>${escapeHtml(flight.duration || "N/A")} travel time</span>
              <span>USD $${escapeHtml(flight.priceUSD || 0)}</span>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
};

const renderHotels = (hotels) => {
  hotelResults.innerHTML = hotels
    .map(
      (hotel, index) => `
        <article class="hotel-card" style="animation-delay: ${index * 40}ms">
          <div class="hotel-media">
            <img src="${escapeHtml(hotel.image || images.hotels[index % images.hotels.length])}" alt="${escapeHtml(hotel.name || "Hotel")}">
            <span class="card-badge">★ ${escapeHtml(hotel.rating || "N/A")}</span>
          </div>
          <div class="hotel-body">
            <div class="hotel-top">
              <div>
                <p class="hotel-kicker">Featured stay</p>
                <h3>${escapeHtml(hotel.name || "Hotel")}</h3>
              </div>
              <strong class="price-tag">${formatCurrency(hotel.priceNGN)}</strong>
            </div>
            <div class="hotel-meta">
              <span>${escapeHtml(hotel.address || "Address unavailable")}</span>
              <span>USD $${escapeHtml(hotel.priceUSD || 0)}</span>
            </div>
          </div>
        </article>
      `
    )
    .join("");
};

const renderPagination = (container, meta, endpoint) => {
  if (!meta || meta.totalPages <= 1) {
    container.innerHTML = "";
    return;
  }

  const page = Number(meta.page) || 1;
  const totalPages = Number(meta.totalPages) || 1;

  container.innerHTML = `
    <div class="pagination">
      <button class="pag-btn" type="button" data-endpoint="${endpoint}" data-page="${page - 1}" ${page <= 1 ? "disabled" : ""}>
        ← Previous
      </button>
      <span>Page ${page} of ${totalPages}</span>
      <button class="pag-btn" type="button" data-endpoint="${endpoint}" data-page="${page + 1}" ${page >= totalPages ? "disabled" : ""}>
        Next →
      </button>
    </div>
  `;
};

const search = async ({ form, endpoint, status, results, pagination, label, render, page = 1 }) => {
  const params = new URLSearchParams(searchState[endpoint].params || new FormData(form));

  for (const field of ["from", "to", "cityCode"]) {
    if (params.has(field)) params.set(field, params.get(field).trim());
  }

  if (!params.get("sortBy")) params.delete("sortBy");
  if (!params.get("stops")) params.delete("stops");

  params.set("page", String(page));
  params.set("limit", String(PAGE_SIZE));

  searchState[endpoint].page = page;

  setFormLoading(form, true, label);
  status.className = "status loading-state";
  status.textContent = `Searching for ${endpoint}...`;
  results.innerHTML = "";
  pagination.innerHTML = "";

  try {
    const response = await fetch(`/api/${endpoint}?${params}`);
    const contentType = response.headers.get("content-type") || "";
    const raw = await response.text();

    if (!contentType.includes("application/json")) {
      throw new Error(
        "API is not reachable. Start the app with npm start and open http://localhost:3000 (or your PORT)."
      );
    }

    let payload;
    try {
      payload = JSON.parse(raw);
    } catch {
      throw new Error("The server returned an invalid response. Please try again.");
    }

    if (!response.ok) {
      throw new Error(payload.error || "The search could not be completed.");
    }

    const items = getResults(payload);
    const meta = payload.data || {};

    if (!items.length) {
      status.className = "status empty-state";
      status.textContent = `No ${endpoint} found. Try changing your search.`;
      return;
    }

    status.className = "status success-state";
    status.textContent = `${meta.total ?? items.length} ${endpoint} found · showing page ${meta.page || page}`;
    render(items);
    renderPagination(pagination, meta, endpoint);
  } catch (error) {
    status.className = "status error-state";
    status.textContent = error.message || "Something went wrong. Please try again.";
  } finally {
    setFormLoading(form, false, label);
  }
};

const startSearch = (endpoint) => {
  const config =
    endpoint === "flights"
      ? {
          form: flightForm,
          status: flightStatus,
          results: flightResults,
          pagination: flightPagination,
          label: "Search flights",
          render: renderFlights,
        }
      : {
          form: hotelForm,
          status: hotelStatus,
          results: hotelResults,
          pagination: hotelPagination,
          label: "Search hotels",
          render: renderHotels,
        };

  searchState[endpoint].params = new URLSearchParams(new FormData(config.form));
  searchState[endpoint].page = 1;

  search({
    ...config,
    endpoint,
    page: 1,
  });
};

flightForm.addEventListener("submit", (event) => {
  event.preventDefault();
  startSearch("flights");
});

hotelForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const checkIn = document.getElementById("hotelCheckIn").value;
  const checkOut = document.getElementById("hotelCheckOut").value;
  if (checkOut <= checkIn) {
    hotelStatus.className = "status error-state";
    hotelStatus.textContent = "Check-out must be after check-in.";
    return;
  }

  startSearch("hotels");
});

document.addEventListener("click", (event) => {
  const button = event.target.closest(".pag-btn");
  if (!button || button.disabled) return;

  const endpoint = button.dataset.endpoint;
  const page = Number(button.dataset.page);
  if (!endpoint || !page || !searchState[endpoint].params) return;

  const config =
    endpoint === "flights"
      ? {
          form: flightForm,
          status: flightStatus,
          results: flightResults,
          pagination: flightPagination,
          label: "Search flights",
          render: renderFlights,
        }
      : {
          form: hotelForm,
          status: hotelStatus,
          results: hotelResults,
          pagination: hotelPagination,
          label: "Search hotels",
          render: renderHotels,
        };

  search({
    ...config,
    endpoint,
    page,
  });

  document.getElementById(endpoint)?.scrollIntoView({ behavior: "smooth", block: "start" });
});

["flightSort", "flightStops"].forEach((id) => {
  document.getElementById(id)?.addEventListener("change", () => {
    if (searchState.flights.params) startSearch("flights");
  });
});

document.getElementById("hotelSort")?.addEventListener("change", () => {
  if (searchState.hotels.params) startSearch("hotels");
});

const setupAutocomplete = (inputId, listId, endpoint) => {
  const input = document.getElementById(inputId);
  const list = document.getElementById(listId);
  if (!input || !list) return;

  let debounceTimer;
  let controller;

  const closeList = () => {
    list.hidden = true;
    list.innerHTML = "";
    input.setAttribute("aria-expanded", "false");
  };

  const renderSuggestions = (items) => {
    if (!items.length) {
      closeList();
      return;
    }

    list.innerHTML = items
      .map(
        (item) => `
          <li class="suggestion" role="option" data-value="${escapeHtml(item.name)}">
            <span class="suggestion-name">${escapeHtml(item.name)}</span>
            <span class="suggestion-meta">${escapeHtml(item.hierarchy || item.type || "")}</span>
            ${item.code ? `<span class="suggestion-code">${escapeHtml(item.code)}</span>` : ""}
          </li>
        `
      )
      .join("");
    list.hidden = false;
    input.setAttribute("aria-expanded", "true");
  };

  const fetchSuggestions = async (query) => {
    if (controller) controller.abort();
    controller = new AbortController();

    try {
      const response = await fetch(
        `/api/locations/${endpoint}?query=${encodeURIComponent(query)}`,
        { signal: controller.signal }
      );
      if (!response.ok) return;
      const payload = await response.json();
      renderSuggestions(payload.data || []);
    } catch (error) {
      if (error.name !== "AbortError") closeList();
    }
  };

  input.addEventListener("input", () => {
    const query = input.value.trim();
    clearTimeout(debounceTimer);

    if (query.length < 2) {
      closeList();
      return;
    }

    debounceTimer = setTimeout(() => fetchSuggestions(query), 250);
  });

  list.addEventListener("mousedown", (event) => {
    const option = event.target.closest(".suggestion");
    if (!option) return;
    event.preventDefault();
    input.value = option.dataset.value;
    closeList();
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeList();
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".autocomplete")) closeList();
  });
};

setupAutocomplete("flightFrom", "flightFromSuggestions", "flights");
setupAutocomplete("flightTo", "flightToSuggestions", "flights");
setupAutocomplete("hotelCity", "hotelCitySuggestions", "hotels");
setupAutocomplete("comboFrom", "comboFromSuggestions", "flights");
setupAutocomplete("comboTo", "comboToSuggestions", "flights");
setupAutocomplete("comboCity", "comboCitySuggestions", "hotels");

const today = new Date().toISOString().split("T")[0];
document.querySelectorAll('input[type="date"]').forEach((input) => {
  input.min = today;
});

const syncDatePair = (startInput, endInput) => {
  if (!startInput || !endInput) return;
  startInput.addEventListener("change", () => {
    endInput.min = startInput.value || today;
    if (endInput.value && endInput.value <= startInput.value) endInput.value = "";
  });
};

const checkInInput = document.getElementById("hotelCheckIn");
const checkOutInput = document.getElementById("hotelCheckOut");
syncDatePair(checkInInput, checkOutInput);
syncDatePair(document.getElementById("comboCheckIn"), document.getElementById("comboCheckOut"));

document.getElementById("comboTo")?.addEventListener("change", (event) => {
  const city = document.getElementById("comboCity");
  if (city && !city.value.trim()) city.value = event.target.value;
});

document.getElementById("comboDate")?.addEventListener("change", (event) => {
  const checkIn = document.getElementById("comboCheckIn");
  if (checkIn && !checkIn.value) {
    checkIn.value = event.target.value;
    checkIn.dispatchEvent(new Event("change"));
  }
});

const setCombinedStatus = (message, isError = false) => {
  if (!combinedStatus) return;
  combinedStatus.hidden = !message;
  combinedStatus.textContent = message || "";
  combinedStatus.classList.toggle("error", isError);
};

const syncSectionForms = (params) => {
  document.getElementById("flightFrom").value = params.get("from") || "";
  document.getElementById("flightTo").value = params.get("to") || "";
  document.getElementById("flightDate").value = params.get("date") || "";
  document.getElementById("flightPassengers").value = params.get("passengers") || "1";

  document.getElementById("hotelCity").value = params.get("cityCode") || "";
  document.getElementById("hotelCheckIn").value = params.get("checkIn") || "";
  document.getElementById("hotelCheckOut").value = params.get("checkOut") || "";
};

combinedForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const params = new URLSearchParams(new FormData(combinedForm));
  const checkIn = params.get("checkIn");
  const checkOut = params.get("checkOut");

  if (checkOut <= checkIn) {
    setCombinedStatus("Check-out must be after check-in.", true);
    return;
  }

  params.set("page", "1");
  params.set("limit", String(PAGE_SIZE));

  const button = combinedForm.querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = "Searching trip...";
  setCombinedStatus("Searching flights and hotels together...");

  flightResults.innerHTML = "";
  hotelResults.innerHTML = "";
  flightPagination.innerHTML = "";
  hotelPagination.innerHTML = "";
  flightStatus.className = "status loading-state";
  hotelStatus.className = "status loading-state";
  flightStatus.textContent = "Searching for flights...";
  hotelStatus.textContent = "Searching for hotels...";

  try {
    const response = await fetch(`/api/search?${params}`);
    const contentType = response.headers.get("content-type") || "";
    const raw = await response.text();

    if (!contentType.includes("application/json")) {
      throw new Error("API is not reachable. Start the app with npm start and open http://localhost:3000.");
    }

    const payload = JSON.parse(raw);
    if (!response.ok) throw new Error(payload.error || "Combined search failed.");

    const flights = payload.data?.flights || [];
    const hotels = payload.data?.hotels || [];
    const flightMeta = {
      ...(payload.meta?.flights || {}),
      results: flights,
      total: payload.meta?.flights?.total ?? flights.length,
      page: payload.meta?.flights?.page || 1,
      totalPages: payload.meta?.flights?.totalPages || 1,
    };
    const hotelMeta = {
      ...(payload.meta?.hotels || {}),
      results: hotels,
      total: payload.meta?.hotels?.total ?? hotels.length,
      page: payload.meta?.hotels?.page || 1,
      totalPages: payload.meta?.hotels?.totalPages || 1,
    };

    syncSectionForms(params);

    searchState.flights.params = new URLSearchParams(params);
    searchState.hotels.params = new URLSearchParams(params);
    searchState.flights.page = flightMeta.page;
    searchState.hotels.page = hotelMeta.page;

    if (!flights.length) {
      flightStatus.className = "status empty-state";
      flightStatus.textContent = "No flights found. Try changing your route or date.";
    } else {
      flightStatus.className = "status success-state";
      flightStatus.textContent = `${flightMeta.total} flights found · showing page ${flightMeta.page}`;
      renderFlights(flights);
      renderPagination(flightPagination, flightMeta, "flights");
    }

    if (!hotels.length) {
      hotelStatus.className = "status empty-state";
      hotelStatus.textContent = "No hotels found. Try changing your city or dates.";
    } else {
      hotelStatus.className = "status success-state";
      hotelStatus.textContent = `${hotelMeta.total} hotels found · showing page ${hotelMeta.page}`;
      renderHotels(hotels);
      renderPagination(hotelPagination, hotelMeta, "hotels");
    }

    setCombinedStatus(
      `Found ${flightMeta.total || 0} flights and ${hotelMeta.total || 0} hotels.`
    );
    document.getElementById("flights")?.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    setCombinedStatus(error.message || "Unable to complete the trip search.", true);
    flightStatus.className = "status error-state";
    hotelStatus.className = "status error-state";
    flightStatus.textContent = "Flight search could not be completed.";
    hotelStatus.textContent = "Hotel search could not be completed.";
  } finally {
    button.disabled = false;
    button.textContent = "Search trip";
  }
});

document.querySelectorAll(".footer-link").forEach((button) => {
  button.addEventListener("click", () => {
    const fill = button.dataset.fill;

    if (fill === "hotel") {
      const hotelCity = document.getElementById("hotelCity");
      hotelCity.value = button.dataset.value || "";
      document.getElementById("hotels")?.scrollIntoView({ behavior: "smooth", block: "start" });
      hotelCity.focus();
      return;
    }

    if (fill === "flight") {
      document.getElementById("flightFrom").value = button.dataset.from || "";
      document.getElementById("flightTo").value = button.dataset.to || "";
      document.getElementById("flights")?.scrollIntoView({ behavior: "smooth", block: "start" });
      document.getElementById("flightDate")?.focus();
    }
  });
});

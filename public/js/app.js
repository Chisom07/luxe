const form = document.getElementById("searchForm");
const status = document.getElementById("status");
const flightResults = document.getElementById("flightResults");
const hotelResults = document.getElementById("hotelResults");
const flightControls = document.getElementById("flightControls");
const hotelControls = document.getElementById("hotelControls");

let lastSearchParams = null;

// Easily changeable image URLs - modify these to use your own images
const IMAGE_URLS = {
  flightImages: [
    "https://images.unsplash.com/photo-1436262174933-eb52a4c8fe20?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1552463735-e681c46ffc4e?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop",
  ],
  hotelImages: [
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1520631878496-a3c6b5e5cc43?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=400&h=300&fit=crop",
  ],
};

const getRandomImage = (imageArray) =>
  imageArray[Math.floor(Math.random() * imageArray.length)];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

const createCard = ({ title, subtitle, details, image }) => {
  return `
    <article class="card">
      <div class="card-image">
        <img src="${image}" alt="${title}" />
      </div>
      <div class="card-content">
        <h3>${title}</h3>
        <p>${subtitle}</p>
        ${details.map((line) => `<p>${line}</p>`).join("")}
      </div>
    </article>
  `;
};

const renderFlights = (flights) => {
  if (!flights || flights.length === 0) {
    flightResults.innerHTML = `<p class="status">No flight options found. Try changing the route or date.</p>`;
    return;
  }

  flightResults.innerHTML = flights
    .map((flight) =>
      createCard({
        title: flight.airline,
        subtitle: `${flight.from} → ${flight.to}`,
        details: [
          `Duration: ${flight.duration}`,
          `Stops: ${flight.stops}`,
          `USD: $${flight.priceUSD}`,
          `NGN: ${formatCurrency(flight.priceNGN)}`,
        ],
        image: getRandomImage(IMAGE_URLS.flightImages),
      })
    )
    .join("");
};

const renderHotels = (hotels) => {
  if (!hotels || hotels.length === 0) {
    hotelResults.innerHTML = `<p class="status">No hotel options found. Try a different city or dates.</p>`;
    return;
  }

  hotelResults.innerHTML = hotels
    .map((hotel) =>
      createCard({
        title: hotel.name,
        subtitle: `Rating: ${hotel.rating}`,
        details: [
          `Price: USD $${hotel.priceUSD}`,
          `Converted: ${formatCurrency(hotel.priceNGN)}`,
          `Address: ${hotel.address || "N/A"}`,
        ],
        image: getRandomImage(IMAGE_URLS.hotelImages),
      })
    )
    .join("");
};

const renderFlightPagination = (meta) => {
  if (meta.totalPages <= 1) return;
  flightControls.innerHTML = `
    <div class="pagination">
      ${meta.page > 1 ? `<button class="pag-btn" onclick="goToPage(${meta.page - 1}, 'flight')">← Previous</button>` : ""}
      <span>Page ${meta.page} of ${meta.totalPages}</span>
      ${meta.page < meta.totalPages ? `<button class="pag-btn" onclick="goToPage(${meta.page + 1}, 'flight')">Next →</button>` : ""}
    </div>
  `;
};

const renderHotelPagination = (meta) => {
  if (meta.totalPages <= 1) return;
  hotelControls.innerHTML = `
    <div class="pagination">
      ${meta.page > 1 ? `<button class="pag-btn" onclick="goToPage(${meta.page - 1}, 'hotel')">← Previous</button>` : ""}
      <span>Page ${meta.page} of ${meta.totalPages}</span>
      ${meta.page < meta.totalPages ? `<button class="pag-btn" onclick="goToPage(${meta.page + 1}, 'hotel')">Next →</button>` : ""}
    </div>
  `;
};

window.goToPage = (page, type) => {
  if (lastSearchParams) {
    lastSearchParams.page = page;
    performSearch(lastSearchParams);
  }
};

const performSearch = async (params) => {
  status.textContent = "Searching for flights and hotels...";
  flightResults.innerHTML = "";
  hotelResults.innerHTML = "";
  flightControls.innerHTML = "";
  hotelControls.innerHTML = "";

  try {
    const res = await fetch(`/api/search?${new URLSearchParams(params).toString()}`);
    const data = await res.json();

    if (!res.ok) {
      status.textContent = data.error || "Search failed. Check your input and try again.";
      return;
    }

    status.textContent = `Found ${data.meta.flights.total} flights and ${data.meta.hotels.total} hotels.`;
    
    renderFlights(data.data.flights);
    renderHotels(data.data.hotels);
    renderFlightPagination(data.meta.flights);
    renderHotelPagination(data.meta.hotels);
  } catch (error) {
    status.textContent = "Unable to complete the search. Please try again later.";
    console.error(error);
  }
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const from = document.getElementById("from").value.trim().toUpperCase();
  const to = document.getElementById("to").value.trim().toUpperCase();
  const date = document.getElementById("date").value;
  const cityCode = document.getElementById("cityCode").value.trim().toUpperCase();
  const checkIn = document.getElementById("checkIn").value;
  const checkOut = document.getElementById("checkOut").value;
  const passengers = document.getElementById("passengers").value || 1;
  const sortBy = document.getElementById("flightSort")?.value || "";
  const stops = document.getElementById("stops")?.value || "";

  lastSearchParams = {
    from,
    to,
    date,
    cityCode,
    checkIn,
    checkOut,
    passengers,
    sortBy,
    stops,
    page: 1,
  };

  performSearch(lastSearchParams);
});

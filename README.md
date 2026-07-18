# Luxe Travel Aggregator

A travel search app that combines live **flight** and **hotel** results in one place, with NGN price conversion, location autocomplete, caching, and simple auth.

Built with Node.js / Express and a responsive HTML, CSS, and JavaScript frontend.

---

## Features

- Combined trip search (flights + hotels in one click)
- Dedicated flight and hotel search sections
- City / airport autocomplete powered by Skyscanner
- Live results with sorting and pagination
- Real-time USD → NGN price conversion
- Redis caching with in-memory fallback
- Sign up / log in with JWT sessions
- Responsive modern UI

---

## Tech Stack

| Layer | Tools |
| --- | --- |
| Backend | Node.js, Express.js |
| Auth | bcryptjs, jsonwebtoken |
| Validation | Joi |
| Cache | Redis (ioredis) + memory fallback |
| APIs | Skyscanner Flights & Travel API (RapidAPI), ExchangeRate API |
| Frontend | HTML, CSS, JavaScript |

---

## Prerequisites

- Node.js **18+**
- npm
- A [RapidAPI](https://rapidapi.com/) key subscribed to **Skyscanner Flights & Travel API**
- Optional: Redis (falls back to in-memory cache if unavailable)
- Optional: ExchangeRate API key (falls back to a public rate endpoint)

---

## Getting Started

### 1. Clone and install

```bash
git clone <your-repository-url>
cd travel-aggregator
npm install
```

### 2. Configure environment

Create a `.env` file in the project root:

```env
PORT=3000

# Required — Skyscanner via RapidAPI
RAPIDAPI_KEY=your_rapidapi_key
RAPIDAPI_HOST=skyscanner-flights-travel-api.p.rapidapi.com

# Optional — currency conversion
EXCHANGE_API_KEY=your_exchangerate_api_key

# Optional — Redis (defaults to memory cache if unreachable)
REDIS_URL=redis://127.0.0.1:6379

# Optional — auth
JWT_SECRET=change-me-in-production
JWT_EXPIRES_IN=7d
```

### 3. Run the app

```bash
# development (auto-reload)
npm run dev

# production
npm start
```

Open **http://localhost:3000** (or your configured `PORT`).

| Page | URL |
| --- | --- |
| Home / search | `/` |
| Sign up | `/signup.html` |
| Log in | `/login.html` |

---

## API Overview

Base path: `/api`

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/search` | Combined flight + hotel search |
| `GET` | `/flights` | Flight search |
| `GET` | `/hotels` | Hotel search |
| `GET` | `/locations/flights?query=` | Flight location autocomplete |
| `GET` | `/locations/hotels?query=` | Hotel destination autocomplete |
| `POST` | `/auth/signup` | Create account |
| `POST` | `/auth/login` | Log in |
| `GET` | `/auth/me` | Current user (Bearer token) |

### Example flight search

```bash
curl "http://localhost:3000/api/flights?from=Lagos&to=London&date=2026-09-15&passengers=1"
```

### Example hotel search

```bash
curl "http://localhost:3000/api/hotels?cityCode=London&checkIn=2026-09-15&checkOut=2026-09-18"
```

### Example auth

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Ada Okoro\",\"email\":\"ada@example.com\",\"password\":\"secret1\",\"confirmPassword\":\"secret1\"}"
```

---

## Project Structure

```text
travel-aggregator/
├── public/                 # Frontend
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── css/
│   └── js/
├── src/
│   ├── app.js              # Express app
│   ├── cache/              # Redis + fallback
│   ├── controllers/
│   ├── integrations/       # Skyscanner, exchange rates
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── validators/
├── data/                   # Local user store (gitignored)
├── server.js
├── package.json
└── .env
```

---

## Notes

- **RapidAPI quota:** The free BASIC plan is limited (about 100 requests/month). Combined searches use multiple upstream calls, so quota can run out quickly during testing.
- **Redis:** If Redis is not running, the app continues with an in-memory cache for the current process.
- **Auth storage:** Users are stored in `data/users.json` for local development. Do not commit this file.
- Prefer setting a strong `JWT_SECRET` before deploying.

---

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the server |
| `npm run dev` | Start with nodemon |

---

## License

ISC

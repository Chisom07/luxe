# Luxe: Premium Travel Aggregator

A high-performance Flight and Hotel search aggregator built with Node.js and Express. This project integrates the Skyscanner API (via RapidAPI) to provide real-time travel options, featuring currency conversion to NGN and Redis caching for optimized performance.

## 🚀 Key Features
- **Unified Search:** Query flights and hotels in a single dashboard.
- **Real-time NGN Conversion:** Automatic price conversion from USD/EUR to NGN via Exchange Rates API.
- **Redis Caching:** Flight results are cached for 10 minutes to reduce API latency and costs.
- **Responsive UI:** Clean HTML/CSS interface for viewing results and managing bookmarks.

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js
- **Database/Cache:** Redis
- **APIs:** Skyscanner (RapidAPI), Exchange Rates API
- **Frontend:** HTML5, CSS3, JavaScript (Fetch API)

## 🚧 Project Status (WIP)
Currently in active development. 
- [x] Server and Middleware Setup
- [x] Redis Connection Configuration
- [/] API Integration (Skyscanner) - *In Progress*
- [ ] Debugging: Resolving 404 GET routing issues on search endpoints.

## ⚙️ Setup Instructions
1. Clone the repository: `git clone [repo-link]`
2. Install dependencies: `npm install`
3. Create a `.env` file and add your API keys:
   ```text
   RAPIDAPI_KEY=your_key_here
   EXCHANGE_RATE_API_KEY=your_key_here
   REDIS_URL=127.0.0.1:6379
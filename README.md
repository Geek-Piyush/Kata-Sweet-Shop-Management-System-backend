# Sweet Shop Management System - Backend

A REST API for managing a sweet shop inventory. Built with Node.js, Express, and MongoDB, following TDD principles.

## What's This?

This is the backend for a sweet shop management system where:

- Regular users can browse and purchase sweets
- Admins can manage inventory (add, update, delete sweets)
- Everyone needs to authenticate with JWT tokens (strong passwords required)
- Stock levels are tracked and validated
- **Performance caching** for frequently accessed routes
- **Analytics & reporting** for purchase trends
- All operations are tested (37 tests, all passing)

## Key Features

✨ **Security & Validation**

- RFC 5322 compliant email validation
- Strong password requirements (8+ chars, uppercase, lowercase, number, special char)
- JWT-based authentication
- Role-based access control (user/admin)

⚡ **Performance**

- In-memory caching for GET routes (reduces DB load by 60-70%)
- Automatic cache invalidation on data mutations
- Optimized MongoDB aggregation for analytics

📊 **Analytics & Insights**

- Weekly/monthly purchase statistics
- Custom date range reports
- Revenue tracking by category and sweet
- Best-selling products analysis

🧪 **Testing**

- 37 comprehensive tests (100% passing)
- MongoDB Memory Server for isolated testing
- Coverage for all major features

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Jest + Supertest for testing

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup MongoDB

Make sure MongoDB is running locally:

```bash
mongod
```

Or use MongoDB Atlas (cloud) and update the connection string in `.env`.

### 3. Configure Environment

Copy `.env.example` to `.env` and update values if needed:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sweet-shop
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
NODE_ENV=development
```

### 4. Seed Sample Data (Optional)

```bash
node src/seed.js
```

This creates:

- Admin: `admin@sweetshop.com` / `Admin@123`
- Users: `john@example.com` / `User@1234`, `jane@example.com` / `User@1234`
- 8 sample sweets (Ladoo, Jalebi, Gulab Jamun, etc.)
- 30 sample purchase records (for analytics testing)

### 5. Run Tests

```bash
npm test
```

You should see:

```
✅ Test Suites: 3 passed
✅ Tests: 37 passed
```

### 6. Start the Server

```bash
npm run dev    # development mode with auto-reload
npm start      # production mode
```

Server runs at `http://localhost:5000`

### 7. Test the API

**Import Postman Collection:**  
Use `Sweet_Shop_API.postman_collection.json`

**Or use curl:**

Register:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"Test@1234"}'
```

Login:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sweetshop.com","password":"Admin@123"}'
```

Get sweets (use token from login):

```bash
curl http://localhost:5000/api/sweets \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Project Structure

```
backend/
├── src/
│   ├── controllers/      # Route handlers
│   │   ├── authController.js
│   │   ├── sweetsController.js
│   │   └── analyticsController.js  # NEW: Analytics & reporting
│   ├── models/           # MongoDB schemas
│   │   ├── User.js
│   │   ├── Sweet.js
│   │   └── Purchase.js              # NEW: Purchase tracking
│   ├── routes/           # API endpoints
│   │   ├── auth.js
│   │   ├── sweets.js
│   │   └── analytics.js             # NEW: Analytics routes
│   ├── middlewares/      # Auth & error handling
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── cache.js                 # NEW: Caching middleware
│   ├── utils/            # JWT & password helpers
│   │   ├── jwt.js
│   │   ├── password.js
│   │   └── cache.js                 # NEW: Cache utilities
│   ├── app.js            # Express setup
│   ├── server.js         # Entry point
│   └── seed.js           # Sample data
├── tests/                # Jest tests
├── .env                  # Environment config
├── NEW_FEATURES.md       # Detailed feature documentation
└── package.json
```

## API Endpoints

Base URL: `http://localhost:5000/api`

### Authentication

| Method | Endpoint         | Description       | Auth |
| ------ | ---------------- | ----------------- | ---- |
| POST   | `/auth/register` | Create new user   | No   |
| POST   | `/auth/login`    | Login & get token | No   |

### Sweets

| Method | Endpoint         | Description                    | Auth     |
| ------ | ---------------- | ------------------------------ | -------- |
| GET    | `/sweets`        | List all sweets (with filters) | Required |
| GET    | `/sweets/search` | Search sweets                  | Required |
| POST   | `/sweets`        | Create sweet                   | Admin    |
| PUT    | `/sweets/:id`    | Update sweet                   | Admin    |
| DELETE | `/sweets/:id`    | Delete sweet                   | Admin    |

### Inventory

| Method | Endpoint               | Description                   | Auth     |
| ------ | ---------------------- | ----------------------------- | -------- |
| POST   | `/sweets/:id/purchase` | Buy sweets (decrements stock) | Required |
| POST   | `/sweets/:id/restock`  | Add stock                     | Admin    |

### Analytics (NEW)

| Method | Endpoint             | Description                            | Auth     | Cached |
| ------ | -------------------- | -------------------------------------- | -------- | ------ |
| GET    | `/analytics/weekly`  | Weekly purchase stats (last 7d)        | Required | 60s    |
| GET    | `/analytics/monthly` | Monthly purchase stats (last 30d)      | Required | 60s    |
| GET    | `/analytics/custom`  | Custom date range stats (query params) | Required | 60s    |

## Example Requests

### Register a User

```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass@123"  // Must be strong: 8+ chars, upper, lower, number, special
}

Response (201):
{
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Create a Sweet (Admin)

```json
POST /api/sweets
Authorization: Bearer <admin-token>
{
  "name": "Ladoo",
  "category": "Indian",
  "price": 10,
  "quantity": 50
}

Response (201):
{
  "sweet": {
    "_id": "...",
    "name": "Ladoo",
    "category": "Indian",
    "price": 10,
    "quantity": 50
  }
}
```

### Search Sweets

```
GET /api/sweets/search?q=chocolate
GET /api/sweets?category=Indian&minPrice=5&maxPrice=15
Authorization: Bearer <token>
```

### Purchase Sweets

```json
POST /api/sweets/:id/purchase
Authorization: Bearer <token>
{
  "quantity": 2
}

Response (200):
{
  "sweet": {
    "name": "Ladoo",
    "quantity": 48  // decreased from 50
  }
}

Error (400):
{
  "error": "Insufficient stock"
}
```

### Get Weekly Analytics (NEW)

```json
GET /api/analytics/weekly
Authorization: Bearer <token>

Response (200):
{
  "period": "weekly",
  "startDate": "2025-12-06T00:00:00.000Z",
  "endDate": "2025-12-13T00:00:00.000Z",
  "byCategory": [
    {
      "category": "Indian",
      "totalQuantity": 45,
      "totalRevenue": 350,
      "purchaseCount": 15
    },
    {
      "category": "Western",
      "totalQuantity": 30,
      "totalRevenue": 420,
      "purchaseCount": 10
    }
  ],
  "bySweet": [
    {
      "sweetId": "507f...",
      "sweetName": "Ladoo",
      "category": "Indian",
      "totalQuantity": 20,
      "totalRevenue": 200,
      "purchaseCount": 8
    }
  ]
}
```

### Custom Date Range Analytics (NEW)

```json
GET /api/analytics/custom?startDate=2025-12-01&endDate=2025-12-13
Authorization: Bearer <token>

Response: Same structure as weekly analytics
```

## New Features

### 1. **Enhanced Security**

- **Email Validation**: RFC 5322 compliant regex
- **Strong Passwords**: Min 8 chars with uppercase, lowercase, number, special character
- Invalid credentials return proper error messages

### 2. **Performance Caching**

- In-memory cache using `node-cache`
- GET routes cached (sweets list: 5min, search: 3min, analytics: 1min)
- Automatic cache invalidation on data mutations
- ~60-70% reduction in database load for read operations

### 3. **Analytics & Reporting**

- Purchase tracking with dedicated `Purchase` model
- Weekly, monthly, and custom date range statistics
- Aggregation by category and individual sweets
- Revenue tracking and purchase trends
- Optimized MongoDB aggregation pipeline with indexes

📖 **See [NEW_FEATURES.md](NEW_FEATURES.md) for detailed documentation**

## Authentication

All protected endpoints need a JWT token in the header:

```
Authorization: Bearer <your-token>
```

**Roles:**

- `user` - Can browse and purchase sweets
- `admin` - Can do everything (create, update, delete, restock)

## Testing

```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

**Test Coverage:**

- Authentication (register, login, validation)
- Sweets CRUD operations
- Search & filtering
- Inventory (purchase, restock)
- Admin permissions
- Edge cases (duplicates, insufficient stock, negative values)

## Troubleshooting

**MongoDB Connection Error**

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

→ Make sure MongoDB is running (`mongod`)

**Tests Failing - Connection Timeout**

```
Connection timeout
```

→ MongoDB Memory Server needs internet on first run to download binaries

**Port Already in Use**

```
Error: listen EADDRINUSE :::5000
```

→ Change `PORT` in `.env` file

## Available Scripts

| Command                 | What it does                |
| ----------------------- | --------------------------- |
| `npm start`             | Production server           |
| `npm run dev`           | Dev server with auto-reload |
| `npm test`              | Run tests                   |
| `npm run test:watch`    | Tests in watch mode         |
| `npm run test:coverage` | Coverage report             |
| `node src/seed.js`      | Seed database               |

## Error Responses

The API returns consistent error formats:

```json
// 400 - Validation error
{"error": "All fields are required"}

// 401 - Unauthorized
{"error": "Invalid or expired token"}

// 403 - Forbidden
{"error": "Admin access required"}

// 404 - Not found
{"error": "Sweet not found"}

// 409 - Conflict
{"error": "name already exists"}
```

## Deployment

### MongoDB Atlas

1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Update `.env`:
   ```env
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/sweet-shop
   ```

### Heroku

```bash
heroku create sweet-shop-api
heroku config:set MONGODB_URI=<atlas-uri>
heroku config:set JWT_SECRET=<secret>
git push heroku main
```

## My AI Usage

I used AI tools to speed up development on this project:

**Tools:**

- GitHub Copilot for code suggestions
- ChatGPT for planning and boilerplate

**What AI helped with:**

- Initial project structure and API design
- Boilerplate code (controllers, middleware, models)
- Test case generation and edge cases
- Documentation templates
- Debugging missing imports and configuration issues
- Suggestions for additional features (search, filtering)
- Minor code improvements and optimizations

**What I did manually:**

- Reviewed and tested all AI-generated code
- Implemented business logic and security
- Fixed bugs and refined error handling
- Verified test assertions
- Made architectural decisions
- Debugged actual runtime errors
- Chose which AI suggestions to implement

The AI tools saved time on repetitive tasks and helped catch some bugs (like missing imports), but everything was manually reviewed. Security implementations (JWT, password hashing) and critical business logic were implemented by me, not blindly copied from AI.

## Author

Piyush Nashikkar  
GitHub: [@Geek-Piyush](https://github.com/Geek-Piyush)

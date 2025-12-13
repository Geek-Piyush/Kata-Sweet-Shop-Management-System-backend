# Sweet Shop Management System - Backend

A RESTful API for managing a sweet shop, built with **Node.js**, **Express**, **MongoDB**, and **JWT authentication**. This project follows **Test-Driven Development (TDD)** principles with comprehensive test coverage.

## 🎯 Features

- ✅ **User Authentication** (Register/Login with JWT)
- ✅ **Role-Based Access Control** (Admin & User roles)
- ✅ **CRUD Operations** for sweets
- ✅ **Inventory Management** (Purchase & Restock)
- ✅ **Search & Filter** sweets by name, category, and price
- ✅ **Comprehensive Test Suite** (37 tests passing)
- ✅ **MongoDB Persistence** with Mongoose ODM
- ✅ **Race Condition Handling** for purchases

---

## 🛠️ Tech Stack

| Technology                | Purpose                |
| ------------------------- | ---------------------- |
| **Node.js**               | Runtime environment    |
| **Express**               | Web framework          |
| **MongoDB**               | Database               |
| **Mongoose**              | ODM for MongoDB        |
| **JWT**                   | Authentication tokens  |
| **bcryptjs**              | Password hashing       |
| **Jest**                  | Testing framework      |
| **Supertest**             | HTTP assertions        |
| **MongoDB Memory Server** | In-memory DB for tests |

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/      # Request handlers
│   │   ├── authController.js
│   │   └── sweetsController.js
│   ├── models/           # Mongoose schemas
│   │   ├── User.js
│   │   └── Sweet.js
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   └── sweets.js
│   ├── middlewares/      # Auth & error handling
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── utils/            # Helper functions
│   │   ├── jwt.js
│   │   └── password.js
│   ├── app.js            # Express app setup
│   ├── server.js         # Server entry point
│   └── seed.js           # Database seeding
├── tests/                # Test suites
│   ├── auth.test.js
│   ├── sweets.test.js
│   └── inventory.test.js
├── .env                  # Environment variables
├── .env.example          # Environment template
├── jest.config.js        # Jest configuration
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+)
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Geek-Piyush/Kata-Sweet-Shop-Management-System-backend.git
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and update:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/sweet-shop
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Seed the database** (optional but recommended)

   ```bash
   node src/seed.js
   ```

5. **Start the server**

   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

6. **Server should be running at** `http://localhost:5000`

---

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Generate Coverage Report

```bash
npm run test:coverage
```

### Test Results

```
Test Suites: 3 passed, 3 total
Tests:       37 passed, 37 total
```

**Coverage:**

- ✅ Authentication (register, login, validation)
- ✅ Sweets CRUD (create, read, update, delete)
- ✅ Search & filtering
- ✅ Inventory (purchase, restock, stock validation)
- ✅ Role-based access control
- ✅ Edge cases (duplicate names, negative values, insufficient stock)

---

## 📡 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

#### **POST** `/auth/register`

Register a new user

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

**Response (201):**

```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### **POST** `/auth/login`

Login existing user

**Request:**

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

**Response (200):**

```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Sweets Endpoints

> 🔒 **All sweets endpoints require authentication**  
> Include header: `Authorization: Bearer <token>`

#### **GET** `/sweets`

Get all sweets (with optional filters)

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `category` - Filter by category
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter

**Example:**

```
GET /api/sweets?category=Indian&minPrice=5&maxPrice=15
```

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Ladoo",
    "category": "Indian",
    "price": 10,
    "quantity": 50,
    "createdAt": "2025-12-13T10:00:00.000Z",
    "updatedAt": "2025-12-13T10:00:00.000Z"
  }
]
```

#### **GET** `/sweets/search`

Search sweets by name or category

**Query Parameters:**

- `q` - Search query (matches name or category)
- `category` - Filter by category
- `minPrice` - Minimum price
- `maxPrice` - Maximum price

**Example:**

```
GET /api/sweets/search?q=chocolate
```

#### **POST** `/sweets` 🔐 Admin Only

Create a new sweet

**Request:**

```json
{
  "name": "Ladoo",
  "category": "Indian",
  "price": 10,
  "quantity": 50
}
```

**Response (201):**

```json
{
  "sweet": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Ladoo",
    "category": "Indian",
    "price": 10,
    "quantity": 50
  }
}
```

#### **PUT** `/sweets/:id` 🔐 Admin Only

Update sweet details

**Request:**

```json
{
  "price": 12,
  "quantity": 60
}
```

#### **DELETE** `/sweets/:id` 🔐 Admin Only

Delete a sweet

**Response (204):** No content

---

### Inventory Endpoints

#### **POST** `/sweets/:id/purchase`

Purchase sweet (decrement quantity)

**Request:**

```json
{
  "quantity": 2
}
```

**Response (200):**

```json
{
  "sweet": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Ladoo",
    "quantity": 48
  }
}
```

**Error (400):** Insufficient stock

```json
{
  "error": "Insufficient stock"
}
```

#### **POST** `/sweets/:id/restock` 🔐 Admin Only

Restock sweet (increment quantity)

**Request:**

```json
{
  "quantity": 10
}
```

---

## 🔐 Authentication

All protected routes require a JWT token in the header:

```
Authorization: Bearer <your-jwt-token>
```

### Roles

- **user** - Can view and purchase sweets
- **admin** - Can create, update, delete, and restock sweets

---

## 🌱 Seed Data

Run the seed script to populate the database with sample data:

```bash
node src/seed.js
```

**Default Credentials:**

- **Admin:** `admin@sweetshop.com` / `admin123`
- **User:** `john@example.com` / `user123`
- **User:** `jane@example.com` / `user123`

**Sample Sweets:**

- Ladoo (Indian, $10, qty: 50)
- Jalebi (Indian, $5, qty: 100)
- Gulab Jamun (Indian, $8, qty: 75)
- Chocolate Truffle (Western, $15, qty: 30)
- And more...

---

## 🤖 My AI Usage

### Tools Used

- **GitHub Copilot** - Code completion and suggestions
- **ChatGPT (GPT-4)** - Architecture planning and documentation

### How AI Was Used

1. **Initial Planning & Architecture**

   - Used ChatGPT to create the comprehensive implementation plan
   - Generated API contract specifications
   - Designed data models and schema structure

2. **Boilerplate Code Generation**

   - AI assisted in creating initial controller structures
   - Generated middleware templates (auth, error handling)
   - Created model schemas with validation rules

3. **Test Suite Development**

   - AI helped draft initial test cases following TDD principles
   - Generated edge case scenarios (duplicate entries, insufficient stock, etc.)
   - Structured test suites with proper setup/teardown

4. **Documentation**
   - AI assisted in creating this comprehensive README
   - Generated API documentation with examples
   - Created inline code comments

### Manual Refinements

✅ All AI-generated code was reviewed and tested manually  
✅ Business logic refined based on requirements  
✅ Error handling improved for production readiness  
✅ Test assertions verified for accuracy  
✅ Security measures implemented (password hashing, JWT validation)

### Benefits & Limitations

**Benefits:**

- ⚡ Faster scaffolding and boilerplate creation
- 📚 Comprehensive test coverage suggestions
- 🎯 Best practices in code structure

**Limitations:**

- 🔍 Required manual verification of logic
- 🛡️ Security implementations needed human oversight
- 🧪 Test edge cases required domain knowledge

**Reflection:**  
AI tools significantly accelerated development but required careful review. The combination of AI-assisted generation and manual refinement created a robust, production-ready codebase.

---

## 📊 Test Coverage

Run coverage report:

```bash
npm run test:coverage
```

Expected coverage:

- Controllers: ~95%
- Models: 100%
- Middlewares: ~90%
- Utils: 100%

---

## 🔧 Development

### Available Scripts

| Command                 | Description                            |
| ----------------------- | -------------------------------------- |
| `npm start`             | Start production server                |
| `npm run dev`           | Start development server (auto-reload) |
| `npm test`              | Run all tests                          |
| `npm run test:watch`    | Run tests in watch mode                |
| `npm run test:coverage` | Generate coverage report               |
| `node src/seed.js`      | Seed database with sample data         |

---

## 🐛 Error Handling

The API uses consistent error responses:

**Validation Error (400):**

```json
{
  "error": "All fields are required"
}
```

**Unauthorized (401):**

```json
{
  "error": "Invalid or expired token"
}
```

**Forbidden (403):**

```json
{
  "error": "Admin access required"
}
```

**Not Found (404):**

```json
{
  "error": "Sweet not found"
}
```

**Conflict (409):**

```json
{
  "error": "name already exists"
}
```

---

## 🚀 Deployment

### Using MongoDB Atlas

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Update `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sweet-shop
   ```

### Deploy to Heroku

```bash
heroku create sweet-shop-api
heroku config:set MONGODB_URI=<your-atlas-uri>
heroku config:set JWT_SECRET=<your-secret>
git push heroku main
```

---

## 📝 License

ISC

---

## 👤 Author

**Piyush Nashikkar**

- GitHub: [@Geek-Piyush](https://github.com/Geek-Piyush)
- Repository: [Kata-Sweet-Shop-Management-System-backend](https://github.com/Geek-Piyush/Kata-Sweet-Shop-Management-System-backend)

---

## 🙏 Acknowledgments

- Built as a TDD Kata project
- AI assistance provided by GitHub Copilot and ChatGPT
- MongoDB Memory Server for seamless testing

---

**Happy Coding! 🍬**

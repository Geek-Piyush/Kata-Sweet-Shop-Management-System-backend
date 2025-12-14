# Incu-bite - Sweet Shop Management System

A full-stack web application for managing a sweet shop with inventory tracking, user authentication, analytics, and a beautiful UI. Built for real-world use with production-ready features.

![Incu-bite](./client/public/Logo.png)

**Tagline:** _Love at First Bite_

---

## What is This?

Incu-bite is a complete sweet shop management system where customers can browse handcrafted sweets, place orders, and track their purchases. Admins get powerful tools to manage inventory, upload product images, and view detailed analytics about sales trends.

I built this as a learning project to practice full-stack development, but it's production-ready with proper authentication, caching, image uploads, and responsive design.

## Live Demo

- **Frontend:** _[Deployment URL - Coming Soon]_
- **Backend API:** _[Deployment URL - Coming Soon]_

---

## Key Features

### For Customers

- Browse sweets by category (Indian, Western, Bengali, South Indian)
- Search and filter by name, price range
- Beautiful product cards with images and stock indicators
- Secure user registration and login
- Profile management with photo upload
- Real-time stock availability

### For Admins

- Add, edit, and delete sweets
- Upload and manage product images
- Restock inventory
- View detailed analytics:
  - Weekly and monthly sales reports
  - Revenue by category and product
  - Best-selling items
  - Custom date range analysis

### Technical Highlights

- **JWT Authentication** with strong password requirements
- **Image Processing** (auto-resize, compress, optimize)
- **Performance Caching** (60-70% reduction in database load)
- **MongoDB Aggregation** for fast analytics
- **Responsive Design** (mobile, tablet, desktop)
- **Comprehensive Testing** (37 backend + 18 frontend tests)
- **Modern UI** with gradient animations and smooth transitions

---

## Tech Stack

### Frontend

- React 19.2.3
- React Router DOM 7.10.1
- Axios for API calls
- Recharts for analytics visualization
- Custom CSS (no UI library - hand-crafted design)

### Backend

- Node.js + Express 5.2.1
- MongoDB + Mongoose 9.0.1
- JWT for authentication
- bcryptjs for password hashing
- Multer + Sharp for image uploads
- node-cache for in-memory caching
- Jest + Supertest for testing

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Geek-Piyush/Kata-Sweet-Shop-Management-System-backend.git
   cd Kata-Sweet-Shop-Management-System-backend
   ```

2. **Setup Backend**

   ```bash
   cd server
   npm install

   # Create .env file
   cp .env.example .env

   # Edit .env and update these values:
   # PORT=5000
   # MONGODB_URI=mongodb://localhost:27017/sweet-shop
   # JWT_SECRET=your-secret-key-here
   # NODE_ENV=development

   # Optional: Seed sample data
   node src/seed.js

   # Start the server
   npm run dev
   ```

3. **Setup Frontend**

   ```bash
   cd ../client
   npm install

   # Create .env file
   echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

   # Start the app
   npm start
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

### Default Login Credentials

After seeding the database:

**Admin Account:**

- Email: `admin@sweetshop.com`
- Password: `Admin@123`

**Test User:**

- Email: `john@example.com`
- Password: `User@1234`

---

## Project Structure

```
Kata-Sweet-Shop-Management-System-backend/
├── server/                    # Backend API
│   ├── src/
│   │   ├── controllers/      # Business logic
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API endpoints
│   │   ├── middlewares/      # Auth, caching, error handling
│   │   ├── utils/            # Helper functions
│   │   ├── app.js            # Express setup
│   │   ├── server.js         # Entry point
│   │   └── seed.js           # Sample data
│   ├── uploads/              # User and product images
│   ├── tests/                # Backend tests
│   ├── package.json
│   └── README.md
│
├── client/                    # Frontend React App
│   ├── public/
│   │   ├── Logo.png
│   │   └── Sweet Stock/      # Hero section images
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── context/          # React Context (Auth)
│   │   ├── services/         # API service layer
│   │   ├── utils/            # Helper functions
│   │   ├── App.js
│   │   └── index.js
│   ├── tests/                # Frontend tests
│   ├── package.json
│   └── README.md
│
└── README.md                  # This file
```

---

## API Documentation

Base URL: `http://localhost:5000/api`

### Authentication

| Method | Endpoint              | Description            | Auth Required |
| ------ | --------------------- | ---------------------- | ------------- |
| POST   | `/auth/register`      | Create new account     | No            |
| POST   | `/auth/login`         | Login and get JWT      | No            |
| GET    | `/auth/profile`       | Get user info          | Yes           |
| POST   | `/auth/profile/photo` | Upload profile picture | Yes           |

### Sweets Management

| Method | Endpoint                | Description                    | Auth Required |
| ------ | ----------------------- | ------------------------------ | ------------- |
| GET    | `/sweets`               | List all sweets (with filters) | Yes           |
| GET    | `/sweets/search?q=term` | Search by name                 | Yes           |
| POST   | `/sweets`               | Create new sweet               | Admin         |
| PUT    | `/sweets/:id`           | Update sweet                   | Admin         |
| DELETE | `/sweets/:id`           | Delete sweet                   | Admin         |
| POST   | `/sweets/:id/photo`     | Upload product image           | Admin         |
| POST   | `/sweets/:id/purchase`  | Purchase (decrease stock)      | Yes           |
| POST   | `/sweets/:id/restock`   | Add stock                      | Admin         |

### Analytics

| Method | Endpoint                                      | Description        | Auth Required | Cached |
| ------ | --------------------------------------------- | ------------------ | ------------- | ------ |
| GET    | `/analytics/weekly`                           | Last 7 days stats  | Yes           | 60s    |
| GET    | `/analytics/monthly`                          | Last 30 days stats | Yes           | 60s    |
| GET    | `/analytics/custom?startDate=...&endDate=...` | Custom range       | Yes           | 60s    |

**Example Response:**

```json
{
  "totalRevenue": 5420,
  "totalOrders": 45,
  "totalItemsSold": 234,
  "revenueTrend": [{ "_id": "2025-12-10", "revenue": 450, "count": 12 }],
  "revenueByCategory": [{ "_id": "Indian", "revenue": 2100 }],
  "bestSellers": [
    { "_id": "...", "name": "Gulab Jamun", "totalSold": 65, "revenue": 975 }
  ]
}
```

---

## Features in Detail

### 1. Authentication & Security

**Strong Password Requirements:**

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (!@#$%^&\*)

**Email Validation:**

- RFC 5322 compliant
- Proper format checking

**JWT Tokens:**

- 24-hour expiration
- HTTP-only recommended for production

### 2. Image Upload System

**Profile Photos:**

- Max size: 5MB
- Auto-resized to 300x300px
- Quality: 90%

**Product Images:**

- Max size: 5MB
- Auto-resized to 512x512px
- Quality: 85%

**Supported Formats:**

- JPEG, JPG, PNG, GIF, WebP

### 3. Performance Caching

**Cached Routes:**

- Sweets list: 5 minutes
- Search results: 3 minutes
- Analytics: 1 minute

**Cache Invalidation:**

- Automatic on create/update/delete
- Manual refresh available on analytics page

**Impact:**

- 60-70% reduction in database queries
- Faster response times for repeat requests

### 4. Analytics Dashboard

**Metrics Tracked:**

- Total revenue
- Order count
- Items sold
- Revenue by category
- Best-selling products
- Daily trends

**Time Periods:**

- Weekly (last 7 days)
- Monthly (last 30 days)
- Custom date range

---

## Design Philosophy

I wanted Incu-bite to feel warm and inviting, like walking into a traditional sweet shop but with modern convenience. The color palette uses earthy tones inspired by ingredients:

- **Deep Pistachio Green (#2F4F3A)** - Primary
- **Caramel Gold (#DF9B43)** - Accents
- **Warm Cream (#FFF6E8)** - Background
- **Cocoa Brown (#6B3F1D)** - Borders

The UI features:

- Smooth gradient overlays
- Floating navbar with glassmorphism
- Modern card designs with hover effects
- Responsive grid layouts
- Auto-rotating hero carousel
- Clean, emoji-free professional design

---

## Testing

### Backend Tests (37 passing)

```bash
cd server
npm test
```

Tests cover:

- Authentication (register, login, password validation)
- Sweets CRUD operations
- Inventory management
- Admin permissions
- Edge cases and error handling

### Frontend Tests (18 passing)

```bash
cd client
npm test
```

Tests cover:

- Component rendering
- User interactions
- API integration
- Authentication flow

---

## Deployment

_Instructions will be added after deployment to Render (backend) and Vercel (frontend)._

---

## Future Considerations

### Email Verification System

I'm planning to add email verification using SendGrid or similar service. This will include:

- Verification emails on registration
- Email confirmation before account activation
- Password reset via email
- Order confirmation emails

This wasn't included in the current version to keep setup simple, but it's essential for production use.

### Other Planned Features

- Order history for customers
- Shopping cart functionality
- Payment gateway integration
- Admin dashboard for real-time monitoring
- Export analytics to PDF/Excel
- Multi-language support

---

## What I Learned

Building Incu-bite taught me a lot about full-stack development:

**Backend:**

- Proper REST API design
- JWT authentication and security
- MongoDB aggregation pipelines
- Image processing with Sharp
- Caching strategies
- Writing comprehensive tests
- Error handling and validation

**Frontend:**

- React context for state management
- Component architecture
- Responsive CSS design
- Image optimization
- User experience patterns
- Testing React components

**DevOps:**

- Environment configuration
- Git workflow
- Database seeding
- Production readiness

---

## Known Issues

1. **Image uploads on Windows** - Path separators need adjustment for non-Windows systems
2. **Cache clearing** - Manual refresh needed for analytics after recent purchases
3. **Mobile filters** - Slide-in animation could be smoother

These are minor issues that don't affect core functionality but will be addressed in future updates.

---

## Contributing

This is a personal learning project, but I welcome suggestions and feedback! Feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## Acknowledgments

**Tools & Libraries:**

- MongoDB for database
- Express for backend framework
- React for frontend
- Sharp for image processing
- Recharts for analytics charts

**AI Assistance:**
I used GitHub Copilot and Claude Sonnet 4.5 for:

- Boilerplate code and project setup
- Test case generation
- Documentation templates
- Code suggestions and debugging
- Architecture planning

All code was reviewed, tested, and refined by me. Critical features like authentication, business logic, and security were implemented manually with careful consideration.

---

## Author

**Piyush Nashikkar**

- GitHub: [@Geek-Piyush](https://github.com/Geek-Piyush)
- Project: [Kata-Sweet-Shop-Management-System](https://github.com/Geek-Piyush/Kata-Sweet-Shop-Management-System-backend)

---

## License

ISC License - See server/package.json for details

---

**Built with ❤️ and lots of ☕**

_Incu-bite - Love at First Bite_ 🍬

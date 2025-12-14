# Incu-bite Frontend

The customer-facing React application for the Incu-bite Sweet Shop Management System. A modern, responsive UI for browsing sweets, managing your profile, and viewing purchase analytics.

![Incu-bite Logo](./public/Logo.png)

---

## What's Inside

This is the frontend portion of Incu-bite, built with React 19 and designed to be fast, intuitive, and visually appealing. It connects to the Express backend API to deliver a seamless sweet shop experience.

### Main Features

**For All Users:**

- 🏠 **Hero Section** - Beautiful carousel with 6 rotating images, auto-play every 4 seconds
- 🍬 **Sweet Catalog** - Grid layout showing all available sweets with images and details
- 🔍 **Search & Filter** - Find sweets by name, category, or price range
- 📱 **Fully Responsive** - Works perfectly on mobile, tablet, and desktop
- 👤 **User Profile** - Manage your account, upload profile photo

**For Admins:**

- ➕ **Add/Edit/Delete Sweets** - Complete CRUD operations
- 📸 **Image Upload** - Upload product photos (auto-resized to 512x512px)
- 📊 **Analytics Dashboard** - Visual charts showing sales trends, revenue, best sellers
- 📦 **Inventory Management** - Restock products, track quantities

---

## Tech Stack

- **React** 19.2.3 - UI framework
- **React Router DOM** 7.10.1 - Client-side routing
- **Axios** 1.13.2 - API calls to backend
- **Recharts** 3.5.1 - Analytics charts (bar, line, pie)
- **Custom CSS** - No UI library, completely hand-coded design

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Backend server running (see server/README.md)

### Installation

1. **Navigate to client directory**

   ```bash
   cd client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the client directory:

   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

   For production, update the URL to your deployed backend:

   ```env
   REACT_APP_API_URL=https://your-backend.onrender.com/api
   ```

4. **Start the development server**

   ```bash
   npm start
   ```

5. **Open your browser**
   - Navigate to http://localhost:3000
   - You should see the Incu-bite homepage with the hero carousel

---

## Available Scripts

### `npm start`

Runs the app in development mode on http://localhost:3000.

The page auto-reloads when you make changes. You'll also see any lint errors in the console.

**Use this for:** Local development and testing

### `npm test`

Launches the test runner in interactive watch mode.

Runs 18 frontend tests covering:

- Component rendering
- User authentication flow
- API integration
- Form validation
- Routing

**Use this for:** Running tests while developing

### `npm run build`

Builds the app for production to the `build/` folder.

It bundles React in production mode and optimizes the build for best performance. The build is minified and filenames include hashes.

**Use this for:** Creating production-ready build before deployment

### `npm run eject`

**Note: This is a one-way operation. Once you eject, you can't go back!**

Ejects from Create React App, giving you full control over webpack config, Babel, ESLint, etc.

**You probably don't need this.** The default configuration works well for most projects.

---

## Project Structure

```
client/
├── public/
│   ├── Logo.png                    # Incu-bite logo
│   ├── Sweet Stock/                # Hero carousel images
│   │   ├── 1.jpg
│   │   ├── 2.jpg
│   │   ├── 3.jpg
│   │   ├── 4.jpg
│   │   ├── 5.jpg
│   │   └── 6.jpg
│   ├── favicon.ico
│   └── index.html
│
├── src/
│   ├── components/                 # Reusable UI components
│   │   ├── Navbar.js              # Navigation with logo and links
│   │   ├── Footer.js              # Footer with copyright
│   │   ├── SweetCard.js           # Product card component
│   │   ├── SearchBar.js           # Search input
│   │   ├── FilterPanel.js         # Category and price filters
│   │   └── ProtectedRoute.js      # Auth guard for routes
│   │
│   ├── pages/                      # Full page components
│   │   ├── Home.js                # Landing page with hero
│   │   ├── Dashboard.js           # Main sweet catalog
│   │   ├── Login.js               # Login form
│   │   ├── Register.js            # Registration form
│   │   ├── Profile.js             # User profile page
│   │   ├── AdminDashboard.js      # Admin CRUD interface
│   │   └── Analytics.js           # Charts and reports
│   │
│   ├── context/
│   │   └── AuthContext.js         # User authentication state
│   │
│   ├── services/
│   │   └── api.js                 # Axios configuration + API calls
│   │
│   ├── utils/
│   │   └── helpers.js             # Utility functions
│   │
│   ├── styles/                     # CSS files
│   │   ├── App.css                # Global styles
│   │   ├── Home.css               # Hero section styles
│   │   ├── Dashboard.css          # Catalog grid styles
│   │   ├── Profile.css            # Profile page styles
│   │   └── Analytics.css          # Chart styles
│   │
│   ├── App.js                      # Main app component with routes
│   ├── index.js                    # Entry point
│   └── setupTests.js               # Jest configuration
│
├── tests/
│   ├── sweets.test.js             # Sweet catalog tests
│   ├── auth.test.js               # Authentication tests
│   └── inventory.test.js          # Inventory management tests
│
├── package.json
├── .env                            # Environment variables
└── README.md                       # This file
```

---

## Key Components

### Home.js - Hero Section

The landing page features a stunning carousel with 6 high-quality sweet images:

- **Auto-rotate:** Changes every 4 seconds
- **Manual navigation:** Previous/Next buttons
- **Responsive:** Shows 3 images on desktop, 1 on mobile
- **Logo overlay:** Animated Incu-bite logo with glow effect
- **Tagline:** "Love at First Bite"

### Dashboard.js - Sweet Catalog

The main browsing interface:

- **Grid Layout:** 4 cards per row on laptop, 2 on mobile
- **Card Design:** 3:3 ratio for image, 3:1 for details
- **Stock Indicators:** Green badge for in-stock, grey card for out-of-stock
- **Search Bar:** Real-time search by sweet name
- **Filters:** Category dropdown and price range slider
- **Mobile-Friendly:** Slide-in filter panel on smaller screens

### Profile.js - User Account

Modern profile page design:

- **Gradient Banner:** Eye-catching header with brand colors
- **Floating Avatar:** Profile photo with upload functionality
- **Detail Cards:** Clean display of user information
- **Edit Mode:** Update name, email (with validation)
- **Responsive:** Stacks beautifully on mobile

### Analytics.js - Admin Dashboard

Visual data representation:

- **Charts:** Revenue trend (line), category breakdown (bar), best sellers (pie)
- **Time Periods:** Toggle between weekly, monthly, custom range
- **Auto-Refresh:** Updates every 30 seconds
- **Manual Refresh:** Button to force immediate update
- **Recharts Integration:** Beautiful, interactive charts

---

## Styling Approach

I designed Incu-bite with a warm, welcoming aesthetic inspired by traditional sweet shops. Here's the color system:

### Color Palette

```css
--primary-color: #2f4f3a; /* Deep Pistachio Green */
--secondary-color: #df9b43; /* Caramel Gold */
--background-color: #fff6e8; /* Warm Cream */
--border-color: #6b3f1d; /* Cocoa Brown */
--text-dark: #2f4f3a;
--text-light: #fff6e8;
```

### Design Patterns

- **Glassmorphism:** Used in navbar with blur and transparency
- **Gradient Overlays:** Smooth transitions on hero images
- **Card Shadows:** Subtle depth for product cards
- **Hover Effects:** Scale and shadow animations
- **Responsive Breakpoints:**
  - Desktop: 1024px+
  - Tablet: 768px - 1024px
  - Mobile: < 768px

### Typography

- Primary font: System font stack for optimal performance
- Headings: Bold weight
- Body text: Regular weight
- Small text: 0.9rem for captions

---

## API Integration

The frontend communicates with the backend using Axios. All API calls are centralized in `src/services/api.js`.

### Base Configuration

```javascript
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
```

### Authentication Flow

1. User logs in via `/auth/login`
2. Backend returns JWT token
3. Token stored in localStorage
4. Axios interceptor adds token to all requests
5. Protected routes check for valid token

### Image Uploads

Profile and product images use `FormData`:

```javascript
const formData = new FormData();
formData.append("image", file);

await api.post("/auth/profile/photo", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});
```

---

## Responsive Design

Incu-bite adapts seamlessly across devices:

### Mobile (< 768px)

- Single-column layout
- Hamburger menu navigation
- 1 image in hero carousel
- 2 sweets per row
- Full-width search bar
- Slide-in filter panel

### Tablet (768px - 1024px)

- Two-column layouts
- Expanded navigation
- 2 images in hero carousel
- 3 sweets per row
- Inline filters

### Desktop (1024px+)

- Multi-column grids
- Full navigation bar
- 3 images in hero carousel
- 4 sweets per row
- Fixed sidebar filters

---

## Building for Production

### 1. Update Environment Variables

Edit `.env` to point to your production backend:

```env
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

### 2. Build the Application

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### 3. Test the Build Locally

```bash
npx serve -s build
```

Open http://localhost:3000 to verify everything works.

### 4. Deploy

The build folder is ready for deployment to any static hosting service.

---

## Deployment (Vercel)

### ✅ Successfully Deployed!

**Live URLs:**

- **Primary:** https://incubite.piyushnashikkar.dev
- **Vercel:** https://kata-sweet-shop-management-system-b.vercel.app

**Environment Variable Set:**

```env
REACT_APP_API_URL=https://kata-sweet-shop-management-system-backend.onrender.com/api
```

**Deployment Configuration:**

- Framework: Create React App
- Build Command: `npm run build`
- Output Directory: `build`
- Root Directory: `client`
- Auto-deploy: Enabled (on push to main)

**Custom Domain Setup:**

1. Added `incubite.piyushnashikkar.dev` in Vercel
2. Updated DNS records with CNAME pointing to Vercel
3. SSL automatically provisioned by Vercel

**Why Vercel?**

- Zero configuration needed
- Automatic HTTPS
- Global CDN
- Git integration
- Environment variable support
- Edge caching for optimal performance

---

## Testing

### Running Tests

```bash
npm test
```

### Test Coverage

- **Auth Tests:** Login, registration, logout, protected routes
- **Sweet Tests:** Fetching sweets, search, filter, add to cart
- **Inventory Tests:** Stock updates, purchase flow
- **Component Tests:** Rendering, props, user interactions

### Writing New Tests

Tests use React Testing Library and Jest:

```javascript
import { render, screen } from "@testing-library/react";
import SweetCard from "./SweetCard";

test("renders sweet name", () => {
  render(<SweetCard name="Gulab Jamun" price={15} />);
  expect(screen.getByText("Gulab Jamun")).toBeInTheDocument();
});
```

---

## Common Issues

### 1. **API Connection Failed**

**Error:** `Network Error` or `ERR_CONNECTION_REFUSED`

**Solution:**

- Check if backend is running on port 5000
- Verify `REACT_APP_API_URL` in `.env`
- Check for CORS issues in backend

### 2. **Images Not Loading**

**Error:** 404 for images in `/uploads/`

**Solution:**

- Ensure backend has `uploads/` folder
- Check file paths in database
- Verify backend serves static files

### 3. **Login Token Expired**

**Error:** 401 Unauthorized

**Solution:**

- Tokens expire after 24 hours
- Log out and log back in
- Check JWT_SECRET matches backend

---

## Performance Optimization

### Implemented

✅ Image lazy loading  
✅ Code splitting with React.lazy()  
✅ Debounced search input  
✅ Cached API responses  
✅ Optimized images (WebP, compressed)  
✅ CSS minification in production

### Future Improvements

- Implement service workers for offline support
- Add skeleton loading screens
- Use React.memo for heavy components
- Implement virtual scrolling for large lists

---

## Browser Support

Incu-bite works on:

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ⚠️ Internet Explorer (not supported)

---

## Contributing

Found a bug or have a feature idea? Contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## Changelog

### v1.0.0 (Current)

- ✨ Initial release
- 🎨 Hero carousel with 6 images
- 🍬 Sweet catalog with search and filters
- 👤 User authentication and profiles
- 📊 Admin analytics dashboard
- 📱 Fully responsive design
- ✅ 18 passing tests

---

## Acknowledgments

**Libraries & Tools:**

- Create React App for project scaffolding
- Recharts for beautiful charts
- Axios for clean API calls
- React Router for seamless navigation

**AI Assistance:**
Used GitHub Copilot and Claude Sonnet 4.5 for:

- Component boilerplate
- CSS styling suggestions
- Test case generation
- Documentation

All features were designed, reviewed, and refined by me.

---

## Author

**Piyush Nashikkar**

- GitHub: [@Geek-Piyush](https://github.com/Geek-Piyush)

---

## License

This project is part of the Incu-bite Sweet Shop Management System.

---

**Happy Coding! 🍬**

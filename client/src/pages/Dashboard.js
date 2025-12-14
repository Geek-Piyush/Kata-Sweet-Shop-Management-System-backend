import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SweetCard from "../components/SweetCard";
import sweetsService from "../services/sweets.service";
import "./Dashboard.css";

const Dashboard = () => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchName, setSearchName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const categories = ["Indian", "Western", "Bengali", "South Indian"];
  const heroImages = [1, 2, 3, 4, 5, 6];

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchSweets = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const filters = {};
      if (selectedCategory) filters.category = selectedCategory;
      if (minPrice) filters.minPrice = minPrice;
      if (maxPrice) filters.maxPrice = maxPrice;

      const data = await sweetsService.getAllSweets(filters);
      setSweets(data);
    } catch (err) {
      setError("Failed to load sweets. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, minPrice, maxPrice]);

  useEffect(() => {
    fetchSweets();
  }, [fetchSweets]);

  const handleSearch = async () => {
    if (!searchName.trim()) {
      fetchSweets();
      return;
    }

    setLoading(true);
    setError("");
    try {
      const searchParams = { name: searchName };
      if (selectedCategory) searchParams.category = selectedCategory;

      const data = await sweetsService.searchSweets(searchParams);
      setSweets(data);
    } catch (err) {
      setError("Search failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = () => {
    fetchSweets();
  };

  const handleReset = () => {
    setSearchName("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    fetchSweets();
  };

  return (
    <div className="dashboard">
      <Navbar />

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-carousel">
          {heroImages.map((img, index) => {
            const isActive =
              index === currentSlide ||
              index === (currentSlide + 1) % heroImages.length ||
              index === (currentSlide + 2) % heroImages.length;
            const position =
              index === currentSlide
                ? "center"
                : index === (currentSlide + 1) % heroImages.length
                ? "right"
                : index === (currentSlide + 2) % heroImages.length
                ? "left"
                : "";

            return (
              <div
                key={img}
                className={`hero-slide ${isActive ? "active" : ""} ${position}`}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/Sweet Stock/${img}.jpg`}
                  alt={`Sweet ${img}`}
                  className="hero-image"
                />
                <div className="hero-overlay"></div>
              </div>
            );
          })}
        </div>

        <div className="hero-content">
          <div className="hero-text">
            <img
              src={`${process.env.PUBLIC_URL}/Logo.png`}
              alt="Incu-bite Logo"
              className="hero-logo"
            />
            <p className="hero-tagline">Love at First Bite</p>
            <div className="hero-divider"></div>
            <p className="hero-subtitle">
              Handcrafted delicacies that melt in your mouth
            </p>
            <button
              className="hero-cta"
              onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
            >
              Explore Collection
            </button>
          </div>
        </div>

        <div className="hero-indicators">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="dashboard-container">
        {/* Search Bar - Always visible at top */}
        <div className="search-bar-top">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search sweets..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button onClick={handleSearch} className="btn btn-search">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </div>
          <button
            className="filter-toggle-btn-inline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="4" y1="21" x2="4" y2="14"></line>
              <line x1="4" y1="10" x2="4" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12" y2="3"></line>
              <line x1="20" y1="21" x2="20" y2="16"></line>
              <line x1="20" y1="12" x2="20" y2="3"></line>
              <line x1="1" y1="14" x2="7" y2="14"></line>
              <line x1="9" y1="8" x2="15" y2="8"></line>
              <line x1="17" y1="16" x2="23" y2="16"></line>
            </svg>
            Filters
          </button>
        </div>

        <div className="dashboard-content">
          <div className="sweets-section">
            {error && <div className="error-message">{error}</div>}

            {loading ? (
              <div className="loading">Loading sweets...</div>
            ) : sweets.length === 0 ? (
              <div className="no-results">No sweets found</div>
            ) : (
              <div className="sweets-grid">
                {sweets.map((sweet) => (
                  <SweetCard key={sweet._id} sweet={sweet} />
                ))}
              </div>
            )}
          </div>

          <div className={`filters-sidebar ${showFilters ? "show" : ""}`}>
            <div className="filters">
              <h3>Filters</h3>

              <div className="filter-group">
                <label>Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setTimeout(handleFilterChange, 100);
                  }}
                  className="filter-select"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Price Range</label>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  onBlur={handleFilterChange}
                  className="filter-input"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  onBlur={handleFilterChange}
                  className="filter-input"
                />
              </div>

              <button onClick={handleReset} className="btn btn-reset">
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;

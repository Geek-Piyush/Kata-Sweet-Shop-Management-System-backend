import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
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

  const categories = ["Indian", "Western", "Bengali", "South Indian"];

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
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
  };

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

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Sweet Shop</h1>
          <p>Browse our delicious collection of sweets</p>
        </div>

        <div className="filters-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button onClick={handleSearch} className="btn btn-search">
              Search
            </button>
          </div>

          <div className="filters">
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

            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              onBlur={handleFilterChange}
              className="filter-input"
            />

            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              onBlur={handleFilterChange}
              className="filter-input"
            />

            <button onClick={handleReset} className="btn btn-reset">
              Reset
            </button>
          </div>
        </div>

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
    </div>
  );
};

export default Dashboard;

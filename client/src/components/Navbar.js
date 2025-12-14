import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={isAdmin() ? "/admin" : "/dashboard"} className="navbar-logo">
          <img src="/Logo.png" alt="Incu-bite" className="navbar-logo-img" />
        </Link>

        <div className="navbar-menu">
          {!isAdmin() && (
            <>
              <Link to="/dashboard" className="navbar-link">
                Home
              </Link>
              <Link to="/cart" className="navbar-link cart-link">
                Cart
                {getCartCount() > 0 && (
                  <span className="cart-badge">{getCartCount()}</span>
                )}
              </Link>
            </>
          )}

          {isAdmin() && (
            <>
              <Link to="/admin" className="navbar-link">
                Admin Panel
              </Link>
              <Link to="/analytics" className="navbar-link">
                Analytics
              </Link>
            </>
          )}

          <Link to="/profile" className="navbar-link">
            Profile
          </Link>

          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

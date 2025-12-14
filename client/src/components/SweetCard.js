import React from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import config from "../config";
import "./SweetCard.css";

const SweetCard = ({ sweet }) => {
  const { isAdmin } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(sweet, 1);
    alert(`${sweet.name} added to cart!`);
  };

  const isOutOfStock = sweet.quantity === 0;
  const isLowStock = sweet.quantity > 0 && sweet.quantity <= 5;
  const imageUrl = sweet.photo
    ? `${config.API_URL.replace("/api", "")}${sweet.photo}`
    : "https://via.placeholder.com/300x300?text=No+Image";

  return (
    <div className={`sweet-card ${isOutOfStock ? "out-of-stock" : ""}`}>
      <div className="sweet-image-wrapper">
        <div className="sweet-image-container">
          <img
            src={imageUrl}
            alt={sweet.name}
            className="sweet-image"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x300?text=No+Image";
            }}
          />
          <div className="image-overlay"></div>
        </div>

        {isOutOfStock && <div className="stock-badge out">Out of Stock</div>}

        {isLowStock && !isOutOfStock && (
          <div className="stock-badge low">Only {sweet.quantity} left</div>
        )}
      </div>

      <div className="sweet-content">
        <div className="sweet-header">
          <span className="sweet-category">{sweet.category}</span>
          <div className="sweet-rating">
            <span className="rating-text">4.5</span>
          </div>
        </div>

        <h3 className="sweet-name">{sweet.name}</h3>

        <div className="sweet-footer">
          <div className="price-section">
            <span className="price-label">Price</span>
            <span className="sweet-price">₹{sweet.price}</span>
          </div>

          {!isAdmin() && (
            <button
              className={`btn-cart ${isOutOfStock ? "disabled" : ""}`}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? (
                <span className="btn-text">Unavailable</span>
              ) : (
                <span className="btn-text">Add to Cart</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SweetCard;

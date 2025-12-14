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
  const imageUrl = sweet.photo
    ? `${config.API_URL.replace("/api", "")}${sweet.photo}`
    : "https://via.placeholder.com/300x300?text=No+Image";

  return (
    <div className="sweet-card">
      <div className="sweet-image-container">
        <img
          src={imageUrl}
          alt={sweet.name}
          className="sweet-image"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
          }}
        />
        {isOutOfStock && <div className="out-of-stock-badge">Out of Stock</div>}
      </div>

      <div className="sweet-details">
        <h3 className="sweet-name">{sweet.name}</h3>
        <p className="sweet-category">{sweet.category}</p>

        <div className="sweet-info">
          <span className="sweet-price">₹{sweet.price}</span>
          <span className="sweet-stock">Stock: {sweet.quantity}</span>
        </div>

        {!isAdmin() && (
          <button
            className="btn btn-add-cart"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
        )}
      </div>
    </div>
  );
};

export default SweetCard;

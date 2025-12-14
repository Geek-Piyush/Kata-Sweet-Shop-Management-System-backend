import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import config from "../config";
import "./Cart.css";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } =
    useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (sweetId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(sweetId);
    } else {
      updateQuantity(sweetId, newQuantity);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    navigate("/dashboard");
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <Navbar />
        <div className="cart-container">
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Add some delicious sweets to your cart!</p>
            <button
              onClick={handleContinueShopping}
              className="btn btn-primary"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Navbar />
      <div className="cart-container">
        <h1>Shopping Cart</h1>

        <div className="cart-content">
          <div className="cart-items">
            {cart.map((item) => {
              const imageUrl = item.photo
                ? `${config.API_URL.replace("/api", "")}${item.photo}`
                : "https://via.placeholder.com/150x150?text=No+Image";

              return (
                <div key={item._id} className="cart-item">
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="cart-item-image"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/150x150?text=No+Image";
                    }}
                  />

                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p className="cart-item-category">{item.category}</p>
                    <p className="cart-item-price">₹{item.price}</p>
                  </div>

                  <div className="cart-item-quantity">
                    <button
                      onClick={() =>
                        handleQuantityChange(item._id, item.quantity - 1)
                      }
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item._id, item.quantity + 1)
                      }
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item-total">
                    <p>₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="btn-remove"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{getCartTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (0%)</span>
              <span>₹0.00</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{getCartTotal().toFixed(2)}</span>
            </div>

            <button onClick={handleCheckout} className="btn btn-checkout">
              Proceed to Checkout
            </button>

            <button
              onClick={handleContinueShopping}
              className="btn btn-secondary"
            >
              Continue Shopping
            </button>

            <button onClick={clearCart} className="btn btn-clear">
              Clear Cart
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import sweetsService from "../services/sweets.service";
import "./Checkout.css";

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const handleInputChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Process each cart item
      for (const item of cart) {
        await sweetsService.purchaseSweet(item._id, item.quantity);
      }

      // Clear cart after successful purchase
      clearCart();

      // Show success message
      alert("Payment successful! Your order has been placed.");

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Purchase failed. Please check stock availability and try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <Navbar />
        <div className="checkout-container">
          <div className="empty-checkout">
            <h2>Your cart is empty</h2>
            <p>Add items to your cart before checkout</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="btn btn-primary"
            >
              Go to Shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Navbar />
      <div className="checkout-container">
        <h1>Checkout</h1>

        <div className="checkout-content">
          <div className="checkout-form-section">
            <h2>Payment Information</h2>
            <p className="fake-payment-notice">
              This is a fake payment form for demonstration purposes only.
            </p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-group">
                <label htmlFor="cardName">Cardholder Name</label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  value={paymentData.cardName}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  placeholder="John Doe"
                />
              </div>

              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={paymentData.cardNumber}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryDate">Expiry Date</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={paymentData.expiryDate}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    placeholder="MM/YY"
                    maxLength="5"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={paymentData.cvv}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    placeholder="123"
                    maxLength="3"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-pay" disabled={loading}>
                {loading
                  ? "Processing..."
                  : `Pay ₹${getCartTotal().toFixed(2)}`}
              </button>
            </form>
          </div>

          <div className="order-summary-section">
            <h2>Order Summary</h2>

            <div className="order-items">
              {cart.map((item) => (
                <div key={item._id} className="order-item">
                  <div className="order-item-info">
                    <p className="order-item-name">{item.name}</p>
                    <p className="order-item-qty">Qty: {item.quantity}</p>
                  </div>
                  <p className="order-item-price">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>₹{getCartTotal().toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Tax</span>
                <span>₹0.00</span>
              </div>
              <div className="total-row total">
                <span>Total</span>
                <span>₹{getCartTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;

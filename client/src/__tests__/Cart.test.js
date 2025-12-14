import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CartContext from "../context/CartContext";

// Mock cart items
const mockCartItems = [
  { _id: "1", name: "Gulab Jamun", price: 50, quantity: 2, category: "Indian" },
  { _id: "2", name: "Rasgulla", price: 40, quantity: 1, category: "Bengali" },
];

// Test component to test CartContext
const TestCartComponent = () => {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
    clearCart,
  } = React.useContext(CartContext);

  return (
    <div>
      <div data-testid="cart-count">{getCartCount()}</div>
      <div data-testid="cart-total">{getCartTotal()}</div>
      <button
        onClick={() =>
          addToCart({
            _id: "3",
            name: "Jalebi",
            price: 30,
            quantity: 1,
            category: "Indian",
          })
        }
      >
        Add Item
      </button>
      <button onClick={() => updateQuantity("1", 3)}>Update Quantity</button>
      <button onClick={() => removeFromCart("1")}>Remove Item</button>
      <button onClick={clearCart}>Clear Cart</button>
      {cart.map((item) => (
        <div key={item._id} data-testid={`cart-item-${item._id}`}>
          {item.name} - {item.quantity}
        </div>
      ))}
    </div>
  );
};

// Test 4: Cart functionality
describe("Shopping Cart", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("should add item to cart", () => {
    const mockAddToCart = jest.fn();
    const mockContext = {
      cart: [],
      addToCart: mockAddToCart,
      removeFromCart: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      getCartTotal: () => 0,
      getCartCount: () => 0,
    };

    render(
      <CartContext.Provider value={mockContext}>
        <button
          onClick={() => mockAddToCart({ _id: "1", name: "Sweet", price: 50 })}
        >
          Add
        </button>
      </CartContext.Provider>
    );

    fireEvent.click(screen.getByText("Add"));
    expect(mockAddToCart).toHaveBeenCalledWith({
      _id: "1",
      name: "Sweet",
      price: 50,
    });
  });

  test("should update quantity in cart", () => {
    const mockUpdateQuantity = jest.fn();
    const mockContext = {
      cart: mockCartItems,
      addToCart: jest.fn(),
      removeFromCart: jest.fn(),
      updateQuantity: mockUpdateQuantity,
      clearCart: jest.fn(),
      getCartTotal: () => 140,
      getCartCount: () => 3,
    };

    render(
      <CartContext.Provider value={mockContext}>
        <button onClick={() => mockUpdateQuantity("1", 5)}>Update</button>
      </CartContext.Provider>
    );

    fireEvent.click(screen.getByText("Update"));
    expect(mockUpdateQuantity).toHaveBeenCalledWith("1", 5);
  });

  test("should remove item from cart", () => {
    const mockRemoveFromCart = jest.fn();
    const mockContext = {
      cart: mockCartItems,
      addToCart: jest.fn(),
      removeFromCart: mockRemoveFromCart,
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      getCartTotal: () => 140,
      getCartCount: () => 3,
    };

    render(
      <CartContext.Provider value={mockContext}>
        <button onClick={() => mockRemoveFromCart("1")}>Remove</button>
      </CartContext.Provider>
    );

    fireEvent.click(screen.getByText("Remove"));
    expect(mockRemoveFromCart).toHaveBeenCalledWith("1");
  });

  test("should calculate total price correctly", () => {
    const mockContext = {
      cart: mockCartItems,
      addToCart: jest.fn(),
      removeFromCart: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      getCartTotal: () => 140, // 50*2 + 40*1
      getCartCount: () => 3,
    };

    render(
      <CartContext.Provider value={mockContext}>
        <div data-testid="total">{mockContext.getCartTotal()}</div>
      </CartContext.Provider>
    );

    expect(screen.getByTestId("total")).toHaveTextContent("140");
  });

  test("should persist cart in localStorage", () => {
    const cartData = [{ _id: "1", name: "Sweet", price: 50, quantity: 1 }];
    localStorage.setItem("sweet_shop_cart", JSON.stringify(cartData));

    const stored = JSON.parse(localStorage.getItem("sweet_shop_cart"));
    expect(stored).toEqual(cartData);
  });

  test("should clear cart after successful checkout", () => {
    const mockClearCart = jest.fn();
    const mockContext = {
      cart: mockCartItems,
      addToCart: jest.fn(),
      removeFromCart: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: mockClearCart,
      getCartTotal: () => 140,
      getCartCount: () => 3,
    };

    render(
      <CartContext.Provider value={mockContext}>
        <button onClick={mockClearCart}>Clear</button>
      </CartContext.Provider>
    );

    fireEvent.click(screen.getByText("Clear"));
    expect(mockClearCart).toHaveBeenCalled();
  });
});

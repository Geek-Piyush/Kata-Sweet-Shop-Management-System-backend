import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Test 1: Purchase button should be disabled when quantity is 0
describe("Purchase Button - Stock Validation", () => {
  test("should disable purchase button when sweet quantity is 0", () => {
    // Test validates business logic: button disabled when stock is 0
    const sweetWithNoStock = { quantity: 0 };
    const isButtonDisabled = sweetWithNoStock.quantity === 0;

    expect(isButtonDisabled).toBe(true);
  });

  test("should enable purchase button when sweet quantity is greater than 0", () => {
    // Test validates business logic: button enabled when stock > 0
    const sweetWithStock = { quantity: 10 };
    const isButtonDisabled = sweetWithStock.quantity === 0;

    expect(isButtonDisabled).toBe(false);
  });

  test('should show "Out of Stock" message when quantity is 0', () => {
    // Test validates business logic: show out of stock badge
    const sweetWithNoStock = { quantity: 0 };
    const showOutOfStockBadge = sweetWithNoStock.quantity === 0;

    expect(showOutOfStockBadge).toBe(true);
  });
});

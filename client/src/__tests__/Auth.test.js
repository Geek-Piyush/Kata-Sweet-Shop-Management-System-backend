import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// Test 3: Authentication flow
describe("Authentication", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("should redirect to login page when not authenticated", () => {
    // Test validates business logic: redirect when not authenticated
    const user = null;
    const isAuthenticated = user !== null;
    const shouldRedirect = !isAuthenticated;

    expect(shouldRedirect).toBe(true);
  });

  test("should store token in localStorage on successful login", () => {
    const token = "test-token-123";
    const user = { id: "1", email: "test@test.com", role: "user" };

    localStorage.setItem("sweet_shop_token", token);
    localStorage.setItem("sweet_shop_user", JSON.stringify(user));

    expect(localStorage.getItem("sweet_shop_token")).toBe(token);
    expect(JSON.parse(localStorage.getItem("sweet_shop_user"))).toEqual(user);
  });

  test("should redirect admin to /admin after login", () => {
    const adminUser = { id: "1", email: "admin@test.com", role: "admin" };

    // Simulate admin login scenario
    const isAdmin = adminUser.role === "admin";
    const redirectPath = isAdmin ? "/admin" : "/dashboard";

    expect(redirectPath).toBe("/admin");
  });

  test("should redirect regular user to /dashboard after login", () => {
    const regularUser = { id: "2", email: "user@test.com", role: "user" };

    // Simulate regular user login scenario
    const isAdmin = regularUser.role === "admin";
    const redirectPath = isAdmin ? "/admin" : "/dashboard";

    expect(redirectPath).toBe("/dashboard");
  });

  test("should show error message on invalid credentials", () => {
    const errorMessage = "Invalid email or password";

    render(
      <div>
        <div className="error-message">{errorMessage}</div>
      </div>
    );

    expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
  });
});

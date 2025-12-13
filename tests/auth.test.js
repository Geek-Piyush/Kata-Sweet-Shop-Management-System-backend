import request from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../src/models/User.js";

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  // Clean up database after each test
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe("Auth Tests", () => {
  describe("POST /api/auth/register", () => {
    test("should register a new user successfully", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "Test@1234",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.user.email).toBe("test@example.com");
      expect(res.body.user.name).toBe("Test User");
      expect(res.body.user.role).toBe("user");
      expect(res.body.token).toBeDefined();
      expect(res.body.user.passwordHash).toBeUndefined();
    });

    test("should fail with missing fields", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "test@example.com",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    test("should fail with weak password", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "weak",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain("at least 8 characters");
    });

    test("should fail with duplicate email", async () => {
      // First registration
      await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "Test@1234",
      });

      // Second registration with same email
      const res = await request(app).post("/api/auth/register").send({
        name: "Another User",
        email: "test@example.com",
        password: "Test@1234",
      });

      expect(res.statusCode).toBe(409);
      expect(res.body.error).toContain("already registered");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // Create a user before each login test
      await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "Test@1234",
      });
    });

    test("should login successfully and return a token", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "Test@1234",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe("test@example.com");
      expect(res.body.user.passwordHash).toBeUndefined();
    });

    test("should fail with wrong password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toContain("Invalid credentials");
    });

    test("should fail with non-existent email", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: "123456",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toContain("Invalid credentials");
    });

    test("should fail with missing fields", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });
});

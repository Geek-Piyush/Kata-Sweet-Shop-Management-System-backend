import request from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../src/models/User.js";
import Sweet from "../src/models/Sweet.js";
import Purchase from "../src/models/Purchase.js";
import { hashPassword } from "../src/utils/password.js";

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  await User.deleteMany({});
  await Sweet.deleteMany({});
  await Purchase.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe("Sweets Tests", () => {
  let adminToken = "";
  let userToken = "";

  beforeEach(async () => {
    // Create admin user
    const hashedPassword = await hashPassword("Admin@123");
    await User.create({
      name: "Admin",
      email: "admin@example.com",
      passwordHash: hashedPassword,
      role: "admin",
    });

    // Login as admin
    const adminRes = await request(app).post("/api/auth/login").send({
      email: "admin@example.com",
      password: "Admin@123",
    });
    adminToken = adminRes.body.token;

    // Create regular user
    const userRes = await request(app).post("/api/auth/register").send({
      name: "Regular User",
      email: "user@example.com",
      password: "User@1234",
    });
    userToken = userRes.body.token;
  });

  describe("POST /api/sweets", () => {
    test("admin should create a sweet successfully", async () => {
      const res = await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Ladoo",
          category: "Indian",
          price: 10,
          quantity: 20,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.sweet.name).toBe("Ladoo");
      expect(res.body.sweet.category).toBe("Indian");
      expect(res.body.sweet.price).toBe(10);
      expect(res.body.sweet.quantity).toBe(20);
    });

    test("non-admin should not be able to create sweet", async () => {
      const res = await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "Ladoo",
          category: "Indian",
          price: 10,
          quantity: 20,
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toContain("Admin");
    });

    test("should fail without authentication", async () => {
      const res = await request(app).post("/api/sweets").send({
        name: "Ladoo",
        category: "Indian",
        price: 10,
        quantity: 20,
      });

      expect(res.statusCode).toBe(401);
    });

    test("should fail with negative price", async () => {
      const res = await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Ladoo",
          category: "Indian",
          price: -10,
          quantity: 20,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain("negative");
    });

    test("should fail with duplicate name", async () => {
      // Create first sweet
      await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Ladoo",
          category: "Indian",
          price: 10,
          quantity: 20,
        });

      // Try to create sweet with same name
      const res = await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Ladoo",
          category: "Different",
          price: 15,
          quantity: 30,
        });

      expect(res.statusCode).toBe(409);
    });
  });

  describe("GET /api/sweets", () => {
    beforeEach(async () => {
      // Create some test sweets
      await Sweet.create([
        { name: "Ladoo", category: "Indian", price: 10, quantity: 20 },
        { name: "Jalebi", category: "Indian", price: 5, quantity: 30 },
        { name: "Chocolate", category: "Western", price: 15, quantity: 10 },
      ]);
    });

    test("should list all sweets", async () => {
      const res = await request(app)
        .get("/api/sweets")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(3);
    });

    test("should filter by category", async () => {
      const res = await request(app)
        .get("/api/sweets?category=Indian")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.every((s) => s.category === "Indian")).toBe(true);
    });

    test("should filter by price range", async () => {
      const res = await request(app)
        .get("/api/sweets?minPrice=5&maxPrice=10")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.every((s) => s.price >= 5 && s.price <= 10)).toBe(true);
    });

    test("should fail without authentication", async () => {
      const res = await request(app).get("/api/sweets");
      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /api/sweets/search", () => {
    beforeEach(async () => {
      await Sweet.create([
        { name: "Ladoo", category: "Indian", price: 10, quantity: 20 },
        { name: "Jalebi", category: "Indian", price: 5, quantity: 30 },
        { name: "Chocolate", category: "Western", price: 15, quantity: 10 },
      ]);
    });

    test("should search by name", async () => {
      const res = await request(app)
        .get("/api/sweets/search?q=ladoo")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe("Ladoo");
    });

    test("should search by category", async () => {
      const res = await request(app)
        .get("/api/sweets/search?category=Indian")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe("PUT /api/sweets/:id", () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: "Ladoo",
        category: "Indian",
        price: 10,
        quantity: 20,
      });
      sweetId = sweet._id;
    });

    test("admin should update sweet successfully", async () => {
      const res = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ price: 15 });

      expect(res.statusCode).toBe(200);
      expect(res.body.sweet.price).toBe(15);
    });

    test("non-admin should not be able to update", async () => {
      const res = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ price: 15 });

      expect(res.statusCode).toBe(403);
    });

    test("should fail with invalid ID", async () => {
      const res = await request(app)
        .put(`/api/sweets/invalid-id`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ price: 15 });

      expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });
  });

  describe("DELETE /api/sweets/:id", () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: "Ladoo",
        category: "Indian",
        price: 10,
        quantity: 20,
      });
      sweetId = sweet._id;
    });

    test("admin should delete sweet successfully", async () => {
      const res = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(204);

      // Verify deletion
      const sweet = await Sweet.findById(sweetId);
      expect(sweet).toBeNull();
    });

    test("non-admin should not be able to delete", async () => {
      const res = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });
  });
});

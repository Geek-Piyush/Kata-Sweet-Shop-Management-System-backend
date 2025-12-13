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

describe("Inventory Tests", () => {
  let userToken = "";
  let adminToken = "";
  let sweetId = "";

  beforeEach(async () => {
    // Create regular user
    const userRes = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "User@1234",
    });
    userToken = userRes.body.token;

    // Create admin user
    const hashedPassword = await hashPassword("Admin@123");
    await User.create({
      name: "Admin",
      email: "admin@example.com",
      passwordHash: hashedPassword,
      role: "admin",
    });

    const adminRes = await request(app).post("/api/auth/login").send({
      email: "admin@example.com",
      password: "Admin@123",
    });
    adminToken = adminRes.body.token;

    // Create a sweet
    const sweet = await Sweet.create({
      name: "Jalebi",
      category: "Indian",
      price: 5,
      quantity: 10,
    });
    sweetId = sweet._id;
  });

  describe("POST /api/sweets/:id/purchase", () => {
    test("should decrement quantity on purchase", async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 2 });

      expect(res.statusCode).toBe(200);
      expect(res.body.sweet.quantity).toBe(8);
    });

    test("should fail when purchasing more than available stock", async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 15 });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain("stock");
    });

    test("should fail with invalid quantity (0 or negative)", async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 0 });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain("at least 1");
    });

    test("should fail without authentication", async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .send({ quantity: 2 });

      expect(res.statusCode).toBe(401);
    });

    test("should fail with non-existent sweet ID", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .post(`/api/sweets/${fakeId}/purchase`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 2 });

      expect(res.statusCode).toBe(404);
    });

    test("should handle purchasing all remaining stock", async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 10 });

      expect(res.statusCode).toBe(200);
      expect(res.body.sweet.quantity).toBe(0);
    });

    test("should fail when attempting to purchase from out-of-stock item", async () => {
      // First purchase all stock
      await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 10 });

      // Try to purchase again
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 1 });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain("stock");
    });
  });

  describe("POST /api/sweets/:id/restock", () => {
    test("admin should be able to restock successfully", async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ quantity: 5 });

      expect(res.statusCode).toBe(200);
      expect(res.body.sweet.quantity).toBe(15);
    });

    test("non-admin should not be able to restock", async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 5 });

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toContain("Admin");
    });

    test("should fail with invalid quantity", async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ quantity: 0 });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain("at least 1");
    });

    test("should fail without authentication", async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .send({ quantity: 5 });

      expect(res.statusCode).toBe(401);
    });

    test("should fail with non-existent sweet ID", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .post(`/api/sweets/${fakeId}/restock`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ quantity: 5 });

      expect(res.statusCode).toBe(404);
    });

    test("should allow restocking after item sold out", async () => {
      // Purchase all stock
      await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 10 });

      // Restock
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ quantity: 20 });

      expect(res.statusCode).toBe(200);
      expect(res.body.sweet.quantity).toBe(20);
    });
  });
});

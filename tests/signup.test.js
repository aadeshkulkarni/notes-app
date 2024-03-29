const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");
const { User } = require("../db");
require("dotenv").config();
/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect(process.env.MONGODB);
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

describe("POST /signup", () => {
  const endpoint = "/api/user/signup";
  it("creates a new user account successfully", async () => {
    const userData = {
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
    };

    const response = await request(app).post(endpoint).send(userData);

    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/Account with email testuser@example.com created successfully./);

    const userExists = await User.findOne({ email: "testuser@example.com" });
    expect(userExists).toBeTruthy();

    await User.deleteOne({ email: "testuser@example.com" });
  });

  it("returns 401 status if account with same email already exists", async () => {
    const existingUser = {
      name: "Existing User",
      email: "existinguser@example.com",
      password: "password123",
    };

    await User.create(existingUser);

    const response = await request(app).post(endpoint).send(existingUser);

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/Account with email existinguser@example.com already exists./);
    
  });

  it("returns 400 status if an error occurs during signup process", async () => {
    const userData = {
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
    };

    jest.spyOn(User, "findOne").mockImplementation(() => {
      throw new Error("Internal server error");
    });

    const response = await request(app).post(endpoint).send(userData);

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/Oops! Something went wrong./);
  });
});

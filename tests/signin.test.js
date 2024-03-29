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

describe("POST /signin", () => {
  const endpoint = "/api/user/signin";
  it("should return status 200 and a token when valid email and password are provided", async () => {
    const newUser = new User({
      email: "test@gmail.com",
      password: "test123",
    });
    await newUser.save();

    const response = await request(app).post(endpoint).send({ email: "test@gmail.com", password: "test123" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Account logged in successfully.");
    expect(response.body.payload.email).toBe("test@gmail.com");
    expect(response.body.token).toBeDefined();

    await User.deleteOne({ email: "test@gmail.com" });
  });

  it("should return status 421 when invalid email or password is provided", async () => {
    const response = await request(app).post(endpoint).send({ email: "invalid@example.com", password: "invalidpassword" });
    expect(response.status).toBe(421);
    expect(response.body.message).toBe("Invalid email or password.");
  });

  it("should return status 400 and an error message when an exception is thrown", async () => {
    jest.spyOn(User, "findOne").mockImplementation(() => {
      throw new Error("Test error");
    });
    const response = await request(app).post(endpoint).send({ email: "test@example.com", password: "password123" });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Oops! Something went wrong.");

    jest.restoreAllMocks();
  });
});

const { z } = require("zod");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const signupSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6),
});

const validateSignup = (req, res, next) => {
  try {
    const { name, email, password } = signupSchema.parse(req.body);
    req.user = { name, email, password };
    next();
  } catch (error) {
    res.status(400).json({ message: error.errors[0] });
  }
};

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const validateSignin = async (req, res, next) => {
  try {
    const { email, password } = signInSchema.parse(req.body);
    req.email = email;
    req.password = password;
    next();
  } catch (error) {
    res.status(400).json({ error: error.errors[0].message });
  }
};

const authorize = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(403).json({ message: "You're unauthorized to perform this action." });
    }
    let token = authorization.split(" ")[1];
    const data = await jwt.verify(token, JWT_SECRET);
    req.userId = data.userId;
    next();
  } catch (ex) {
    return res.status(403).json({ message: "Invalid token." });
  }
};

module.exports = { validateSignup, validateSignin, authorize };

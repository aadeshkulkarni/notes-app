const { User } = require("../db");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { validateSignup, validateSignin } = require("../middlewares/auth");
const JWT_SECRET = process.env.JWT_SECRET;

    /*
        1. ✅ validate username and password as req payload
        2. ✅ check if user exists in the DB
        3. ✅ reate a token and send back as response
     */
router.post("/signin", validateSignin, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email, password: password }, { password: 0 });
    if (user) {
      const userId = user._id.toHexString();
      const token = jwt.sign({ userId: userId }, JWT_SECRET);
      return res.status(200).json({
        message: `Account logged in successfully.`,
        payload: user,
        token: token,
      });
    }
    return res.status(421).json({
      message: `Invalid email or password.`,
    });
  } catch (ex) {
    return res.status(400).json({
      message: `Oops! Something went wrong.`,
      error: ex,
    });
  }
});

    /*
        1. ✅ validate username, password & name as req payload
        2. ✅ Check if user already exists
        3. ✅ if no > Create a new user in the DB
        4. ✅ return 200 else return 401 or something
    */
router.post("/signup", validateSignup, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email: email });
    if (!userExists) {
      await User.create({ name, email, password });
      return res.status(200).json({
        message: `Account with email ${email} created successfully. Login to proceed.`,
      });
    }
    return res.status(401).json({
      message: `Account with email ${email} already exists.`,
    });
  } catch (ex) {
    return res.status(400).json({
      message: `Oops! Something went wrong.`,
      error: ex,
    });
  }
});

module.exports = router;

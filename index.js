const express = require("express");
const app = express();
const userRouter = require("./router/user");
const noteRouter = require("./router/note");
const logger = require("./logger");
require("dotenv").config();
app.use(express.json());
app.use(logger);

app.get("/", (req, res) => {
  res.json({ health: "ok" });
});

app.use("/api/user", userRouter);
app.use("/api/note", noteRouter);

const PORT = process.env.PORT || 80;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
  });
}

module.exports = app;

const mongoose = require("mongoose");
require("dotenv").config();
const MONGODB = process.env.MONGODB;
mongoose.connect(MONGODB);

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
});

const noteSchema = new Schema({
  title: String,
  createdOn: Date,
  isCompleted: Boolean,
});

const User = mongoose.model("User", userSchema);
const Note = mongoose.model("Note", noteSchema);

module.exports = { User, Note };

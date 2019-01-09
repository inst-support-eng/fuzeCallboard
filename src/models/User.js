const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  // user id from google profile
  googleId: String,
  email: String
});

mongoose.model("users", userSchema);

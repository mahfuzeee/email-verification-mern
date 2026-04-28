const mongoose = require("mongoose");

// 1. Define the Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  verificationExpiresAt: Date,
});

// 2. Compile Schema into a Model
module.exports = mongoose.model("User", userSchema);

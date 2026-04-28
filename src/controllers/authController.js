require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectDB = require("../config/db");
const User = require("../models/User");
const sendVerificationEmail = require("../utils/emailVerification");

//MongoDB connection and data handling
connectDB();

//Resister function
const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.findOne({ email })) {
    return res.status(400).json({ error: "Email in use" });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  await sendVerificationEmail(user);
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.status(201).json({ token, user: { id: user._id, name, email } });
};

//Login Function
const login = async (req, res) => {
  const { email, password } = req.body;

  //find user by email
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  //check the password
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.json({ token });
};

//Verify Function
const verifyByEmail = async (req, res) => {
  const { token } = req.params;

  // 1. Find user by token
  const user = await User.findOne({ verificationToken: token });

  // 2. Validate token and expiration
  if (!user || user.verificationExpiresAt < new Date()) {
    return res.status(400).send("Invalid or expired token.");
  }

  // 3. Update user as verified
  user.isVerified = true;
  user.verificationToken = undefined; // Clear the token
  await user.save();

  res.send("Email verified successfully!");
};

//Exporting modules
module.exports = { register, login, verifyByEmail };

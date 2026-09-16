require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  sendVerificationEmail,
  sendOTPEmail,
} = require("../utils/emailVerification");

const isProduction = process.env.NODE_ENV === "production";

const options = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json(user);
};

//Resister function
const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields are required" });

  if (await User.findOne({ email })) {
    return res
      .status(400)
      .json({ success: false, message: "Email already registered" });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  await sendVerificationEmail(user);
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  //Set token as a cookie
  res.cookie("token", token, options);

  res.status(201).json({
    status: "success",
    user: { id: user._id, name, email },
    message: "A verification link has been sent to your email.",
  });
};

//Login Function
const login = async (req, res) => {
  const { email, password } = req.body;

  //find user by email
  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });

  //check the password
  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  //Set token as a cookie
  res.cookie("token", token, options);

  res.status(200).json({
    success: true,
    message: "Logged in succesfull",
    user,
  });
};

//Verify Function
const verifyByEmail = async (req, res) => {
  const { token } = req.params;

  try {
    // 1. Find user by token
    const user = await User.findOne({ verificationToken: token });

    // 2. Validate token and expiration
    if (!user || user.verificationExpiresAt < new Date()) {
      return res.status(400).send("Invalid or expired token.");
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Already verified" });
    }
    // 3. Update user as verified
    user.isVerified = true;
    user.verificationToken = undefined; // Clear the token
    user.verificationExpiresAt = undefined; //clear expire time
    await user.save();

    res.send("Email verified successfully!");
  } catch (err) {
    res.status(500).json({ message: "Server Error.!" });
  }
};

//Function for send OTP to email
const sendOTP = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "user not found." });
    if (user && user.isVerified)
      return res.status(400).json({ message: "Email already registered" });

    await sendOTPEmail(user);

    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

//Function for verify OTP
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ message: "Already verified" });

    if (user.otpExpiry < Date.now())
      return res.status(400).json({ error: "OTP expired" });
    const valid = await bcrypt.compare(otp, user.otpHashed);
    if (!valid) return res.status(400).json({ error: "Invalid OTP" });
    await User.findByIdAndUpdate(user._id, {
      isVerified: true,
      otpHashed: null,
      otpExpiry: null,
    });

    res.status(200).json({
      status: "success",
      message: "Email verified succesfully.",
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

//Exporting modules
module.exports = {
  register,
  login,
  getCurrentUser,
  verifyByEmail,
  sendOTP,
  verifyOTP,
};

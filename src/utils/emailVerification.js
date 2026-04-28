//Importing Node mailer
require("dotenv").config();
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const BASE_URL = "http://localhost:3000";

const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (user) => {
  const token = crypto.randomBytes(32).toString("hex");
  user.verificationToken = token;
  user.verificatonExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
  await user.save();
  await transporter.sendMail({
    to: user.email,
    subject: "Verify your email.",
    html: `<p>Click <a href='${BASE_URL}/api/auth/verify/${token}'>here</a> to verify your email.</p>`,
  });
};

const sendOTPEmail = async (user) => {
  // Helper: generate 6-digit OTP
  const generateOTP = () => crypto.randomInt(100000, 999999).toString();
  const otp = generateOTP();

  //Store hashed OTP to database.
  const otpHashed = await bcrypt.hash(String(otp), 10);
  const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 min
  user.otpHashed = otpHashed;
  user.otpExpiry = otpExpiry;
  await user.save();

  await transporter.sendMail({
    to: user.email,
    subject: "Your OTP Verification Code",
    html: `<p>Your OTP is: <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
  });
};

module.exports = { sendVerificationEmail, sendOTPEmail };

const express = require("express");
const {
  register,
  login,
  verifyByEmail,
  sendOTP,
  verifyOTP,
  getCurrentUser,
} = require("../controllers/authController");
const { verifyToken } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user/me", verifyToken, getCurrentUser);
router.get("/verify/:token", verifyByEmail);
router.post("/request-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

module.exports = router;

const express = require("express");
const {
  register,
  login,
  verifyByEmail,
  sendOTP,
  verifyOTP,
} = require("../controllers/authController");
const { verifyToken } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user/me", verifyToken);
router.get("/verify/:token", verifyByEmail);
router.post("/request-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

module.exports = router;

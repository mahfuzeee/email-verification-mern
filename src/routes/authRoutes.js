const express = require("express");
const {
  register,
  login,
  verifyByEmail,
  sendOTP,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify/:token", verifyByEmail);
router.post("/request-otp", sendOTP);

module.exports = router;

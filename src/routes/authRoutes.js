const express = require("express");
const {
  register,
  login,
  verifyByEmail,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify/:token", verifyByEmail);

module.exports = router;

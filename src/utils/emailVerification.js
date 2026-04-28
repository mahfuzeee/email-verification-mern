//Importing Node mailer
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const BASE_URL = "http://localhost:3000";

const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "mahfuz4462@gmail.com",
    pass: "xgtespzdsxubzacz",
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

module.exports = sendVerificationEmail;

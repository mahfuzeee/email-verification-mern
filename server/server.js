require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes");

//Defining Port
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Use this to allow all origins (simplest for development)
app.use(cors());

//Using Auth Routes
app.use("/api/auth", authRoutes);

// Simplified Global Error Handler
app.use((err, req, res, next) => {
  if (err) {
    res.status(400).json({
      status: "fail",
      message: err.message || "Something went wrong",
    });
  } else {
    next();
  }
});

//Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}.`);
});

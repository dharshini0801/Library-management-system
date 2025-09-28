// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json()); // middleware to parse JSON requests

// --- Connect MongoDB ---
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("MONGO_URI is not defined in .env file");
  process.exit(1);
}

mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

// --- Import routes ---
const authRoutes = require("./routes/authRoutes");   // 🔑 for login/signup
const bookRoutes = require("./routes/bookRoutes");   // 🔑 for books CRUD

// --- Register routes ---
app.use("/api/auth", authRoutes);   // e.g. POST /api/auth/register, POST /api/auth/login
app.use("/api/books", bookRoutes); // e.g. GET /api/books, POST /api/books

// --- Root endpoint ---
app.get("/", (req, res) => {
  res.send("Library Management API with JWT is running ");
});

// --- Start server ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

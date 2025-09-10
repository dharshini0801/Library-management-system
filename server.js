require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// ✅ Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(" MongoDB error:", err));

// ✅ Define Schema & Model
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String
}, { timestamps: true });

const Book = mongoose.model("Book", bookSchema);

// ✅ Routes

// Test route
app.get("/", (req, res) => {
  res.send("Library Management API is running");
});

// Add a new book (POST)
app.post("/api/books", async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Fetch all books (GET) with sort option
// Example: GET /api/books?sort=author OR ?sort=createdAt
app.get("/api/books", async (req, res) => {
  try {
    const { sort, search } = req.query;
    let query = {};

    // Search by title
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    let books = await Book.find(query);

    // Sorting
    if (sort === "author") {
      books = books.sort((a, b) => a.author.localeCompare(b.author));
    } else if (sort === "createdAt") {
      books = books.sort((a, b) => b.createdAt - a.createdAt);
    }

    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch single book by id
app.get("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update book
app.put("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete book
app.delete("/api/books/:id", async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

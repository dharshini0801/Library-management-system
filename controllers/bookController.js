const Book = require("../models/Book");

exports.getBooks = async (req, res) => {
  try {
    let { search, author, sort, offset, limit } = req.query;

    offset = parseInt(offset) || 0; // skip first N books
    limit = parseInt(limit) || 5;   // return max N books

    let query = {};
    if (search) query.title = { $regex: search, $options: "i" };
    if (author) query.author = { $regex: author, $options: "i" };

    let booksQuery = Book.find(query).skip(offset).limit(limit);

    if (sort === "author") booksQuery = booksQuery.sort({ author: 1 });
    if (sort === "createdAt") booksQuery = booksQuery.sort({ createdAt: -1 });

    const books = await booksQuery;
    const totalBooks = await Book.countDocuments(query);

    res.json({ total: totalBooks, books });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE new book
exports.createBook = async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE book by ID
exports.updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBook) return res.status(404).json({ message: "Book not found" });
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE book by ID
exports.deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

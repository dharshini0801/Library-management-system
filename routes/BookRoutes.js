const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const auth = require("../middleware/authMiddleware");

router.get("/", bookController.getBooks);

router.get("/:id", auth, bookController.getBookById);

router.post("/", auth, bookController.createBook);
router.put("/:id", auth, bookController.updateBook);
router.delete("/:id", auth, bookController.deleteBook);

module.exports = router;

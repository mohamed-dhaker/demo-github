const express = require("express");

const {
  getCategorys,
  getCategoryById,
  createCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/categoryController");
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/", protect, admin, createCategory);

router.get("/", getCategorys);

// Get a product by ID route
router.get("/:categoryId", getCategoryById);

router.delete("/:categoryId", protect, admin, deleteCategory);

router.put("/:categoryId", protect, admin, updateCategory);

module.exports = router;

const express = require("express");
const Upload = require("../utils/upload");

const {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
  getProductByAdmin,
  updateProduct,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");
const upload = require("../utils/upload");
const router = express.Router();
// Create a new product route
router.post(
  "/",
  protect,
  admin,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "poster", maxCount: 1 },
  ]),
  createProduct
);
// Get all products route
router.get("/", getProducts);

router.get("/admin", protect, admin, getProductByAdmin);
// Get a product by ID route
router.get("/:productId", getProductById);

router.delete("/:productId", protect, admin, deleteProduct);

router.put(
  "/:productId",
  Upload.fields([{ name: "files", maxCount: 5 }, { name: "poster", maxCount: 1 }]),
  protect,
  admin,
  updateProduct
);

module.exports = router;

const express = require("express");
const {
  registerUser,
  logingUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();
const upload = require("../utils/upload");

// User registration route
router.post("/register", registerUser);
// User login route
router.post("/login", logingUser);
// Get user profile route
router.get("/profile", protect, getUserProfile);
// Update user profile route

router.put(
  "/profile",
  protect,
  upload.single("imageprofile"),
  updateUserProfile
);
// Delete user route

module.exports = router;

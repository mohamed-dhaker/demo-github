const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Reference to the User model
    },
    name: {
      type: String,
      required: true,
    },
    image: [
      {
        type: String,
        required: false,
      },
    ],
    thumbnail: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: false, // Category is optional
      ref: "Category",
    },
    price: {
      type: Number,
      required: true, // Category is optional
      default: 0.0,
    },
    countInStock: {
      type: Number,
      required: false, // Category is optional
      default: 0,
    },
    rating: {
      type: Number,
      required: false, // Category is optional
      default: 0.0,
    },
    numReviews: {
      type: Number,
      required: false, // Category is optional
      default: 0,
    },
  },
  {
    timestamps: true, // Category is optional // Automatically manage createdAt and updatedAt fields
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;

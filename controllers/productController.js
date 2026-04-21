const { default: mongoose } = require("mongoose");
const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");
const { array } = require("../utils/upload");

const getProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10; // Default limit to 10
  const page = parseInt(req.query.page) || 1; // Default page to 1
  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;

  let query = {};
  
  // Add price filter if min or max price is provided
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = minPrice;
    if (maxPrice !== undefined) query.price.$lte = maxPrice;
  }

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate("category")
    .limit(limit)
    .skip((page - 1) * limit)
    .exec();

  res.json({
    products,
    page,
    totalPages: Math.ceil(total / limit),
  });
});
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId).populate(
    "category"
  );
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, category, countInStock } = req.body;
  const user = req.user;

  const product = new Product({
    user: user._id, // Assuming req.user is populated with the authenticated user's info
    name,
    price,
    description,
    category: new mongoose.Types.ObjectId(category),
    countInStock,
  });
  const host = req.get("host");
  const protocol = req.protocol;
  const baseUrl = `${protocol}://${host}/uploads/`;
  if (req.files && req.files.images.length > 0) {
    product.image = req.files.images.map((file) => baseUrl + file.filename);
  }
  if (req.files && req.files.poster && req.files.poster.length > 0) {
    product.thumbnail = baseUrl + req.files.poster[0].filename;
  }
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
 
  if (!product.user._id.equals(req.user._id)) {
    res.status(401).json({ message: "Not authorized to delete this product" });
    return;
  }
  if (product) {
    await product.deleteOne();
    res.json({ message: "Product removed" });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

const getProductByAdmin = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default page to 1
  const limit = parseInt(req.query.limit) || 10; // Default limit to 10
  const total = await Product.countDocuments({ user: req.user._id });
  const products = await Product.find({ user: req.user._id })
    .limit(limit)
    .skip((page - 1) * limit)
    .exec();
  if (!products || products.length === 0) {
    return res.status(404).json({ message: "No products found for this user" });
  }
  res.json({
    products,
    page,
    totalPages: Math.ceil(total / limit),
  });
});


const updateProduct = asyncHandler(async (req, res) => {
  let images = [];
  const { name, price, description, oldimages, category, countInStock } = req.body;
  const product = await Product.findById(req.params.productId);
  
  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  const host = req.get("host");
  const protocol = req.protocol;
  const baseUrl = `${protocol}://${host}/uploads/`;

  // First, add old images
  if (oldimages) {
    if (Array.isArray(oldimages)) {
      images = images.concat(oldimages);
    } else {
      images.push(oldimages);
    }
  }
  
  // Then add new uploaded files
  if (req.files && req.files.files && Array.isArray(req.files.files)) {
    const newImages = req.files.files.map(file => baseUrl + file.filename);
    images = images.concat(newImages);
  }

  // Update product fields
  product.name = name || product.name;
  product.price = price || product.price;
  product.description = description || product.description;
  product.category = category || product.category;
  product.countInStock = countInStock || product.countInStock;
  product.thumbnail = req.files && req.files.poster ? baseUrl + req.files.poster[0].filename : product.thumbnail;
  
  // Only update images if we have any
  if (images.length > 0) {
    product.image = images;
  }

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct, // Exporting deleteProduct for use in routes
  getProductByAdmin,
  updateProduct, // Exporting updateProduct for use in routes

  // You can add more exports for updateProduct and deleteProduct if needed
};

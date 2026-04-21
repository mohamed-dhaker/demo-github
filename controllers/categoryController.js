const category = require("../models/category");
const asyncHandler = require("express-async-handler");

const getCategorys = asyncHandler(async (req, res) => {
  const categorys = await category.find({});
  try {
    if (categorys) {
      res.json(categorys);
    }
  } catch (error) {
    res.status(500).json({ message: "error" });
  }
});
const getCategoryById = asyncHandler(async (req, res) => {
  try {
    const Category = await category.findById(req.params.categoryId);
    console.log(Category);
    if (Category) {
      res.status(200).json(Category);
    }
  } catch (error) {
    res.status(500).json({ message: "cathegory not found" });
  }
});
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  console.log(name);
  const newcategory = new category({
    name,
  });
  try {
    const createdCategory = await newcategory.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(500).json("error while creating category");
  }
});
const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const Category = await category.findById(req.params.categoryId);

    if (!Category) {
      res.status(500).json({ message: "category not found" });
    }
    await Category.deleteOne();
    res.status(200).json({ message: "category deleted" });
  } catch (error) {
    req.status(500).json({ message: "failed delete" });
  }
});
const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const Category = await category.findById(req.params.categoryId);

  if (Category) {
    Category.name = name || Category.name;
    const updatedCategory = await Category.save();
    res.status(200).json(updatedCategory);
  } else {
    res.status(404).json({ message: "Category not found" });
  }
});
module.exports = {
  getCategorys,
  getCategoryById,
  createCategory,
  deleteCategory,
  updateCategory,
};

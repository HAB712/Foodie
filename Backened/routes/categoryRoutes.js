
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Category = require("../models/Category");
const Food = require("../models/Food");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Add category
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name?.trim() || !description?.trim() || !req.file) {
      return res.status(400).json({
        message: "Name, description and image are required",
      });
    }

    const category = await Category.create({
      name,
      description,
      image: `/uploads/${req.file.filename}`,
    });

    res.status(201).json(category);
  } catch (error) {
    if (req.file) fs.unlink(req.file.path, () => {});
    res.status(400).json({ message: error.message });
  }
});

// Display all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Display one category
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Edit category
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      if (req.file) fs.unlink(req.file.path, () => {});
      return res.status(404).json({ message: "Category not found" });
    }

    const updates = {};

    if (req.body.name?.trim()) updates.name = req.body.name.trim();
    if (req.body.description?.trim()) {
      updates.description = req.body.description.trim();
    }
    if (req.file) updates.image = `/uploads/${req.file.filename}`;

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (req.file && category.image) {
      const oldPath = path.join(__dirname, "..", category.image);
      fs.unlink(oldPath, () => {});
    }

    res.json(updated);
  } catch (error) {
    if (req.file) fs.unlink(req.file.path, () => {});
    res.status(400).json({ message: error.message });
  }
});

// Delete category if no food items use it
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const used = await Food.exists({ category: category._id });

    if (used) {
      return res.status(409).json({
        message: "Delete or reassign this category's food items first",
      });
    }

    await category.deleteOne();

    if (category.image) {
      const imagePath = path.join(__dirname, "..", category.image);
      fs.unlink(imagePath, () => {});
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

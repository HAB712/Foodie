
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Food = require("../models/Food");
const Category = require("../models/Category");

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

// Add food
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    if (
      !name?.trim() ||
      price === undefined ||
      String(price).trim() === "" ||
      !description?.trim() ||
      !category ||
      !req.file
    ) {
      return res.status(400).json({
        message: "Name, price, description, category and image are required",
      });
    }

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({
        message: "Price must be a valid number greater than zero",
      });
    }

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const food = await Food.create({
      name,
      price: numericPrice,
      description,
      category,
      image: `/uploads/${req.file.filename}`,
    });

    res.status(201).json(food);
  } catch (error) {
    if (req.file) fs.unlink(req.file.path, () => {});
    res.status(400).json({ message: error.message });
  }
});

// Display all foods with category details
router.get("/", async (req, res) => {
  try {
    const foods = await Food.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Display one food
router.get("/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate(
      "category",
      "name"
    );

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    res.json(food);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Edit food
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      if (req.file) fs.unlink(req.file.path, () => {});
      return res.status(404).json({ message: "Food not found" });
    }

    const updates = {};

    if (req.body.name !== undefined) {
      if (!req.body.name.trim()) {
        throw new Error("Food name cannot be empty");
      }
      updates.name = req.body.name.trim();
    }

    if (req.body.description !== undefined) {
      if (!req.body.description.trim()) {
        throw new Error("Description cannot be empty");
      }
      updates.description = req.body.description.trim();
    }

    if (req.body.price !== undefined) {
      if (
        String(req.body.price).trim() === "" ||
        !Number.isFinite(Number(req.body.price)) ||
        Number(req.body.price) <= 0
      ) {
        throw new Error("Price must be greater than zero");
      }
      updates.price = Number(req.body.price);
    }

    if (req.body.category !== undefined) {
      const categoryExists = await Category.findById(req.body.category);

      if (!categoryExists) {
        throw new Error("Invalid category ID");
      }

      updates.category = req.body.category;
    }

    if (req.file) updates.image = `/uploads/${req.file.filename}`;

    const updated = await Food.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate("category", "name");

    if (req.file && food.image) {
      const oldPath = path.join(__dirname, "..", food.image);
      fs.unlink(oldPath, () => {});
    }

    res.json(updated);
  } catch (error) {
    if (req.file) fs.unlink(req.file.path, () => {});
    res.status(400).json({ message: error.message });
  }
});

// Delete food
router.delete("/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    await food.deleteOne();

    if (food.image) {
      const imagePath = path.join(__dirname, "..", food.image);
      fs.unlink(imagePath, () => {});
    }

    res.json({ message: "Food deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const multer = require("multer");

const categoryRoutes = require("./routes/categoryRoutes");
const foodRoutes = require("./routes/foodRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploaded images ko browser se access karne ke liye
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/categories", categoryRoutes);
app.use("/api/foods", foodRoutes);

app.get("/", (req, res) => {
  res.send("Restaurant Food Menu API is running!");
});

// Multer / upload errors ko clean JSON me convert karna
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "Image size must be under 5MB" });
    }
    return res.status(400).json({ message: err.message });
  }

  if (err && err.message === "Only image files are allowed") {
    return res.status(400).json({ message: err.message });
  }

  next(err);
});

// Unknown route
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

// Generic error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ message: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });


const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Food name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Food price is required"],
      min: [0.01, "Price must be greater than zero"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    image: {
      type: String,
      required: [true, "Food image is required"],
    },
  },
  { timestamps: true, collection: "foods" }
);

module.exports = mongoose.model("Food", foodSchema);

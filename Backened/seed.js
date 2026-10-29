/**
 * Demo data seed script.
 * Run: node seed.js   (backend folder se)
 */
require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Category = require("./models/Category");
const Food = require("./models/Food");

const UPLOAD_DIR = path.join(__dirname, "uploads");

const pickImages = () => {
  const files = fs
    .readdirSync(UPLOAD_DIR)
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort();

  if (files.length === 0) {
    console.error("No images found in uploads folder. Upload images first.");
    process.exit(1);
  }

  // Har category/food ko ek unique image file copy karke dete hain
  let counter = 0;
  return () => {
    const source = files[counter % files.length];
    counter += 1;

    const ext = path.extname(source);
    const filename = `demo-${Date.now()}-${counter}${ext}`;
    fs.copyFileSync(path.join(UPLOAD_DIR, source), path.join(UPLOAD_DIR, filename));

    return `/uploads/${filename}`;
  };
};

const categories = [
  {
    name: "Breakfast",
    description: "Fresh and energizing morning dishes served all day long.",
  },
  {
    name: "Main Course",
    description: "Hearty signature mains prepared with the finest ingredients.",
  },
  {
    name: "Desserts",
    description: "Sweet treats to finish your meal on a perfect note.",
  },
  {
    name: "Beverages",
    description: "Refreshing drinks, juices and freshly brewed coffee.",
  },
];

const foods = [
  {
    name: "Chicken Biryani",
    price: 450,
    description:
      "Fragrant basmati rice layered with tender chicken, served with raita.",
    category: "Main Course",
  },
  {
    name: "Beef Karahi",
    price: 620,
    description:
      "Slow cooked beef in a rich tomato and butter gravy with fresh coriander.",
    category: "Main Course",
  },
  {
    name: "Grilled Fish Steak",
    price: 780,
    description:
      "Perfectly grilled fish fillet with lemon butter sauce and seasonal greens.",
    category: "Main Course",
  },
  {
    name: "Chicken Tikka",
    price: 380,
    description:
      "Tender marinated chicken pieces grilled over charcoal with mint chutney.",
    category: "Main Course",
  },
  {
    name: "Pancakes with Honey",
    price: 320,
    description:
      "Fluffy stacked pancakes drizzled with honey, topped with fresh berries.",
    category: "Breakfast",
  },
  {
    name: "Club Sandwich",
    price: 350,
    description:
      "Crispy grilled sandwich filled with chicken, cheese and fresh salad.",
    category: "Breakfast",
  },
  {
    name: "Chocolate Lava Cake",
    price: 420,
    description:
      "Warm chocolate cake with a molten center served with vanilla ice cream.",
    category: "Desserts",
  },
  {
    name: "Fresh Fruit Parfait",
    price: 260,
    description:
      "Layers of seasonal fruit, crunchy granola and creamy yogurt.",
    category: "Desserts",
  },
  {
    name: "Mango Lassi",
    price: 220,
    description: "Chilled thick mango shake blended with a hint of cardamom.",
    category: "Beverages",
  },
  {
    name: "Fresh Lime Soda",
    price: 180,
    description: "Ice cold lime soda with mint and a pinch of black salt.",
    category: "Beverages",
  },
];

(async () => {
  const nextImage = pickImages();

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to", mongoose.connection.name);

  await Food.deleteMany({});
  await Category.deleteMany({});
  console.log("Cleared old data");

  const catMap = {};
  for (const cat of categories) {
    const created = await Category.create({
      name: cat.name,
      description: cat.description,
      image: nextImage(),
    });
    catMap[cat.name] = created._id;
  }
  console.log(`Inserted ${categories.length} categories`);

  for (const food of foods) {
    await Food.create({
      name: food.name,
      price: food.price,
      description: food.description,
      category: catMap[food.category],
      image: nextImage(),
    });
  }
  console.log(`Inserted ${foods.length} food items`);

  await mongoose.disconnect();
  console.log("SEED DONE");
  process.exit(0);
})().catch((err) => {
  console.error("FAIL", err.message);
  process.exit(1);
});

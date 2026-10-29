import { useEffect, useState } from "react";
import { getAllCategories } from "../services/foodService";

function CategoryChips({ onSelectCategory }) {
  const [categories, setCategories] = useState([{ name: "All" }]);
  const [active, setActive] = useState("All");

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const cats = await getAllCategories();
        const names = [{ name: "All" }, ...cats];
        setCategories(names);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
  }, []);

  const handleClick = (name) => {
    setActive(name);
    if (onSelectCategory) onSelectCategory(name);
  };

  return (
    <section className="category-section" id="categories">
      <div className="container">
        <div className="category-chips">
          {categories.map((cat, idx) => (
            <button
              key={cat._id || idx}
              className={`category-chip ${active === cat.name ? "active" : ""}`}
              onClick={() => handleClick(cat.name)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoryChips;

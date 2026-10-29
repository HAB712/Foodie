import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { getAllFoods, getAllCategories } from "../services/foodService";
import { getImageUrl } from "../utils/apiHelpers";

function Recipes() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [activeSearch, setActiveSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [recipes, setRecipes] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mapFoodToRecipe = (food) => ({
    idMeal: food._id,
    strMeal: food.name,
    strMealThumb: getImageUrl(food.image),
    strCategory: food.category?.name || "",
    strArea: "",
    strInstructions: food.description,
    ...food,
  });

  const applyFilters = (list, search, category) => {
    let result = [...list];
    if (search && search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((r) => r.strMeal.toLowerCase().includes(q));
    }
    if (category && category !== "All") {
      result = result.filter(
        (r) => r.strCategory.toLowerCase() === category.toLowerCase()
      );
    }
    setRecipes(result);
  };

  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        setLoading(true);
        setError(null);
        const foods = await getAllFoods();
        const mapped = foods.map(mapFoodToRecipe);
        setAllRecipes(mapped);
        applyFilters(mapped, activeSearch, selectedCategory);
      } catch (err) {
        console.error(err);
        setRecipes([]);
        setError("Failed to load recipes");
      } finally {
        setLoading(false);
      }
    };
    fetchAllRecipes();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getAllCategories();
        setCategories(["All", ...cats.map((c) => c.name)]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    applyFilters(allRecipes, activeSearch, selectedCategory);
  }, [allRecipes, activeSearch, selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    setActiveSearch(searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setActiveSearch("");
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
  };

  return (
    <>
      <Navbar />
      <section className="recipes-page">
        <div className="container">
          <div className="recipes-hero">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1>All foods</h1>
              <p>Browse our collection of delicious foods</p>
            </motion.div>

            <motion.form
              className="recipes-search-form"
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="search-input-wrapper">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button type="button" className="clear-btn" onClick={clearSearch}>
                    <X size={18} />
                  </button>
                )}
              </div>
              <button type="submit" className="search-submit-btn">
                Search
              </button>
            </motion.form>
          </div>

          <div className="filters-section">
            <div className="filter-header">
              <div className="filter-title">
                <SlidersHorizontal size={20} />
                <span>Filter by Category</span>
              </div>
            </div>
            <div className="category-filters">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-filter-btn ${
                    cat === selectedCategory ? "active" : ""
                  }`}
                  onClick={() => handleCategoryChange(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <LoadingSkeleton />
          ) : error && recipes.length === 0 ? (
            <div className="empty-state">
              <p>{error}</p>
            </div>
          ) : recipes.length === 0 ? (
            <div className="empty-state">
              <h3>No foods found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            <motion.div
              className="recipes-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {recipes.map((recipe, index) => (
                <motion.div
                  key={recipe.idMeal}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <RecipeCard recipe={recipe} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}

export default Recipes;

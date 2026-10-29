import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CategoryChips from "../components/CategoryChips";
import RecipeCard from "../components/RecipeCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { getAllFoods } from "../services/foodService";
import { getImageUrl } from "../utils/apiHelpers";

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allRecipes, setAllRecipes] = useState([]);

  const mapFoodToRecipe = (food) => ({
    idMeal: food._id,
    strMeal: food.name,
    strMealThumb: getImageUrl(food.image),
    strCategory: food.category?.name || "",
    strArea: "",
    strInstructions: food.description,
    ...food,
  });

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const foods = await getAllFoods();
      const mapped = foods.map(mapFoodToRecipe);
      setAllRecipes(mapped);
      setRecipes(mapped);
    } catch (err) {
      console.error(err);
      setRecipes([]);
      setError("Unable to load recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleSearch = (term) => {
    const query = (term || searchTerm).trim().toLowerCase();
    setSearchTerm(query);
    setSelectedCategory("All");
    if (!query) {
      setRecipes(allRecipes);
      setError(null);
      return;
    }
    const filtered = allRecipes.filter((r) =>
      r.strMeal.toLowerCase().includes(query)
    );
    setRecipes(filtered);
    if (filtered.length === 0) setError(`No foods found for "${query}".`);
    else setError(null);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (category === "All" || !category) {
      setRecipes(allRecipes);
      setError(null);
      return;
    }
    const filtered = allRecipes.filter(
      (r) => r.strCategory.toLowerCase() === category.toLowerCase()
    );
    setRecipes(filtered);
    if (filtered.length === 0) setError(`No recipes found in "${category}" category.`);
    else setError(null);
  };

  return (
    <>
      <Navbar />
      <Hero
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleSearch}
      />
      <CategoryChips onSelectCategory={handleCategorySelect} />
      <main className="recipes-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>foods</h2>
              <p>Discover delicious foods for every occasion</p>
            </div>
          </div>
          {loading ? (
            <LoadingSkeleton />
          ) : error && recipes.length === 0 ? (
            <div className="empty-state">
              <p>{error}</p>
            </div>
          ) : (
            <div className="recipes-grid">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.idMeal} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default Home;

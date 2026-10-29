import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock, MapPin, Play, Utensils } from "lucide-react";
import { getFoodById } from "../services/foodService";
import { getImageUrl } from "../utils/apiHelpers";

function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError(null);
        const food = await getFoodById(id);
        const mapped = {
          idMeal: food._id,
          strMeal: food.name,
          strMealThumb: getImageUrl(food.image),
          strCategory: food.category?.name || "",
          strArea: "",
          strInstructions: food.description,
          strYoutube: "",
          ...food,
        };
        setRecipe(mapped);
      } catch (err) {
        console.error(err);
        setError("Unable to load this recipe.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="details-loading">
        <div className="details-spinner"></div>
        <p>Preparing your recipe...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="details-error">
        <div className="empty-icon">
          <Utensils size={30} />
        </div>
        <h2>Recipe Not Found</h2>
        <p>{error || "This recipe could not be found."}</p>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="details-page">
      <div className="container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      <section className="details-hero">
        <div className="container">
          <div className="details-hero-grid">
            <div className="details-image-wrapper">
              <img src={recipe.strMealThumb} alt={recipe.strMeal} />
            </div>

            <div className="details-intro">
              <div className="details-badges">
                {recipe.strCategory && <span>{recipe.strCategory}</span>}
                {recipe.strArea && <span>{recipe.strArea}</span>}
              </div>

              <h1>{recipe.strMeal}</h1>

              {recipe.price !== undefined && recipe.price !== null && (
                <div className="details-price">Rs {recipe.price}</div>
              )}

              <p className="details-description">
                {recipe.description ||
                  recipe.strInstructions ||
                  "A delicious dish from our menu."}
              </p>

              <div className="details-meta">
                <div className="meta-item">
                  <Clock size={18} />
                  <span>30 mins</span>
                </div>
                <div className="meta-item">
                  <Utensils size={18} />
                  <span>4 servings</span>
                </div>
                {recipe.strArea && (
                  <div className="meta-item">
                    <MapPin size={18} />
                    <span>{recipe.strArea}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="details-content">
        <div className="container">
          <div className="details-grid">
            <div className="instructions-section">
              <h2>Instructions</h2>
              <div className="instructions-text">
                <p>{recipe.strInstructions || recipe.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RecipeDetails;

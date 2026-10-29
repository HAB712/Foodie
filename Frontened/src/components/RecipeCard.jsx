import { Heart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { getImageUrl } from "../utils/apiHelpers";

function RecipeCard({ recipe }) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const id = recipe.idMeal || recipe._id;
  const favorite = isFavorite(id);
  const name = recipe.strMeal || recipe.name;
  const image = recipe.strMealThumb || getImageUrl(recipe.image);
  const category = recipe.strCategory || recipe.category?.name || "";
  const price = recipe.price;

  const handleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite({ ...recipe, idMeal: id });
  };

  return (
    <article
      className="recipe-card"
      onClick={() => navigate(`/recipe/${id}`)}
    >
      <div className="recipe-image-wrapper">
        <img src={image} alt={name} />

        <button
          className={`favorite-btn ${favorite ? "details-favorite-active" : ""}`}
          onClick={handleFavorite}
          aria-label={
            favorite ? "Remove from favorites" : "Add to favorites"
          }
        >
          <Heart size={19} fill={favorite ? "currentColor" : "none"} />
        </button>

        {price !== undefined && price !== null && (
          <span className="recipe-price">Rs {price}</span>
        )}
      </div>

      <div className="recipe-card-content">
        <div className="recipe-meta">
          {category && <span>{category}</span>}
        </div>

        <h3>{name}</h3>

        <p className="recipe-card-description">
          {recipe.description || recipe.strInstructions}
        </p>

        <button
          className="view-recipe-btn"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/recipe/${id}`);
          }}
        >
          <span>View food</span>
          <ArrowRight size={17} />
        </button>
      </div>
    </article>
  );
}

export default RecipeCard;

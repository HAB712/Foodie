import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";
import { useFavorites } from "../context/FavoritesContext";
import { Heart } from "lucide-react";

function Favorites() {
  const { favorites } = useFavorites();

  return (
    <>
      <Navbar />
      <section className="recipes-page">
        <div className="container">
          <div className="recipes-hero">
            <div>
              <h1>My Favorites</h1>
              <p>Your saved foods</p>
            </div>
          </div>

          {favorites.length === 0 ? (
            <div className="empty-state">
              <Heart size={48} />
              <h3>No favorites yet</h3>
              <p>Start adding food to your favorites</p>
            </div>
          ) : (
            <div className="recipes-grid">
              {favorites.map((recipe) => (
                <RecipeCard key={recipe.idMeal || recipe._id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Favorites;

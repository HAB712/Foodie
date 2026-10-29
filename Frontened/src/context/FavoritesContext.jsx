import { createContext, useContext, useEffect, useState } from "react";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("foodieFavorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem("foodieFavorites", JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = (id) => {
    if (!id) return false;
    return favorites.some((recipe) => {
      const rid = recipe.idMeal || recipe._id;
      return rid === id;
    });
  };

  const toggleFavorite = (recipe) => {
    const id = recipe.idMeal || recipe._id;
    setFavorites((currentFavorites) => {
      const exists = currentFavorites.some((item) => {
        const rid = item.idMeal || item._id;
        return rid === id;
      });
      if (exists) {
        return currentFavorites.filter((item) => {
          const rid = item.idMeal || item._id;
          return rid !== id;
        });
      }
      return [...currentFavorites, { ...recipe, idMeal: id }];
    });
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}

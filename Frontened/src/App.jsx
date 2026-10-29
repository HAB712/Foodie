import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import RecipeDetails from "./pages/RecipeDetails";
import Favorites from "./pages/Favorites";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminFoods from "./pages/admin/AdminFoods";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/recipes"
          element={<Recipes />}
        />

        <Route
          path="/recipe/:id"
          element={<RecipeDetails />}
        />

        <Route
          path="/favorites"
          element={<Favorites />}
        />

        <Route
          path="/admin/categories"
          element={<AdminCategories />}
        />

        <Route
          path="/admin/foods"
          element={<AdminFoods />}
        />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2200,
          style: {
            borderRadius: "12px",
            padding: "12px 16px",
            fontSize: "13px",
            fontWeight: "600",
          },
        }}
      />
    </>
  );
}

export default App;

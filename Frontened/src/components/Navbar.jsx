import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  Menu,
  X,
  Utensils,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";

import { useFavorites } from "../context/FavoritesContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const scrollToCategories = () => {
    closeMobileMenu();

    if (location.pathname !== "/") {
      navigate("/#categories");
      return;
    }

    const categories = document.getElementById("categories");
    if (categories) {
      categories.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSearchClick = () => {
    closeMobileMenu();

    if (location.pathname !== "/") {
      navigate("/#search");
      return;
    }

    const searchInput = document.querySelector(".search-box input");
    if (searchInput) {
      searchInput.focus();
      searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <>
      <nav className="food-navbar">
        <div className="container navbar-inner">
          {/* LOGO */}
          <Link to="/" className="brand" onClick={closeMobileMenu}>
            <span className="brand-icon">
              <Utensils size={22} />
            </span>

            <span>
              Foodie
              <span className="brand-dot">.</span>
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="nav-links">
            <Link
              to="/"
              className={isActive("/") ? "active" : ""}
              onClick={closeMobileMenu}
            >
              Home
            </Link>

            <Link
              to="/recipes"
              className={isActive("/recipes") ? "active" : ""}
              onClick={closeMobileMenu}
            >
              foods
            </Link>

            <button
              type="button"
              onClick={scrollToCategories}
              className="nav-link-button"
            >
              Categories
            </button>

            <Link
              to="/favorites"
              className={isActive("/favorites") ? "active" : ""}
              onClick={closeMobileMenu}
            >
              Favorites
            </Link>

            <Link
              to="/admin/categories"
              className={
                location.pathname.startsWith("/admin") ? "active" : ""
              }
              onClick={closeMobileMenu}
            >
              Admin
            </Link>
          </div>

          {/* ACTIONS */}
          <div className="nav-actions">
            <button
              type="button"
              onClick={handleSearchClick}
              className="nav-icon-btn"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <Link
              to="/favorites"
              className="nav-icon-btn favorite-nav-btn"
              aria-label="Favorites"
            >
              <Heart size={20} />

              {favorites.length > 0 && (
                <span className="favorite-count">
                  {favorites.length > 9 ? "9+" : favorites.length}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-btn"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`mobile-menu ${
          mobileMenuOpen ? "mobile-menu-open" : ""
        }`}
      >
        <div className="mobile-menu-inner">
          <Link
            to="/"
            onClick={closeMobileMenu}
            className={`mobile-nav-link ${
              isActive("/") ? "active" : ""
            }`}
          >
            <span>Home</span>
            <ChevronRight size={18} />
          </Link>

          <Link
            to="/recipes"
            onClick={closeMobileMenu}
            className={`mobile-nav-link ${
              isActive("/recipes") ? "active" : ""
            }`}
          >
            <span>foods</span>
            <ChevronRight size={18} />
          </Link>

          <button
            type="button"
            onClick={scrollToCategories}
            className="mobile-nav-link"
          >
            <span>Categories</span>
            <ChevronRight size={18} />
          </button>

          <Link
            to="/favorites"
            onClick={closeMobileMenu}
            className={`mobile-nav-link ${
              isActive("/favorites") ? "active" : ""
            }`}
          >
            <span>
              Favorites
              {favorites.length > 0 && (
                <span className="mobile-favorite-count">
                  {favorites.length}
                </span>
              )}
            </span>

            <ChevronRight size={18} />
          </Link>

          <Link
            to="/admin/categories"
            onClick={closeMobileMenu}
            className={`mobile-nav-link ${
              location.pathname.startsWith("/admin") ? "active" : ""
            }`}
          >
            <span>
              <LayoutDashboard size={17} /> Admin Panel
            </span>
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>

      {/* MOBILE OVERLAY */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={closeMobileMenu}
        ></div>
      )}
    </>
  );
}

export default Navbar;

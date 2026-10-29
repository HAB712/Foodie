import { Search, Sparkles, Flame, ChefHat } from "lucide-react";
import { motion } from "framer-motion";

import pic1 from "../assets/pic1.png";

function Hero({
  searchTerm,
  setSearchTerm,
  onSearch,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  const popularItems = [
    "Chicken",
    "Pasta",
    "Beef",
    "Dessert",
  ];

  return (
    <section className="hero-section">

      {/* Decorative floating circles */}
      <motion.div
        className="hero-floating-circle circle-one"
        animate={{
          y: [0, -18, 0],
          x: [0, 8, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="hero-floating-circle circle-two"
        animate={{
          y: [0, 15, 0],
          x: [0, -8, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container">

        <div className="hero-main-grid">

          {/* =========================
              LEFT CONTENT
          ========================== */}

          <motion.div
            className="hero-content"
            initial={{
              opacity: 0,
              x: -45,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
          >

            <motion.div
              className="hero-badge"
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.15,
              }}
            >
              <Sparkles size={15} />

              <span>
                Explore our collection
              </span>
            </motion.div>


            <motion.h1
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.2,
                duration: 0.7,
              }}
            >
              Discover Delicious
              <span> foods</span>
            </motion.h1>


            <motion.p
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.3,
              }}
            >
              Explore thousands of delicious meals,
              discover new flavors, and find something
              special to cook today.
            </motion.p>


            {/* SEARCH */}

            <motion.form
              className="hero-search-box"
              onSubmit={handleSubmit}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.4,
              }}
            >

              <Search
                size={21}
                className="hero-search-icon"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                placeholder="Search chicken, pasta, dessert..."
              />

              <motion.button
                type="submit"
                whileHover={{
                  scale: 1.04,
                }}
                whileTap={{
                  scale: 0.96,
                }}
              >
                Search
                <span>→</span>
              </motion.button>

            </motion.form>


            {/* POPULAR */}

            <motion.div
              className="hero-popular"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.5,
              }}
            >

              <span className="popular-label">
                <Flame size={14} />
                Popular:
              </span>

              {popularItems.map(
                (item) => (
                  <motion.button
                    key={item}
                    type="button"
                    onClick={() => {
                      setSearchTerm(item);
                      onSearch(item);
                    }}
                    whileHover={{
                      y: -3,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                  >
                    {item}
                  </motion.button>
                )
              )}

            </motion.div>


            {/* LITTLE MESSAGE */}

            <motion.div
              className="hero-happy-note"
              initial={{
                opacity: 0,
                x: -15,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.65,
              }}
            >
              <span>
                Good food
              </span>

              <strong>
                = Happy mood ♡
              </strong>
            </motion.div>

          </motion.div>


          {/* =========================
              RIGHT IMAGE
          ========================== */}

          <motion.div
            className="hero-image-area"
            initial={{
              opacity: 0,
              x: 50,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.9,
              delay: 0.15,
              ease: "easeOut",
            }}
          >

            {/* IMAGE */}

            <motion.img
              src={pic1}
              alt="Delicious chicken pasta"
              className="hero-food-image"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 0.8, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />


            {/* Floating tomato */}

            <motion.div
              className="hero-floating-food food-one"
              animate={{
                y: [0, -15, 0],
                rotate: [0, 10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              🍅
            </motion.div>


            {/* Floating basil */}

            <motion.div
              className="hero-floating-food food-two"
              animate={{
                y: [0, 12, 0],
                rotate: [0, -8, 0],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              🌿
            </motion.div>


            {/* Floating lemon */}

            <motion.div
              className="hero-floating-food food-three"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 8, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              🍋
            </motion.div>


            {/* food counter */}

            <motion.div
              className="hero-recipe-counter"
              initial={{
                opacity: 0,
                scale: 0.7,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                delay: 0.8,
                type: "spring",
                stiffness: 180,
              }}
            >

              <div className="counter-icon">
                <ChefHat size={19} />
              </div>

              <div>
                <strong>
                  1000+
                </strong>

                <span>
                  foods to explore
                </span>
              </div>

            </motion.div>

          </motion.div>

        </div>

      </div>


      {/* Bottom curved section */}

      <div className="hero-bottom-wave"></div>

    </section>
  );
}

export default Hero;
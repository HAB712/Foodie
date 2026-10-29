import { motion } from "framer-motion";

function LoadingSkeleton() {
  return (
    <div className="recipe-grid loading-grid">

      {Array.from({ length: 8 }).map(
        (_, index) => (
          <motion.div
            className="skeleton-card"
            key={index}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.06,
              duration: 0.4,
            }}
          >

            <div className="skeleton-image">

              <motion.div
                className="skeleton-shimmer"
                animate={{
                  x: [
                    "-100%",
                    "200%",
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                  delay:
                    index * 0.08,
                }}
              />

            </div>


            <div className="skeleton-content">

              <div className="skeleton-meta">
                <span></span>
                <span></span>
              </div>

              <div className="skeleton-line"></div>

              <div className="skeleton-line medium"></div>

              <div className="skeleton-button">
                <motion.div
                  className="skeleton-button-shimmer"
                  animate={{
                    x: [
                      "-100%",
                      "200%",
                    ],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>

            </div>

          </motion.div>
        )
      )}

    </div>
  );
}

export default LoadingSkeleton;
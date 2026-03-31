/**
 * AnimatedPage.jsx — Page Transition Wrapper
 * ============================================
 * Wraps every page component to give it a smooth enter/exit animation
 * as React Router changes routes.
 *
 * HOW IT WORKS:
 * 1. React Router renders your page component into <Routes>
 * 2. AnimatePresence (in App.jsx) watches for component mount/unmount
 * 3. When a route changes → old page runs its `exit` animation → unmounts
 *                         → new page mounts and runs its `animate` animation
 *
 * USAGE:
 *   function Home() {
 *     return (
 *       <AnimatedPage>
 *         <h1>Home Content</h1>
 *       </AnimatedPage>
 *     );
 *   }
 *
 * BEFORE ANIMATION: page is invisible (opacity:0) and 24px below its position
 * AFTER  ANIMATION: page is at full opacity at its natural position
 */

import { motion } from "framer-motion";
import { pageVariants } from "../animations/variants";

export default function AnimatedPage({ children, variant = "default" }) {
  // `variant` lets you choose between "default" (fade+slide) or "slide" (horizontal)
  // For most pages, "default" feels most premium.

  return (
    <motion.div
      // `variants` connects this element to the animation definitions in variants.js
      variants={pageVariants}

      // `initial` sets the START state — Framer reads this from the variants object
      initial="initial"

      // `animate` sets the TARGET state — element animates TO this
      animate="animate"

      // `exit` sets the state when the element LEAVES the DOM
      // AnimatePresence in App.jsx is required for exit animations to work
      exit="exit"

      // Performance tip: tell the browser this div will animate transform/opacity
      // This creates a GPU composite layer — animations run at 60fps even on mobile
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}

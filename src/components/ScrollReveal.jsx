/**
 * ScrollReveal.jsx — Scroll-Based Reveal Wrapper
 * ================================================
 * Any element wrapped in <ScrollReveal> will animate into view
 * as the user scrolls it into the viewport.
 *
 * HOW `whileInView` WORKS:
 * - Framer Motion uses IntersectionObserver under the hood
 * - When 20% of the element enters the viewport → `animate` state plays
 * - `once: true` → only plays ONCE (not every time you scroll up/down)
 *   → This is the correct UX pattern; re-animating on scroll back is annoying
 *
 * USAGE:
 *   <ScrollReveal>
 *     <SomeCard />
 *   </ScrollReveal>
 *
 *   <ScrollReveal direction="left" delay={0.2}>
 *     <SomeOtherCard />
 *   </ScrollReveal>
 *
 * BEFORE: element is transparent and offset in the chosen direction
 * AFTER:  element fades in and slides to its natural position
 */

import { motion } from "framer-motion";
import { revealVariants, revealFromLeft, revealFromRight, scaleReveal } from "../animations/variants";

// Map the `direction` prop to the correct variant object
const directionMap = {
  up: revealVariants,      // default: fade up from below
  left: revealFromLeft,    // slide in from the left
  right: revealFromRight,  // slide in from the right
  scale: scaleReveal,      // scale up from center
};

export default function ScrollReveal({
  children,
  direction = "up",        // which direction to reveal from
  delay = 0,               // seconds to wait before starting (for staggered rows)
  threshold = 0.15,        // how much of the element must be visible to trigger
  className = "",
}) {
  const selectedVariant = directionMap[direction] || revealVariants;

  return (
    <motion.div
      className={className}

      // `variants` object comes from our variants.js central library
      variants={selectedVariant}

      // Start in the hidden/offset state
      initial="initial"

      // `whileInView` replaces `animate` for scroll-triggered animations.
      // The element animates to "animate" state when it enters the viewport.
      whileInView="animate"

      // viewport config:
      // once: true   → animate only the first time (not on scroll-back)
      // amount: 0.15 → trigger when 15% of element is visible
      viewport={{ once: true, amount: threshold }}

      // `transition` override to inject the `delay` prop
      transition={{
        delay,               // user-specified stagger delay
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}

      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}

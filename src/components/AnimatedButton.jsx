/**
 * AnimatedButton.jsx — Premium Interactive Button
 * =================================================
 * A fully animated button with:
 *   1. Hover: scale + brightness lift
 *   2. Tap:   scale-down press feedback
 *   3. Ripple: CSS-based click ripple effect (like Material UI / Google)
 *
 * THE RIPPLE EFFECT EXPLAINED:
 * When user clicks:
 *   → We calculate the XY position of the click relative to the button
 *   → We create a span element at that position
 *   → CSS animation scales it from 0 → 300% and fades it out
 *   → We then remove it from the DOM (cleanup)
 *
 * USAGE:
 *   <AnimatedButton onClick={handleSearch} variant="primary">
 *     Search Flights
 *   </AnimatedButton>
 *
 *   <AnimatedButton variant="ghost" icon="→">View Details</AnimatedButton>
 *
 * VARIANTS: "primary" | "secondary" | "ghost" | "danger"
 */

import { motion } from "framer-motion";
import { useRef } from "react";
import { buttonHover, buttonTap } from "../animations/variants";

export default function AnimatedButton({
  children,
  onClick,
  variant = "primary",
  icon,
  disabled = false,
  type = "button",
  className = "",
  fullWidth = false,
}) {
  // Ref to the actual DOM button element (needed to calculate ripple position)
  const buttonRef = useRef(null);

  // ── Ripple Effect Handler ────────────────────────────────────────────────
  const handleRipple = (e) => {
    const button = buttonRef.current;
    if (!button) return;

    // Remove any existing ripple to allow rapid re-clicks
    const existingRipple = button.querySelector(".ripple");
    if (existingRipple) existingRipple.remove();

    // Get the button's bounding box to calculate click position relative to button
    const rect = button.getBoundingClientRect();

    // The ripple circle should be large enough to cover the button
    const size = Math.max(rect.width, rect.height) * 2;

    // Center the ripple circle at the exact click point
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    // Create the ripple DOM element
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");

    // Position and size it via inline styles
    Object.assign(ripple.style, {
      width: `${size}px`,
      height: `${size}px`,
      left: `${x}px`,
      top: `${y}px`,
    });

    button.appendChild(ripple);

    // Auto-remove the ripple after the CSS animation completes (600ms)
    setTimeout(() => ripple.remove(), 600);
  };

  // ── Click Handler: ripple + user callback ───────────────────────────────
  const handleClick = (e) => {
    handleRipple(e);
    if (onClick) onClick(e);
  };

  // ── Style map for button variants ───────────────────────────────────────
  const variantStyles = {
    primary:   "btn btn--primary",
    secondary: "btn btn--secondary",
    ghost:     "btn btn--ghost",
    danger:    "btn btn--danger",
  };

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`${variantStyles[variant]} ${fullWidth ? "btn--full" : ""} ${className}`}

      // `whileHover` → Framer animates to these values on cursor enter
      // Using our centralized buttonHover object from variants.js
      whileHover={disabled ? {} : buttonHover}

      // `whileTap` → Framer animates to these values while mouse/touch is held
      whileTap={disabled ? {} : buttonTap}

      // Performance: GPU-accelerate this element
      style={{ willChange: "transform, filter", position: "relative", overflow: "hidden" }}
    >
      {/* Text content */}
      <span className="btn__text">{children}</span>

      {/* Optional icon (e.g., arrow, plane emoji) */}
      {icon && (
        <motion.span
          className="btn__icon"
          // Icon slides right on hover for a dynamic "go" feeling
          whileHover={{ x: 3 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
        >
          {icon}
        </motion.span>
      )}
    </motion.button>
  );
}

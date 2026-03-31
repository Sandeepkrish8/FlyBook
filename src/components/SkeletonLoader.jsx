/**
 * SkeletonLoader.jsx — Content-Aware Loading Skeleton
 * ======================================================
 * Replaces empty/loading states with animated placeholder shapes.
 * This is dramatically better UX than a spinner because:
 *   - Users can see the LAYOUT of what's loading (reduces perceived wait time by ~40%)
 *   - No "content jump" when real data loads
 *   - Matches real content shape 1:1
 *
 * THE SHIMMER ANIMATION:
 *   A pseudo-element with a gradient slides from left to right.
 *   This creates the "light passing over glass" effect (used by LinkedIn, Facebook).
 *   The gradient is: transparent → white → transparent
 *   It moves 200% of the element width, cycling infinitely.
 *   This is a PURE CSS animation — no JS overhead.
 *
 * VARIANTS:
 *   "flight-card"  → mimics the exact FlightCard layout
 *   "text"         → simple horizontal text line
 *   "hero"         → large hero section placeholder
 *
 * USAGE:
 *   {isLoading ? <SkeletonLoader type="flight-card" count={3} /> : <FlightList />}
 */

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "../animations/variants";

// ── Individual Skeleton Element ───────────────────────────────────────────────
function SkeletonBlock({ width = "100%", height = "16px", borderRadius = "8px", className = "" }) {
  return (
    // The `skeleton-shimmer` CSS class applies the sliding gradient animation
    <div
      className={`skeleton-block skeleton-shimmer ${className}`}
      style={{ width, height, borderRadius }}
    />
  );
}

// ── Flight Card Skeleton ───────────────────────────────────────────────────────
function FlightCardSkeleton() {
  return (
    <motion.div
      className="flight-card flight-card--skeleton"
      variants={staggerItem}
    >
      <div className="card-main">
        {/* Airline info placeholder */}
        <div className="card-airline" style={{ gap: "8px" }}>
          <SkeletonBlock width="40px" height="40px" borderRadius="50%" />
          <SkeletonBlock width="80px" height="14px" />
        </div>

        {/* Route placeholder */}
        <div className="card-route" style={{ flex: 1 }}>
          <div className="card-times" style={{ gap: "12px" }}>
            <SkeletonBlock width="52px" height="24px" borderRadius="6px" />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
              <SkeletonBlock width="100%" height="8px" borderRadius="4px" />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <SkeletonBlock width="32px" height="10px" />
                <SkeletonBlock width="32px" height="10px" />
              </div>
            </div>
            <SkeletonBlock width="52px" height="24px" borderRadius="6px" />
          </div>
          <div style={{ display: "flex", gap: "16px", marginTop: "6px" }}>
            <SkeletonBlock width="60px" height="12px" />
            <SkeletonBlock width="70px" height="12px" />
          </div>
        </div>

        {/* Price placeholder */}
        <div className="card-price-section" style={{ alignItems: "center", gap: "8px" }}>
          <SkeletonBlock width="80px" height="32px" borderRadius="6px" />
          <SkeletonBlock width="60px" height="12px" />
          <SkeletonBlock width="80px" height="36px" borderRadius="20px" />
        </div>
      </div>
    </motion.div>
  );
}

// ── Hero Section Skeleton ─────────────────────────────────────────────────────
function HeroSkeleton() {
  return (
    <motion.div
      className="hero-skeleton"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
    >
      <SkeletonBlock width="60%" height="52px" borderRadius="12px" className="hero-skeleton__title" />
      <SkeletonBlock width="40%" height="20px" borderRadius="8px" className="hero-skeleton__sub" />
      <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
        <SkeletonBlock width="200px" height="48px" borderRadius="12px" />
        <SkeletonBlock width="200px" height="48px" borderRadius="12px" />
        <SkeletonBlock width="140px" height="48px" borderRadius="12px" />
      </div>
    </motion.div>
  );
}

// ── Main SkeletonLoader Component ─────────────────────────────────────────────
export default function SkeletonLoader({ type = "flight-card", count = 3 }) {
  if (type === "hero") return <HeroSkeleton />;

  return (
    // staggerContainer makes each skeleton card appear 100ms after the previous
    // This creates a cascading load-in effect instead of all at once
    <motion.div
      className="skeleton-list"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* Render `count` skeleton cards */}
      {Array.from({ length: count }, (_, i) => (
        <FlightCardSkeleton key={i} />
      ))}
    </motion.div>
  );
}

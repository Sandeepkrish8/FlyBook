/**
 * FlightCard.jsx — Premium Animated Flight Result Card
 * =====================================================
 * The most visual component. Every hover, press, and expand
 * is carefully animated to feel premium and tactile.
 *
 * ANIMATIONS INCLUDED:
 *   1. Entrance   → stagger-in from below when the results list loads
 *   2. Hover      → lift (y: -4px), scale (1.025), purple glow shadow
 *   3. Press      → scale down slightly (tactile feedback)
 *   4. Price      → number reveals with a spring scale animation
 *   5. "Best Deal" badge → pulses continuously to draw attention
 *   6. Layout     → card smoothly expands/collapses with `layout` prop
 *
 * FRAMER MOTION `layout` PROP EXPLAINED:
 *   When you add `layout` to a motion element, Framer automatically
 *   animates between its old and new size/position whenever they change.
 *   No manual height animation needed — it "just works".
 *
 * USAGE:
 *   <FlightCard flight={flight} onSelect={handleSelect} />
 */

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cardVariants, cardHover, cardTap, priceReveal, pulseAnimation } from "../animations/variants";

export default function FlightCard({ flight, onSelect, index = 0 }) {
  // Controls the "expanded details" panel inside the card
  const [expanded, setExpanded] = useState(false);

  const {
    airline = "SkyAir",
    logo = "✈",
    from = "NYC",
    to = "LAX",
    departTime = "06:30",
    arrivalTime = "09:15",
    duration = "5h 45m",
    stops = "Non-stop",
    price = 299,
    badge,                  // e.g. "Best Deal", "Fastest", "Cheapest"
    aircraft = "Boeing 737",
    baggage = "23kg included",
    meals = "Meal included",
  } = flight;

  return (
    // `layout` → Framer auto-animates height when expanded content appears/disappears
    // `staggerItem` entrance → this card is a child in a stagger list
    <motion.div
      className="flight-card"
      layout                          // Auto-animate size changes (expand/collapse)
      variants={cardVariants}         // entrance animation (from variants.js)
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={cardHover}          // hover: lift + glow
      whileTap={cardTap}              // press: scale down
      style={{ willChange: "transform, box-shadow", originX: 0.5, originY: 0.5 }}
      custom={index}                  // pass index for stagger delay if needed
    >
      {/* ── Badge (Best Deal / Fastest) ──────────────────────────────── */}
      <AnimatePresence>
        {badge && (
          <motion.div
            className={`card-badge card-badge--${badge.toLowerCase().replace(" ", "-")}`}
            initial={{ opacity: 0, scale: 0.7, y: -8 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              ...pulseAnimation.animate, // continuous pulse to draw attention
            }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {badge}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Card Row ─────────────────────────────────────────────── */}
      <div className="card-main">
        {/* Airline info */}
        <motion.div
          className="card-airline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <span className="airline-logo">{logo}</span>
          <span className="airline-name">{airline}</span>
        </motion.div>

        {/* Flight route: FROM → duration → TO */}
        <div className="card-route">
          <div className="card-times">
            <motion.span
              className="time-departure"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
            >
              {departTime}
            </motion.span>

            {/* Animated flight path line */}
            <div className="route-line">
              <span className="route-from">{from}</span>
              <div className="route-track">
                <motion.div
                  className="route-progress"
                  initial={{ scaleX: 0 }}     // line starts at 0 width
                  animate={{ scaleX: 1 }}     // animates to full width
                  transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                  style={{ originX: 0 }}      // grows from left to right
                />
                <span className="route-plane">✈</span>
              </div>
              <span className="route-to">{to}</span>
            </div>

            <motion.span
              className="time-arrival"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
            >
              {arrivalTime}
            </motion.span>
          </div>

          <div className="card-meta">
            <span className="meta-duration">{duration}</span>
            <span className={`meta-stops ${stops === "Non-stop" ? "meta-stops--direct" : ""}`}>
              {stops}
            </span>
          </div>
        </div>

        {/* Price + CTA */}
        <motion.div
          className="card-price-section"
          variants={priceReveal}
          initial="initial"
          animate="animate"
        >
          <div className="price-amount">
            <span className="price-currency">$</span>
            {/* Price number springs in for emphasis */}
            <motion.span
              className="price-number"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.2 }}
            >
              {price}
            </motion.span>
          </div>
          <span className="price-label">per person</span>

          <motion.button
            className="card-select-btn"
            onClick={() => onSelect && onSelect(flight)}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(99,102,241,1)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
          >
            Select
          </motion.button>
        </motion.div>
      </div>

      {/* ── Expand Details Toggle ────────────────────────────────────── */}
      <motion.button
        className="card-expand-btn"
        onClick={() => setExpanded(!expanded)}
        animate={{ rotate: expanded ? 180 : 0 }} // chevron rotates when expanded
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <span className="expand-icon">›</span>
        <span className="expand-text">
          {expanded ? "Hide details" : "Flight details"}
        </span>
      </motion.button>

      {/* ── Expandable Details Panel ─────────────────────────────────── */}
      {/* AnimatePresence enables exit animation when `expanded` goes false */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            className="card-details"
            // Animate height from 0 → auto (Framer handles this with layout prop)
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ overflow: "hidden" }} // prevents content spilling during animation
          >
            <div className="card-details-inner">
              {[
                { icon: "✈", label: "Aircraft", value: aircraft },
                { icon: "🧳", label: "Baggage", value: baggage },
                { icon: "🍽", label: "Meals", value: meals },
              ].map((detail, i) => (
                <motion.div
                  key={detail.label}
                  className="detail-row"
                  // Stagger each row 60ms apart for a cascade feel
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                >
                  <span className="detail-icon">{detail.icon}</span>
                  <span className="detail-label">{detail.label}</span>
                  <span className="detail-value">{detail.value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

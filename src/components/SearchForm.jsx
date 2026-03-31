/**
 * SearchForm.jsx — Animated Flight Search Form
 * ==============================================
 * A premium search experience with:
 *   1. Form entrance → slides down from above with spring physics
 *   2. Input focus   → glowing border ring, subtle scale
 *   3. Swap button   → 180° rotation animation when swapping FROM/TO
 *   4. Date pickers  → smooth expand/reveal
 *   5. Submit button → scales and shows spinner during "searching" state
 *   6. Form validation → field shake animation on invalid submit
 *
 * USEANIMATE vs WHILEHOVER EXPLAINED:
 *   `whileHover` / `whileTap` → automatic: Framer manages the state
 *   `useAnimate` / `animate()` → imperative: YOU control when to animate
 *   → We use imperative animation for the "shake on error" effect
 *
 * USAGE:
 *   <SearchForm onSearch={handleSearch} />
 */

import { motion, AnimatePresence, useAnimate } from "framer-motion";
import { useState, useRef } from "react";
import { formVariants, formFieldVariant, buttonHover, buttonTap } from "../animations/variants";

export default function SearchForm({ onSearch }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [tripType, setTripType] = useState("one-way"); // "one-way" | "round-trip"
  const [isSearching, setIsSearching] = useState(false);

  // useAnimate returns a [scope, animate] pair.
  // scope: a ref to attach to the form container (defines the animation scope)
  // animate: an imperative function to trigger animations programmatically
  const [formScope, animateForm] = useAnimate();

  // Swap FROM ↔ TO with animated rotation of the swap button
  const [swapped, setSwapped] = useState(false);

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    setSwapped((s) => !s); // toggle swap state → drives rotate animation
  };

  // ── Shake animation on validation error ──────────────────────────────────
  const handleInvalidShake = async () => {
    // `animateForm` runs an imperative animation on the form element
    // The `x` array creates a left-right shake sequence (like iOS wrong passcode)
    await animateForm(
      formScope.current,
      { x: [0, -10, 10, -8, 8, -4, 4, 0] }, // shake keyframes
      { duration: 0.5, ease: "easeInOut" }
    );
  };

  // ── Submit Handler ────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation — trigger shake if fields are empty
    if (!from.trim() || !to.trim() || !date) {
      handleInvalidShake();
      return;
    }

    setIsSearching(true);

    // Simulate an async API call (replace with real API call)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSearching(false);

    if (onSearch) {
      onSearch({ from, to, date, returnDate, tripType });
    }
  };

  return (
    // The form container animates in using formVariants from variants.js
    <motion.form
      ref={formScope}              // attach the useAnimate scope for imperative control
      className="search-form"
      variants={formVariants}
      initial="initial"
      animate="animate"
      onSubmit={handleSubmit}
      noValidate
    >
      {/* ── Trip Type Toggle ─────────────────────────────────────────── */}
      <motion.div className="trip-type-toggle" variants={formFieldVariant}>
        {["one-way", "round-trip"].map((type) => (
          <motion.button
            key={type}
            type="button"
            className={`trip-type-btn ${tripType === type ? "trip-type-btn--active" : ""}`}
            onClick={() => setTripType(type)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Active indicator slides under the selected tab — "magic underline" */}
            {tripType === type && (
              <motion.div
                className="trip-type-indicator"
                layoutId="tripTypeIndicator"  // layoutId: Framer smoothly moves this between active buttons
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
              />
            )}
            {type === "one-way" ? "One Way" : "Round Trip"}
          </motion.button>
        ))}
      </motion.div>

      {/* ── FROM / SWAP / TO Row ─────────────────────────────────────── */}
      <motion.div className="form-route-row" variants={formFieldVariant}>
        <AnimatedInput
          label="From"
          placeholder="City or Airport"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          icon="📍"
        />

        {/* Swap Button — rotates 180° each press */}
        <motion.button
          type="button"
          className="swap-btn"
          onClick={handleSwap}
          animate={{ rotate: swapped ? 180 : 0 }}
          whileHover={{ scale: 1.15, backgroundColor: "rgba(99,102,241,0.15)" }}
          whileTap={{ scale: 0.85, rotate: swapped ? 270 : 90 }}
          transition={{ type: "spring", stiffness: 350, damping: 20 }}
          title="Swap origin and destination"
        >
          ⇄
        </motion.button>

        <AnimatedInput
          label="To"
          placeholder="City or Airport"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          icon="🏁"
        />
      </motion.div>

      {/* ── Date Row ─────────────────────────────────────────────────── */}
      <motion.div className="form-date-row" variants={formFieldVariant}>
        <AnimatedInput
          label="Departure"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          icon="📅"
        />

        {/* Return date field only appears when "round-trip" is selected */}
        <AnimatePresence>
          {tripType === "round-trip" && (
            <motion.div
              className="form-field-wrapper"
              // Slides in from the right when round-trip is selected
              initial={{ opacity: 0, x: 20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: "auto" }}
              exit={{ opacity: 0, x: 20, width: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              style={{ overflow: "hidden" }}
            >
              <AnimatedInput
                label="Return"
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                icon="📅"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatedInput
          label="Passengers"
          type="select"
          icon="👤"
          options={["1 Adult", "2 Adults", "3 Adults", "4 Adults", "Family (2+2)"]}
        />
      </motion.div>

      {/* ── Search Button ─────────────────────────────────────────────── */}
      <motion.div className="form-submit-row" variants={formFieldVariant}>
        <motion.button
          type="submit"
          className="search-btn"
          whileHover={!isSearching ? buttonHover : {}}
          whileTap={!isSearching ? buttonTap : {}}
          disabled={isSearching}
          // The button width animates to accommodate the loading spinner
          animate={{ opacity: isSearching ? 0.85 : 1 }}
        >
          <AnimatePresence mode="wait">
            {isSearching ? (
              // Loading state: spinner + text
              <motion.span
                key="loading"
                className="search-btn__content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <motion.span
                  className="search-spinner"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
                >
                  ◌
                </motion.span>
                Searching…
              </motion.span>
            ) : (
              // Normal state: icon + text
              <motion.span
                key="idle"
                className="search-btn__content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                🔍 Search Flights
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
    </motion.form>
  );
}

// ── AnimatedInput — Focus-Animated Input Field ───────────────────────────────
/**
 * A single form input that:
 *   - Animates its label to float upward when focused or filled
 *   - Shows a glowing purple border ring on focus
 *   - Smoothly transitions between states
 *
 * FLOATING LABEL TECHNIQUE:
 *   The label starts at center (overlapping the input placeholder area).
 *   On focus → label shrinks and moves to the top-left corner.
 *   This uses Framer Motion `animate` controlled by `isFocused` state.
 */
function AnimatedInput({ label, placeholder, value, onChange, type = "text", icon, options }) {
  const [isFocused, setIsFocused] = useState(false);

  const isActive = isFocused || (value && value.length > 0);

  // Select element rendering
  if (type === "select") {
    return (
      <motion.div
        className={`form-field ${isFocused ? "form-field--focused" : ""}`}
        animate={isFocused ? {
          boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.35)",
          scale: 1.01,
        } : {
          boxShadow: "0 0 0 2px transparent",
          scale: 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <span className="field-icon">{icon}</span>
        <select
          className="field-input field-select"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          {options?.map((opt) => <option key={opt}>{opt}</option>)}
        </select>
        <motion.label
          className="field-label"
          animate={isActive ? { y: -22, scale: 0.78, color: "#6366f1" } : { y: 0, scale: 1, color: "#9ca3af" }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          {label}
        </motion.label>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`form-field ${isFocused ? "form-field--focused" : ""}`}
      // Border glow: appears on focus, disappears on blur
      animate={isFocused ? {
        boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.35), 0 4px 20px rgba(99, 102, 241, 0.12)",
        scale: 1.01,
      } : {
        boxShadow: "0 0 0 2px rgba(100, 116, 139, 0.2)",
        scale: 1,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <span className="field-icon">{icon}</span>
      <input
        className="field-input"
        type={type}
        placeholder={isFocused ? placeholder : ""}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {/* Floating label — springs up/down on focus */}
      <motion.label
        className="field-label"
        animate={
          isActive
            ? { y: -22, scale: 0.78, color: "#6366f1" } // focused/filled: shrink and float up
            : { y: 0, scale: 1, color: "#9ca3af" }       // resting: regular position and color
        }
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {label}
      </motion.label>
    </motion.div>
  );
}

/**
 * SeatSelection.jsx — Interactive Animated Seat Map
 * ===================================================
 * The most complex and delightful component in the app.
 *
 * ANIMATIONS:
 *   1. Plane cabin slides down into view on mount (spring)
 *   2. Each seat pops in with stagger (spring, 0-row delay)
 *   3. Seat hover → lifts up with shadow glow
 *   4. Seat select → pop + wiggle (keyframes animation)
 *   5. Seat deselect → spring scale-out then back
 *   6. Summary panel → slides up from bottom when seat is chosen
 *   7. Confirmation → scale-in success checkmark
 *
 * SEAT STATES:
 *   "available" → clickable, shows hover effects
 *   "selected"  → highlighted purple, shows pop animation
 *   "taken"     → greyed out, not interactive (cross)
 *   "premium"   → gold color (business class)
 *
 * USAGE:
 *   <SeatSelection onSeatSelect={handleSeatSelect} />
 */

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { successVariants } from "../animations/variants";

// ── Seat data generator ───────────────────────────────────────────────────────
// Real app: fetch this from API. Here we generate a demo grid.
function generateSeats() {
  const rows = 20;
  const cols = ["A", "B", "C", "", "D", "E", "F"]; // "" = aisle gap
  const takenIndices = new Set([3, 7, 12, 15, 22, 31, 44, 55, 62, 78, 89]);
  const premiumRows = [1, 2, 3]; // first 3 rows = business/premium

  return Array.from({ length: rows }, (_, rowIdx) => ({
    row: rowIdx + 1,
    isPremium: premiumRows.includes(rowIdx + 1),
    seats: cols.map((col, colIdx) => {
      if (col === "") return { isAisle: true };
      const id = `${rowIdx + 1}${col}`;
      const seatNum = rowIdx * 6 + colIdx;
      return {
        id,
        row: rowIdx + 1,
        col,
        status: takenIndices.has(seatNum) ? "taken" : "available",
        isPremium: premiumRows.includes(rowIdx + 1),
      };
    }),
  }));
}

// ── Individual Seat Component ─────────────────────────────────────────────────
function Seat({ seat, isSelected, onToggle, rowIndex, colIndex }) {
  if (seat.isAisle) {
    return <div className="seat-aisle" />;
  }

  // Calculate stagger delay: seats pop in row-by-row, then column-by-column
  const staggerDelay = rowIndex * 0.02 + colIndex * 0.01;

  const statusClass = isSelected
    ? "seat--selected"
    : seat.status === "taken"
    ? "seat--taken"
    : seat.isPremium
    ? "seat--premium"
    : "seat--available";

  return (
    <motion.button
      className={`seat ${statusClass}`}
      disabled={seat.status === "taken"}
      onClick={() => seat.status !== "taken" && onToggle(seat)}
      title={seat.status === "taken" ? "Seat taken" : `Seat ${seat.id}`}

      // Entrance starts invisible/scaled-down; the single `animate` below drives entry + selection
      initial={{ opacity: 0, scale: 0 }}

      // ── Hover: lift the seat up, show glow ──
      whileHover={seat.status !== "taken" ? {
        y: -3,
        scale: 1.15,
        boxShadow: isSelected
          ? "0 6px 20px rgba(99, 102, 241, 0.5)"
          : "0 4px 14px rgba(0,0,0,0.25)",
        transition: { type: "spring", stiffness: 500, damping: 20 },
      } : {}}

      // ── Tap: press down ──
      whileTap={seat.status !== "taken" ? { scale: 0.88 } : {}}

      // ── Single `animate`: handles entrance (scale 0→1), selection pop, and deselect ──
      animate={isSelected ? {
        opacity: 1,
        scale: [1, 1, 1.35, 1.15, 1.2],   // pop sequence
        rotate: [0, 0, -6, 3, 0],           // micro-wiggle
        transition: {
          duration: 0.45,
          times: [0, 0.1, 0.4, 0.7, 1],
          delay: 0,
        },
      } : {
        // Entry + deselected state: spring in from initial={{ scale: 0 }}
        opacity: seat.status === "taken" ? 0.45 : 1,
        scale: 1,
        rotate: 0,
        transition: {
          type: "spring",
          stiffness: 350,
          damping: 22,
          delay: staggerDelay,  // cascading row-by-row entrance
        },
      }}
    >
      {/* Seat icon changes based on state */}
      <AnimatePresence mode="wait">
        {seat.status === "taken" ? (
          <motion.span key="taken" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>✕</motion.span>
        ) : isSelected ? (
          <motion.span
            key="selected"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
          >
            ✓
          </motion.span>
        ) : (
          <motion.span key="id" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {seat.id}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ── Main SeatSelection Component ─────────────────────────────────────────────
export default function SeatSelection({ onSeatSelect }) {
  const [seats] = useState(generateSeats);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [confirmed, setConfirmed] = useState(false);

  const handleToggle = (seat) => {
    setSelectedSeats((prev) => {
      const alreadySelected = prev.find((s) => s.id === seat.id);
      if (alreadySelected) {
        // Deselect: remove from list
        return prev.filter((s) => s.id !== seat.id);
      }
      // Select: limit to 1 seat for this demo (change to 4 for families)
      if (prev.length >= 1) return [seat];
      return [...prev, seat];
    });
  };

  const handleConfirm = () => {
    setConfirmed(true);
    if (onSeatSelect) onSeatSelect(selectedSeats);
  };

  return (
    // The entire cabin slides down from above on page load
    <motion.div
      className="seat-selection"
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 30 }}
    >
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="seat-header">
        <h2 className="seat-title">Select Your Seat</h2>
        <p className="seat-subtitle">{seats.length} rows · Click a seat to select</p>
      </div>

      {/* ── Legend ───────────────────────────────────────────────── */}
      <motion.div
        className="seat-legend"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {[
          { cls: "seat--available", label: "Available" },
          { cls: "seat--selected",  label: "Selected" },
          { cls: "seat--taken",     label: "Taken" },
          { cls: "seat--premium",   label: "Premium" },
        ].map(({ cls, label }) => (
          <div key={label} className="legend-item">
            <div className={`seat seat--legend ${cls}`} />
            <span>{label}</span>
          </div>
        ))}
      </motion.div>

      {/* ── Column Labels ─────────────────────────────────────────── */}
      <div className="seat-col-labels">
        {["A", "B", "C", "", "D", "E", "F"].map((col, i) => (
          <div key={i} className={`col-label ${col === "" ? "col-label--aisle" : ""}`}>
            {col}
          </div>
        ))}
      </div>

      {/* ── Seat Grid ─────────────────────────────────────────────── */}
      <div className="seat-cabin">
        {/* Plane nose decoration */}
        <motion.div
          className="cabin-nose"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ originY: 0 }}
        />

        {/* Render each row */}
        {seats.map((row, rowIdx) => (
          <motion.div
            key={row.row}
            className={`seat-row ${row.isPremium ? "seat-row--premium" : ""}`}
            // Rows slide in from the left, staggered
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: rowIdx * 0.015, duration: 0.3 }}
          >
            <span className="row-label">{row.row}</span>
            {row.seats.map((seat, colIdx) => (
              <Seat
                key={seat.isAisle ? `aisle-${colIdx}` : seat.id}
                seat={seat}
                isSelected={selectedSeats.some((s) => s.id === seat.id)}
                onToggle={handleToggle}
                rowIndex={rowIdx}
                colIndex={colIdx}
              />
            ))}
          </motion.div>
        ))}
      </div>

      {/* ── Selected Seat Summary Panel — slides up from bottom ────── */}
      <AnimatePresence>
        {selectedSeats.length > 0 && !confirmed && (
          <motion.div
            className="seat-summary"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            <div className="summary-info">
              <span className="summary-seat">
                Seat <strong>{selectedSeats[0]?.id}</strong>
              </span>
              {selectedSeats[0]?.isPremium && (
                <motion.span
                  className="summary-badge summary-badge--premium"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                >
                  Premium
                </motion.span>
              )}
            </div>
            <motion.button
              className="seat-confirm-btn"
              onClick={handleConfirm}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 500, damping: 22 }}
            >
              Confirm Seat →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Confirmation Success State ───────────────────────────── */}
      <AnimatePresence>
        {confirmed && (
          <motion.div
            className="seat-confirmed"
            variants={successVariants}
            initial="initial"
            animate="animate"
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <motion.div
              className="success-circle"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 14 }}
            >
              ✓
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              Seat <strong>{selectedSeats[0]?.id}</strong> confirmed!
            </motion.p>
            <motion.button
              className="seat-change-btn"
              onClick={() => { setConfirmed(false); setSelectedSeats([]); }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Change Seat
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

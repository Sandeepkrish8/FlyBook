import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const AIRLINES = ["SkyAir", "BlueWings", "AirNova", "PolarJet", "SunExpress", "EastAir"];
const STOPS    = ["Non-stop", "1 stop", "2 stops"];
const TIMES    = [
  { label: "Early morning", sub: "12am – 6am",  icon: "🌙" },
  { label: "Morning",       sub: "6am – 12pm",  icon: "🌅" },
  { label: "Afternoon",     sub: "12pm – 6pm",  icon: "☀" },
  { label: "Evening",       sub: "6pm – 12am",  icon: "🌆" },
];

export default function FilterSidebar({ isOpen, onClose, onApply }) {
  const [priceRange, setPriceRange]   = useState([0, 700]);
  const [airlines, setAirlines]       = useState([]);
  const [stops, setStops]             = useState([]);
  const [depTime, setDepTime]         = useState([]);

  function toggleArr(arr, setArr, val) {
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  }

  function handleApply() {
    onApply({ priceRange, airlines, stops, depTime });
    onClose();
  }

  function handleReset() {
    setPriceRange([0, 700]);
    setAirlines([]);
    setStops([]);
    setDepTime([]);
    onApply({ priceRange: [0, 700], airlines: [], stops: [], depTime: [] });
  }

  const activeCount = airlines.length + stops.length + depTime.length + (priceRange[1] < 700 ? 1 : 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (mobile only) */}
          <motion.div
            className="filter-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            className="filter-sidebar"
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="filter-header">
              <h3 className="filter-title">
                Filters
                {activeCount > 0 && (
                  <motion.span
                    className="filter-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                  >
                    {activeCount}
                  </motion.span>
                )}
              </h3>
              <div className="filter-header-actions">
                {activeCount > 0 && (
                  <button className="filter-reset-btn" onClick={handleReset}>Reset</button>
                )}
                <button className="filter-close-btn" onClick={onClose}>✕</button>
              </div>
            </div>

            <div className="filter-body">

              {/* Price Range */}
              <div className="filter-section">
                <h4 className="filter-section-title">Max Price</h4>
                <div className="price-range-display">
                  <span className="price-range-val">$0</span>
                  <span className="price-range-val price-range-val--active">${priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="700"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                  className="price-slider"
                />
                <div className="slider-track-labels">
                  <span>$0</span>
                  <span>$700+</span>
                </div>
              </div>

              {/* Stops */}
              <div className="filter-section">
                <h4 className="filter-section-title">Stops</h4>
                <div className="filter-pills">
                  {STOPS.map((s) => (
                    <motion.button
                      key={s}
                      className={`filter-pill ${stops.includes(s) ? "filter-pill--active" : ""}`}
                      onClick={() => toggleArr(stops, setStops, s)}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Departure Time */}
              <div className="filter-section">
                <h4 className="filter-section-title">Departure Time</h4>
                <div className="filter-time-grid">
                  {TIMES.map((t) => (
                    <motion.button
                      key={t.label}
                      className={`filter-time-btn ${depTime.includes(t.label) ? "filter-time-btn--active" : ""}`}
                      onClick={() => toggleArr(depTime, setDepTime, t.label)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="time-btn-icon">{t.icon}</span>
                      <span className="time-btn-label">{t.label}</span>
                      <span className="time-btn-sub">{t.sub}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Airlines */}
              <div className="filter-section">
                <h4 className="filter-section-title">Airlines</h4>
                <div className="filter-checkboxes">
                  {AIRLINES.map((a) => (
                    <label key={a} className="filter-checkbox-row">
                      <motion.div
                        className={`filter-checkbox ${airlines.includes(a) ? "filter-checkbox--checked" : ""}`}
                        onClick={() => toggleArr(airlines, setAirlines, a)}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                      >
                        {airlines.includes(a) && (
                          <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 22 }}
                          >
                            ✓
                          </motion.span>
                        )}
                      </motion.div>
                      <span>{a}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply button */}
            <div className="filter-footer">
              <motion.button
                className="filter-apply-btn"
                onClick={handleApply}
                whileHover={{ scale: 1.03, filter: "brightness(1.1)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
              >
                Show Results
                {activeCount > 0 && ` (${activeCount} active)`}
              </motion.button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

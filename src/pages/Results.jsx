/**
 * Results.jsx — Flight Search Results Page
 * =========================================
 * Shows flight results with:
 *   - Loading skeleton (1.5s simulated)
 *   - Stagger-in of flight cards
 *   - Sort/filter bar with animated active indicator
 *   - Flight modal on "Select" click
 *   - Price histogram (CSS only, no chart library needed)
 */

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";
import FlightCard from "../components/FlightCard";
import SkeletonLoader from "../components/SkeletonLoader";
import FlightModal from "../components/FlightModal";
import FilterSidebar from "../components/FilterSidebar";
import { useToast } from "../components/Toast";
import { staggerContainer, staggerItem } from "../animations/variants";

// ── Mock flight data ──────────────────────────────────────────────────────────
function generateFlights(from = "NYC", to = "LAX") {
  return [
    { id: 1, airline: "SkyAir",    logo: "✈", from, to, departTime: "06:30", arrivalTime: "09:15", duration: "5h 45m", stops: "Non-stop", price: 299,  badge: "Best Deal",  aircraft: "A320", baggage: "23kg", meals: "Snack" },
    { id: 2, airline: "BlueWings", logo: "🔵", from, to, departTime: "09:00", arrivalTime: "14:30", duration: "5h 30m", stops: "Non-stop", price: 329,  badge: "Fastest",   aircraft: "B737", baggage: "23kg", meals: "Meal" },
    { id: 3, airline: "AirNova",   logo: "🟣", from, to, departTime: "11:45", arrivalTime: "17:50", duration: "6h 05m", stops: "1 stop",   price: 189,  badge: "Cheapest",  aircraft: "A321", baggage: "20kg", meals: "None"},
    { id: 4, airline: "PolarJet",  logo: "❄",  from, to, departTime: "14:20", arrivalTime: "20:00", duration: "5h 40m", stops: "Non-stop", price: 415,  badge: null,        aircraft: "B787", baggage: "30kg", meals: "Full" },
    { id: 5, airline: "SunExpress",logo: "☀",  from, to, departTime: "18:55", arrivalTime: "00:30", duration: "5h 35m", stops: "Non-stop", price: 355,  badge: null,        aircraft: "A220", baggage: "23kg", meals: "Snack" },
    { id: 6, airline: "EastAir",   logo: "🌅", from, to, departTime: "22:10", arrivalTime: "04:50", duration: "6h 40m", stops: "2 stops",  price: 149,  badge: null,        aircraft: "B737", baggage: "15kg", meals: "None" },
  ];
}

const SORT_OPTIONS = ["Best", "Cheapest", "Fastest", "Eco"];

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchData = location.state || { from: "NYC", to: "LAX" };

  const [isLoading, setIsLoading] = useState(true);
  const [flights, setFlights] = useState([]);
  const [activeSort, setActiveSort] = useState("Best");
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ priceRange: [0, 700], airlines: [], stops: [], depTime: [] });
  const toast = useToast();

  // Simulate API fetch
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setFlights(generateFlights(searchData.from, searchData.to));
      setIsLoading(false);
    }, 1600);
    return () => clearTimeout(timer);
  }, [searchData.from, searchData.to]);

  const handleSelectFlight = (flight) => {
    setSelectedFlight(flight);
    setIsModalOpen(true);
  };

  const handleBook = (flight) => {
    setIsModalOpen(false);
    toast.success(`${flight.airline} flight booked! Check your Details page.`, "Booking Confirmed");
    navigate("/booking", { state: { flight } });
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    const active = newFilters.airlines.length + newFilters.stops.length + newFilters.depTime.length + (newFilters.priceRange[1] < 700 ? 1 : 0);
    if (active > 0) toast.info(`${active} filter${active > 1 ? "s" : ""} applied`, "Filters");
    else toast.info("All filters cleared", "Filters");
  };

  // Sort + filter logic
  const sortedFlights = [...flights]
    .filter((f) => f.price <= filters.priceRange[1])
    .filter((f) => filters.airlines.length === 0 || filters.airlines.includes(f.airline))
    .filter((f) => filters.stops.length === 0    || filters.stops.includes(f.stops))
    .sort((a, b) => {
      if (activeSort === "Cheapest") return a.price - b.price;
      if (activeSort === "Fastest") return a.duration.localeCompare(b.duration);
      return 0;
    });

  return (
    <AnimatedPage>
      <main className="results-page">

        {/* ── Route Summary Header ───────────────────────────────── */}
        <motion.div
          className="results-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
          <div className="results-route">
            <h1 className="results-title">
              {searchData.from} <span className="route-arrow">→</span> {searchData.to}
            </h1>
            <p className="results-meta">
              {searchData.date || "Any date"} · {flights.length} flights found
            </p>
          </div>
        </motion.div>

        {/* ── Sort / Filter Bar ──────────────────────────────────── */}
        <motion.div
          className="sort-bar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {SORT_OPTIONS.map((opt) => (
            <motion.button
              key={opt}
              className={`sort-btn ${activeSort === opt ? "sort-btn--active" : ""}`}
              onClick={() => setActiveSort(opt)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              {opt}
              {/* Sliding active indicator using layoutId */}
              {activeSort === opt && (
                <motion.div
                  className="sort-indicator"
                  layoutId="sortIndicator"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* ── Results / Skeleton ────────────────────────────────── */}
        <div className="results-list">
          <AnimatePresence mode="wait">
            {isLoading ? (
              // Loading skeleton fades in while data is fetching
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SkeletonLoader type="flight-card" count={4} />
              </motion.div>
            ) : (
              // Actual results stagger in after loading
              <motion.div
                key="results"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {sortedFlights.map((flight, index) => (
                  <motion.div key={flight.id} variants={staggerItem}>
                    <FlightCard
                      flight={flight}
                      index={index}
                      onSelect={handleSelectFlight}
                    />
                  </motion.div>
                ))}

                {/* Empty state */}
                {sortedFlights.length === 0 && (
                  <motion.div
                    className="empty-state"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    <span className="empty-icon">✈</span>
                    <h3>No flights found</h3>
                    <p>Try different dates or airports.</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Flight Details Modal ───────────────────────────────── */}
        <FlightModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          flight={selectedFlight}
          onBook={handleBook}
        />
        {/* ── Filter Sidebar ─────────────────────────────── */}
        <FilterSidebar
          isOpen={filterOpen}
          onClose={() => setFilterOpen(false)}
          onApply={handleApplyFilters}
        />
      </main>
    </AnimatedPage>
  );
}

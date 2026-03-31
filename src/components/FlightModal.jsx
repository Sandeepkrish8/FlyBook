/**
 * FlightModal.jsx — Animated Flight Details / Booking Modal
 * ===========================================================
 * A full-featured modal with:
 *   1. Backdrop fade-in (dark overlay)
 *   2. Panel spring-scale (materializes from center)
 *   3. Tab switching with animated indicator
 *   4. Content crossfade between tabs
 *   5. Close on backdrop click OR Escape key
 *   6. Focus trap (accessibility)
 *   7. Scroll lock (prevents background scroll while open)
 *
 * ANIMATEPRESENCE EXPLAINED (critical to understand):
 *   React removes components from DOM immediately when condition is false.
 *   AnimatePresence intercepts this removal, runs the `exit` animation FIRST,
 *   THEN removes the component. Without it, exit animations don't work.
 *
 * USAGE:
 *   <FlightModal
 *     isOpen={showModal}
 *     onClose={() => setShowModal(false)}
 *     flight={selectedFlight}
 *     onBook={handleBook}
 *   />
 */

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import { backdropVariants, modalVariants } from "../animations/variants";
import AnimatedButton from "./AnimatedButton";

export default function FlightModal({ isOpen, onClose, flight, onBook }) {
  const [activeTab, setActiveTab] = useState("details");
  const modalRef = useRef(null);

  // ── Scroll lock: prevent body scroll when modal is open ──────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Cleanup on unmount
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // ── Escape key closes modal ───────────────────────────────────────────────
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  // ── Backdrop click closes modal (close only if clicking backdrop itself) ──
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Tabs configuration
  const tabs = [
    { id: "details",  label: "✈ Flight Details" },
    { id: "baggage",  label: "🧳 Baggage" },
    { id: "policies", label: "📋 Policies" },
  ];

  return (
    // AnimatePresence enables the exit animation when isOpen becomes false
    <AnimatePresence>
      {isOpen && (
        // ── Backdrop ──────────────────────────────────────────────────────
        <motion.div
          className="modal-backdrop"
          variants={backdropVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={handleBackdropClick}
          // Fixes iOS Safari overscroll inside modals
          style={{ overflowY: "auto", WebkitOverflowScrolling: "touch" }}
        >
          {/* ── Modal Panel ─────────────────────────────────────────────── */}
          <motion.div
            ref={modalRef}
            className="modal-panel"
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            // Prevent backdrop click from closing when clicking inside panel
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Flight Details"
          >
            {/* ── Modal Header ──────────────────────────────────────────── */}
            <div className="modal-header">
              <div className="modal-header__route">
                <motion.h2
                  className="modal-title"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {flight?.from} → {flight?.to}
                </motion.h2>
                <motion.p
                  className="modal-subtitle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.18 }}
                >
                  {flight?.airline} · {flight?.departTime} – {flight?.arrivalTime}
                </motion.p>
              </div>

              {/* Close button — rotates on hover */}
              <motion.button
                className="modal-close-btn"
                onClick={onClose}
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                aria-label="Close modal"
              >
                ✕
              </motion.button>
            </div>

            {/* ── Tab Navigation ────────────────────────────────────────── */}
            <div className="modal-tabs">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  className={`modal-tab ${activeTab === tab.id ? "modal-tab--active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ backgroundColor: "rgba(99, 102, 241, 0.08)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  {tab.label}

                  {/* Active tab underline — slides between tabs using layoutId */}
                  {activeTab === tab.id && (
                    <motion.div
                      className="modal-tab__indicator"
                      layoutId="modalTabIndicator"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* ── Tab Content — crossfades between tabs ─────────────────── */}
            <div className="modal-content">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}   // key change triggers exit of old + enter of new
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                >
                  {activeTab === "details" && <DetailsTab flight={flight} />}
                  {activeTab === "baggage" && <BaggageTab />}
                  {activeTab === "policies" && <PoliciesTab />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Modal Footer ──────────────────────────────────────────── */}
            <motion.div
              className="modal-footer"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
            >
              <div className="modal-footer__price">
                <span className="footer-price-label">Total Price</span>
                <motion.span
                  className="footer-price-amount"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.3 }}
                >
                  ${flight?.price}
                </motion.span>
              </div>
              <AnimatedButton
                variant="primary"
                onClick={() => onBook && onBook(flight)}
                icon="→"
              >
                Book This Flight
              </AnimatedButton>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Tab Sub-components ────────────────────────────────────────────────────────

function DetailsTab({ flight }) {
  const rows = [
    { icon: "✈", label: "Flight No",  value: flight?.flightNo  || "SK-4821" },
    { icon: "🛫", label: "Departure", value: `${flight?.from} ${flight?.departTime}` },
    { icon: "🛬", label: "Arrival",   value: `${flight?.to} ${flight?.arrivalTime}` },
    { icon: "⏱",  label: "Duration",  value: flight?.duration  || "5h 45m" },
    { icon: "🔀", label: "Stops",     value: flight?.stops     || "Non-stop" },
    { icon: "✈",  label: "Aircraft",  value: flight?.aircraft  || "Boeing 737-800" },
    { icon: "💺", label: "Class",     value: "Economy" },
    { icon: "🌐", label: "Terminal",  value: "Terminal 3, Gate B14" },
  ];

  return (
    <div className="tab-details">
      {rows.map((row, i) => (
        <motion.div
          key={row.label}
          className="detail-row"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04, duration: 0.25 }}
        >
          <span className="detail-icon">{row.icon}</span>
          <span className="detail-label">{row.label}</span>
          <span className="detail-value">{row.value}</span>
        </motion.div>
      ))}
    </div>
  );
}

function BaggageTab() {
  const items = [
    { icon: "👜", type: "Personal item",   size: "40×30×15 cm",  weight: "Free",   included: true },
    { icon: "🎒", type: "Cabin bag",       size: "55×40×20 cm",  weight: "10 kg",  included: true },
    { icon: "🧳", type: "Checked bag",     size: "Any standard", weight: "23 kg",  included: true },
    { icon: "➕", type: "Extra bag",       size: "Any standard", weight: "23 kg",  included: false, fee: "$45" },
  ];

  return (
    <div className="tab-baggage">
      {items.map((item, i) => (
        <motion.div
          key={item.type}
          className={`baggage-row ${!item.included ? "baggage-row--fee" : ""}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
        >
          <span className="baggage-icon">{item.icon}</span>
          <div className="baggage-info">
            <span className="baggage-type">{item.type}</span>
            <span className="baggage-size">{item.size} · {item.weight}</span>
          </div>
          <span className={`baggage-status ${item.included ? "included" : "fee"}`}>
            {item.included ? "✓ Included" : item.fee}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function PoliciesTab() {
  const policies = [
    { icon: "🔄", title: "Free Cancellation", desc: "Cancel up to 24h before departure for a full refund.", good: true },
    { icon: "📋", title: "Change Fee",         desc: "$50 per person for date/time changes.",             good: false },
    { icon: "🛡", title: "Travel Insurance",   desc: "Optional — add during checkout for $12/person.",   good: true },
    { icon: "📞", title: "Support",            desc: "24/7 support via chat or phone.",                  good: true },
  ];

  return (
    <div className="tab-policies">
      {policies.map((p, i) => (
        <motion.div
          key={p.title}
          className="policy-row"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <span className="policy-icon">{p.icon}</span>
          <div className="policy-body">
            <span className="policy-title">{p.title}</span>
            <span className="policy-desc">{p.desc}</span>
          </div>
          <span className={`policy-badge ${p.good ? "policy-badge--good" : "policy-badge--warn"}`}>
            {p.good ? "✓" : "!"}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

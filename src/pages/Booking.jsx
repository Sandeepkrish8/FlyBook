/**
 * Booking.jsx — Seat Selection & Booking Confirmation Page
 * ==========================================================
 * Final step in the booking flow. Contains:
 *   - Booking summary card (flight details recap)
 *   - SeatSelection interactive component
 *   - Passenger form
 *   - Animated confirmation screen
 */

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";
import SeatSelection from "../components/SeatSelection";
import AnimatedButton from "../components/AnimatedButton";
import { successVariants, staggerContainer, staggerItem } from "../animations/variants";

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const flight = location.state?.flight || {
    airline: "SkyAir", from: "NYC", to: "LAX",
    departTime: "06:30", arrivalTime: "09:15", price: 299,
  };

  const [step, setStep] = useState(1);          // 1=seat, 2=details, 3=confirm
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  // Fake booking reference
  const BOOKING_REF = "SK-" + Math.random().toString(36).slice(2, 8).toUpperCase();

  const handleSeatSelect = (seats) => {
    setSelectedSeat(seats[0]);
    // Auto-advance to step 2 after a short delay so success animation plays
    setTimeout(() => setStep(2), 600);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1800)); // simulate API
    setIsSubmitting(false);
    setBookingComplete(true);
    setStep(3);
  };

  // ── Step indicator ────────────────────────────────────────────────────────
  const steps = ["Select Seat", "Your Details", "Confirmation"];

  return (
    <AnimatedPage>
      <main className="booking-page">

        {/* ── Back + Breadcrumb ──────────────────────────────────── */}
        <motion.div
          className="booking-header"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

          {/* Step indicators with animated active dot */}
          <div className="step-indicators">
            {steps.map((s, i) => (
              <div key={s} className={`step-item ${step === i + 1 ? "step-item--active" : step > i + 1 ? "step-item--done" : ""}`}>
                <motion.div
                  className="step-dot"
                  animate={step === i + 1
                    ? { scale: [1, 1.3, 1], backgroundColor: "#6366f1" }
                    : step > i + 1
                    ? { backgroundColor: "#22c55e" }
                    : { backgroundColor: "#374151" }
                  }
                  transition={{ duration: 0.4 }}
                >
                  {step > i + 1 ? "✓" : i + 1}
                </motion.div>
                <span className="step-label">{s}</span>
                {i < steps.length - 1 && (
                  <motion.div
                    className="step-connector"
                    animate={{ scaleX: step > i + 1 ? 1 : 0 }}
                    style={{ originX: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Flight Summary Card ────────────────────────────────── */}
        <motion.div
          className="booking-summary-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 220, damping: 28 }}
        >
          <div className="summary-flight-info">
            <span className="summary-airline">{flight.airline}</span>
            <div className="summary-route">
              <span className="summary-time">{flight.departTime}</span>
              <div className="summary-track">
                <motion.div
                  className="summary-progress"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                  style={{ originX: 0 }}
                />
                <span className="summary-plane">✈</span>
              </div>
              <span className="summary-time">{flight.arrivalTime}</span>
            </div>
            <div className="summary-airports">
              <span>{flight.from}</span>
              <span>{flight.to}</span>
            </div>
          </div>
          <motion.div
            className="summary-price"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.25 }}
          >
            ${flight.price}
          </motion.div>
        </motion.div>

        {/* ── Step Content (AnimatePresence for cross-fade transitions) ── */}
        <AnimatePresence mode="wait">

          {/* STEP 1: Seat Selection */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <SeatSelection onSeatSelect={handleSeatSelect} />
            </motion.div>
          )}

          {/* STEP 2: Passenger Details Form */}
          {step === 2 && (
            <motion.div
              key="step2"
              className="passenger-form-section"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="section-title">Passenger Details</h2>
              <motion.form
                className="passenger-form"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                onSubmit={handleConfirmBooking}
              >
                {[
                  { label: "First Name",    type: "text",  placeholder: "John",            name: "firstName" },
                  { label: "Last Name",     type: "text",  placeholder: "Doe",             name: "lastName" },
                  { label: "Email",         type: "email", placeholder: "john@email.com",  name: "email" },
                  { label: "Phone",         type: "tel",   placeholder: "+1 555 000 0000", name: "phone" },
                  { label: "Passport No",   type: "text",  placeholder: "AB1234567",       name: "passport" },
                  { label: "Date of Birth", type: "date",  placeholder: "",                name: "dob" },
                ].map((field) => (
                  <motion.div key={field.name} className="pax-field" variants={staggerItem}>
                    <label className="pax-label">{field.label}</label>
                    <motion.input
                      className="pax-input"
                      type={field.type}
                      placeholder={field.placeholder}
                      name={field.name}
                      required
                      whileFocus={{
                        boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.35)",
                        scale: 1.01,
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    />
                  </motion.div>
                ))}

                <motion.div className="form-footer" variants={staggerItem}>
                  <p className="selected-seat-note">
                    Seat: <strong>{selectedSeat?.id || "Not selected"}</strong>
                  </p>
                  <AnimatedButton
                    type="submit"
                    variant="primary"
                    icon="→"
                    disabled={isSubmitting}
                    fullWidth
                  >
                    {isSubmitting ? "Confirming…" : "Confirm Booking"}
                  </AnimatedButton>
                </motion.div>
              </motion.form>
            </motion.div>
          )}

          {/* STEP 3: Booking Confirmed */}
          {step === 3 && bookingComplete && (
            <motion.div
              key="step3"
              className="confirmation-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Success animation: scale-in checkmark with radial glow */}
              <motion.div
                className="confirm-icon-wrapper"
                variants={successVariants}
                initial="initial"
                animate="animate"
              >
                <motion.div
                  className="confirm-glow"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                />
                <div className="confirm-icon">✓</div>
              </motion.div>

              <motion.h2
                className="confirm-title"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
              >
                Booking Confirmed!
              </motion.h2>

              <motion.p
                className="confirm-sub"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Your tickets are on their way to your inbox.
              </motion.p>

              {/* Ticket card — the most satisfying reveal */}
              <motion.div
                className="confirm-ticket"
                initial={{ opacity: 0, y: 30, rotateX: -15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 25 }}
                style={{ perspective: 800 }}
              >
                <div className="ticket-header">
                  <span className="ticket-airline">{flight.airline}</span>
                  <span className="ticket-ref">{BOOKING_REF}</span>
                </div>
                <div className="ticket-route">
                  <div className="ticket-city">
                    <span className="ticket-code">{flight.from}</span>
                    <span className="ticket-time">{flight.departTime}</span>
                  </div>
                  <span className="ticket-plane">✈</span>
                  <div className="ticket-city ticket-city--right">
                    <span className="ticket-code">{flight.to}</span>
                    <span className="ticket-time">{flight.arrivalTime}</span>
                  </div>
                </div>
                <div className="ticket-footer">
                  <div className="ticket-meta">
                    <span className="meta-label">Seat</span>
                    <span className="meta-value">{selectedSeat?.id || "Auto-assign"}</span>
                  </div>
                  <div className="ticket-meta">
                    <span className="meta-label">Class</span>
                    <span className="meta-value">Economy</span>
                  </div>
                  <div className="ticket-meta">
                    <span className="meta-label">Price</span>
                    <span className="meta-value">${flight.price}</span>
                  </div>
                </div>
                {/* Dashed perforation line */}
                <div className="ticket-tear" />
                <div className="ticket-barcode">
                  {Array.from({ length: 30 }, (_, i) => (
                    <motion.div
                      key={i}
                      className="barcode-bar"
                      style={{ height: `${Math.random() * 24 + 12}px` }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.8 + i * 0.02, duration: 0.2 }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                className="confirm-actions"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <AnimatedButton variant="primary" onClick={() => navigate("/")} icon="→">
                  Book Another Flight
                </AnimatedButton>
                <AnimatedButton variant="ghost" onClick={() => window.print()}>
                  Download Ticket
                </AnimatedButton>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </AnimatedPage>
  );
}

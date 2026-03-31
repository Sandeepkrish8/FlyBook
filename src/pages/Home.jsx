/**
 * Home.jsx - Flat Travel Landing Page
 * =====================================
 * Design: dark navy (#0a1628) + teal accent (#00c9a7)
 * Hero: split layout - airplane illustration LEFT, search form card RIGHT
 *
 * ANIMATION STRATEGY:
 *   - Framer Motion: above-the-fold hero (entrance animations, floating elements)
 *   - GSAP ScrollTrigger: all below-fold sections
 *
 * HOW GSAP ScrollTrigger WORKS (inline comments on each trigger):
 *   ScrollTrigger.create() attaches a watcher to a DOM element.
 *   When the element crosses a scroll threshold it starts/scrubs a tween.
 *   "scrub: N" ties playhead position to scrollbar position (N = smoothing lag).
 *   "toggleActions: play none none reverse" = play forward on enter, rewind on scroll-back.
 *   gsap.context() scopes all animations so ctx.revert() cleans them on unmount.
 */

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedPage from "../components/AnimatedPage";
import SearchForm from "../components/SearchForm";

gsap.registerPlugin(ScrollTrigger);

// ── Data ─────────────────────────────────────────────────────────────────────
const POPULAR_ROUTES = [
  { from: "NYC", to: "LAX", price: 199, emoji: "🗽", label: "New York → LA",     tagline: "Entertainment capital" },
  { from: "LHR", to: "CDG", price: 89,  emoji: "🗼", label: "London → Paris",    tagline: "City of light" },
  { from: "DXB", to: "SIN", price: 429, emoji: "🌆", label: "Dubai → Singapore", tagline: "Garden city vibes" },
  { from: "JFK", to: "MIA", price: 149, emoji: "🌴", label: "New York → Miami",  tagline: "Sun & sand getaway" },
  { from: "SFO", to: "NRT", price: 689, emoji: "⛩",  label: "SF → Tokyo",        tagline: "Tech meets tradition" },
  { from: "SYD", to: "BKK", price: 320, emoji: "🏝", label: "Sydney → Bangkok",  tagline: "Tropical paradise" },
];

const STATS = [
  { value: "2M+",  label: "Happy Travelers", icon: "😊" },
  { value: "500+", label: "Airlines",        icon: "✈" },
  { value: "190+", label: "Countries",       icon: "🌍" },
  { value: "4.9★", label: "App Rating",      icon: "⭐" },
];

const WHY_ITEMS = [
  { icon: "⚡", title: "Instant Search",  body: "Get results across 500+ airlines in under 2 seconds." },
  { icon: "🔒", title: "Secure Booking", body: "Bank-grade encryption — your data is always protected." },
  { icon: "💸", title: "Best Price",     body: "Price match guarantee. We refund any difference found." },
  { icon: "🎧", title: "24/7 Support",   body: "Real humans, not bots. Available by chat or phone." },
];

const TESTIMONIALS = [
  { name: "Sarah K.",  role: "Frequent Flyer",   quote: "Booked 14 flights this year — SkyBook saved me $800+. The UI is insanely smooth." },
  { name: "James L.",  role: "Business Traveler", quote: "The seat selection is the best I've seen in any travel app. Feels like magic." },
  { name: "Priya M.",  role: "Adventure Seeker",  quote: "Found a $89 London-Paris ticket in 3 taps. Couldn't believe it. 10/10." },
];

// ── Airplane SVG ──────────────────────────────────────────────────────────────
function AirplaneSVG() {
  return (
    <svg viewBox="0 0 520 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-plane-svg">
      {/* clouds */}
      <ellipse cx="60"  cy="280" rx="55" ry="30" fill="white" opacity="0.9"/>
      <ellipse cx="100" cy="268" rx="45" ry="28" fill="white" opacity="0.9"/>
      <ellipse cx="30"  cy="275" rx="35" ry="22" fill="white" opacity="0.95"/>
      <ellipse cx="400" cy="300" rx="70" ry="32" fill="white" opacity="0.8"/>
      <ellipse cx="450" cy="288" rx="55" ry="26" fill="white" opacity="0.85"/>
      {/* fuselage */}
      <path d="M85 175 Q130 145 220 140 L380 158 Q430 165 440 175 Q430 185 380 192 L220 210 Q130 205 85 175Z" fill="white"/>
      {/* windows */}
      <circle cx="210" cy="168" r="9" fill="#b3d9f5"/>
      <circle cx="235" cy="166" r="9" fill="#b3d9f5"/>
      <circle cx="260" cy="165" r="9" fill="#b3d9f5"/>
      <circle cx="285" cy="165" r="9" fill="#b3d9f5"/>
      <circle cx="310" cy="166" r="9" fill="#b3d9f5"/>
      <circle cx="335" cy="168" r="9" fill="#b3d9f5"/>
      {/* nose */}
      <path d="M380 158 Q450 163 470 175 Q450 187 380 192Z" fill="#c8e8fa"/>
      <path d="M400 168 Q430 165 450 175 Q430 183 400 182Z" fill="#80c4ee"/>
      {/* main wing */}
      <path d="M240 185 L260 240 L340 230 L320 175Z" fill="#c5e2f5"/>
      <path d="M240 185 L260 240 L270 238 L252 182Z" fill="#aecfe8"/>
      {/* tail fins */}
      <path d="M102 175 L90 130 L130 155 Z" fill="#c5e2f5"/>
      <path d="M90 175 L80 196 L140 185 L130 172Z" fill="#d5edf8"/>
      {/* engine */}
      <ellipse cx="290" cy="218" rx="28" ry="11" fill="#daeffe"/>
      <ellipse cx="290" cy="218" rx="22" ry="8"  fill="#c0dcef"/>
      <ellipse cx="265" cy="218" rx="8"  ry="11" fill="#a0c8e0"/>
      {/* teal accent stripe */}
      <path d="M250 187 L268 237 L275 235 L258 185Z" fill="#00c9a7" opacity="0.7"/>
      {/* location pin 1 yellow */}
      <circle cx="130" cy="115" r="14" fill="#f1c40f"/>
      <path d="M130 115 L130 140" stroke="#f1c40f" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="130" cy="108" r="6" fill="white"/>
      {/* location pin 2 red */}
      <circle cx="390" cy="90" r="14" fill="#e74c3c"/>
      <path d="M390 90 L390 115" stroke="#e74c3c" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="390" cy="83" r="6" fill="white"/>
      {/* dotted flight path */}
      <path d="M145 120 Q260 50 375 96" stroke="#00c9a7" strokeWidth="2.5" strokeDasharray="8 6" fill="none" opacity="0.8"/>
      {/* floating dots */}
      <circle cx="80"  cy="200" r="7" fill="#00c9a7" opacity="0.6"/>
      <circle cx="460" cy="230" r="10" fill="#3498db" opacity="0.5"/>
      <circle cx="200" cy="60"  r="6" fill="#f1c40f" opacity="0.7"/>
    </svg>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate();

  const statsRef        = useRef(null);
  const destRef         = useRef(null);
  const whyRef          = useRef(null);
  const testimonialsRef = useRef(null);

  // ── GSAP ScrollTrigger ─────────────────────────────────────────────────────
  useEffect(() => {
    // gsap.context() scopes all created animations to these elements.
    // ctx.revert() on cleanup kills ScrollTriggers + reverts tweened values.
    const ctx = gsap.context(() => {

      // 1. STATS BAR ---------------------------------------------------------
      // .stat-item cards slide up 60px and fade in, staggered 120ms apart.
      // Trigger fires when stats section top edge enters 85% of viewport height.
      gsap.from(".stat-item", {
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 85%",          // the top of stats hits 85% down the viewport
          end: "top 40%",
          toggleActions: "play none none reverse",
          // "play none none reverse":
          //   on enter    -> play forward
          //   on leave    -> do nothing
          //   on re-enter -> do nothing
          //   on re-leave -> play backward (rewind)
        },
        y: 60,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
      });

      // 2. DESTINATIONS — scrub cascade --------------------------------------
      // Cards float in tied to scroll speed (scrub: 1.2 = 1.2s smoothing lag).
      // scrolling down = animate forward, scrolling up = animate backward.
      gsap.from(".route-card", {
        scrollTrigger: {
          trigger: destRef.current,
          start: "top 80%",
          end: "bottom 40%",
          scrub: 1.2,               // ties playhead to scroll position
        },
        y: 80,
        opacity: 0,
        scale: 0.92,
        stagger: { each: 0.08, from: "start" },
        ease: "power2.out",
      });

      // Section header sweeps from left
      gsap.from(".dest-header", {
        scrollTrigger: {
          trigger: destRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        x: -60,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      // 3. WHY SECTION — alternating left/right slides -----------------------
      // Even-indexed cards slide from left, odd from right (zigzag effect).
      // Each card gets its own ScrollTrigger so staggering is natural.
      const whyCards = whyRef.current?.querySelectorAll(".why-card");
      whyCards?.forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
          x: i % 2 === 0 ? -60 : 60,  // left on even index, right on odd
          y: 30,
          opacity: 0,
          duration: 0.75,
          ease: "power3.out",
        });
      });

      gsap.from(".why-title-main", {
        scrollTrigger: { trigger: whyRef.current, start: "top 85%", toggleActions: "play none none reverse" },
        y: -40,
        opacity: 0,
        duration: 0.7,
        ease: "back.out(1.7)",
      });

      // 4. TESTIMONIALS — scrub scale + opacity reveal -----------------------
      // A GSAP timeline is pinned to scroll so each card "unfolds" as you
      // scroll through 400px of the testimonials section.
      // scrub: 1.5 = animation lags 1.5s behind the scroll bar for smooth feel.
      if (testimonialsRef.current) {
        const cards = testimonialsRef.current.querySelectorAll(".testimonial-card");
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: testimonialsRef.current,
            start: "top 60%",
            end: "+=400",   // play the whole timeline over 400px of scroll
            scrub: 1.5,
          },
        });
        cards.forEach((card, i) => {
          // position offset "i * 0.3" staggers start times inside timeline
          tl.from(card, { opacity: 0, scale: 0.88, y: 40, duration: 0.6, ease: "power2.out" }, i * 0.3);
        });
      }

    }); // end gsap.context

    return () => ctx.revert(); // kill all ScrollTriggers on unmount
  }, []);

  const handleSearch = (searchData) => {
    navigate("/results", { state: searchData });
  };

  return (
    <AnimatedPage>
      <main className="home">

        {/* ══ HERO — split: illustration LEFT / form RIGHT ════════════════ */}
        <section className="hero-travel">
          <div className="hero-blob hero-blob--1" />
          <div className="hero-blob hero-blob--2" />

          <div className="hero-travel__inner">

            {/* LEFT: headline + illustration */}
            <div className="hero-travel__left">
              <motion.div
                className="hero-tag"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 26 }}
              >
                ✈ Best flight deals 2026
              </motion.div>

              <motion.h1
                className="hero-travel__headline"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                It&apos;s time
                <br />
                <span className="headline-accent">to travel!</span>
              </motion.h1>

              <motion.p
                className="hero-travel__sub"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
              >
                Compare thousands of flights.<br />Book in seconds. No hidden fees.
              </motion.p>

              <motion.div
                className="hero-badges"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.45 }}
              >
                {["500+ Airlines", "190 Countries", "Free Cancellation"].map((b) => (
                  <span key={b} className="hero-badge">{b}</span>
                ))}
              </motion.div>

              {/* Airplane illustration — springs in from left */}
              <motion.div
                className="hero-illustration"
                initial={{ opacity: 0, x: -80, rotate: -8 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 75, damping: 18 }}
              >
                <AirplaneSVG />

                {/* Floating pin decorations */}
                <motion.div
                  className="float-pin float-pin--yellow"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                >📍</motion.div>

                <motion.div
                  className="float-pin float-pin--red"
                  animate={{ y: [0, -12, 0] }}
                  transition={{ repeat: Infinity, duration: 2.0, ease: "easeInOut", delay: 0.6 }}
                >📍</motion.div>

                <motion.div
                  className="float-orb"
                  animate={{ y: [0, -8, 0], scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.3 }}
                />
              </motion.div>
            </div>

            {/* RIGHT: search form card */}
            <motion.div
              className="hero-travel__right"
              initial={{ opacity: 0, x: 60, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.35, type: "spring", stiffness: 130, damping: 22 }}
            >
              <div className="hero-form-card">
                <div className="hero-form-card__header">
                  <h2 className="hero-form-card__title">Find Your Flight</h2>
                  <p className="hero-form-card__sub">Search and compare in seconds</p>
                </div>
                <SearchForm onSearch={handleSearch} compact />
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div className="scroll-indicator" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
            <motion.div className="scroll-dot" animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }} />
          </motion.div>
        </section>

        {/* ══ STATS BAR — GSAP: slide-up stagger ══════════════════════════ */}
        <section className="stats-bar" ref={statsRef}>
          {STATS.map((stat) => (
            <div className="stat-item" key={stat.label}>
              <span className="stat-icon">{stat.icon}</span>
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </section>

        {/* ══ DESTINATIONS — GSAP: scrub cascade ══════════════════════════ */}
        <section className="destinations" ref={destRef}>
          <div className="dest-header section-header">
            <h2 className="section-title">Popular Routes</h2>
            <p className="section-sub">Handpicked deals updated every hour</p>
          </div>
          <div className="destinations-grid">
            {POPULAR_ROUTES.map((route) => (
              <motion.div
                key={route.label}
                className="route-card"
                whileHover={{ y: -6, scale: 1.03, boxShadow: "0 16px 48px rgba(0,201,167,0.2)",
                              transition: { type: "spring", stiffness: 400, damping: 22 } }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/results", { state: { from: route.from, to: route.to } })}
                style={{ cursor: "pointer" }}
              >
                <span className="route-card__image">{route.emoji}</span>
                <div className="route-card__body">
                  <span className="route-card__label">{route.label}</span>
                  <span className="route-card__tagline">{route.tagline}</span>
                </div>
                <div className="route-card__price">
                  <span className="from-label">from</span>
                  <span className="route-price">${route.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ══ WHY SKYBOOK — GSAP: alternating left/right slides ═══════════ */}
        <section className="why-section" ref={whyRef}>
          <h2 className="section-title why-title-main" style={{ textAlign: "center" }}>Why SkyBook?</h2>
          <p className="section-sub" style={{ textAlign: "center", marginBottom: "40px" }}>Millions of travelers choose us every year</p>
          <div className="why-grid">
            {WHY_ITEMS.map((item) => (
              <motion.div key={item.title} className="why-card"
                whileHover={{ y: -5, boxShadow: "0 12px 40px rgba(0,201,167,0.18)" }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
              >
                <motion.span className="why-icon"
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                >{item.icon}</motion.span>
                <h3 className="why-title">{item.title}</h3>
                <p className="why-body">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ══ TESTIMONIALS — GSAP: scrub scale+opacity reveal ═════════════ */}
        <section className="testimonials-section" ref={testimonialsRef}>
          <h2 className="section-title" style={{ textAlign: "center" }}>Travelers Love SkyBook</h2>
          <p className="section-sub" style={{ textAlign: "center", marginBottom: "40px" }}>Real reviews from real people</p>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="testimonial-card">
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-quote">"{t.quote}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.name.charAt(0)}</div>
                  <div>
                    <span className="author-name">{t.name}</span>
                    <span className="author-role">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CTA BANNER ══════════════════════════════════════════════════ */}
        <section className="cta-banner">
          <motion.div className="cta-banner__inner"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h2 className="cta-banner__title">Ready to take off?</h2>
            <p className="cta-banner__sub">Join 2 million travelers already using SkyBook</p>
            <motion.button className="cta-banner__btn"
              onClick={() => navigate("/results")}
              whileHover={{ scale: 1.06, filter: "brightness(1.1)" }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            >
              Search Flights Now →
            </motion.button>
          </motion.div>
        </section>

      </main>
    </AnimatedPage>
  );
}

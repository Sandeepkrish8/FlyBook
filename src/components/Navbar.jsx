/**
 * Navbar.jsx — Animated Navigation Header
 * =========================================
 * Features:
 *   - Slides down on page load
 *   - Background blur appears on scroll (glassmorphism)
 *   - Active link animated underline (layoutId)
 *   - Mobile menu slides down
 */

import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // useScroll tracks the page scroll position
  const { scrollY } = useScroll();

  // As page scrolls from 0→80px, background opacity goes from 0→1
  // This creates the "frosted glass" effect that appears on scroll
  const navBg = useTransform(scrollY, [0, 80], ["rgba(10,22,40,0)", "rgba(10,22,40,0.88)"]);
  const navBlur = useTransform(scrollY, [0, 80], ["blur(0px)", "blur(20px)"]);
  const navBorder = useTransform(scrollY, [0, 80], ["rgba(0,201,167,0)", "rgba(0,201,167,0.15)"]);

  const navLinks = [
    { path: "/",        label: "Home" },
    { path: "/results", label: "Reservations" },
    { path: "/booking", label: "Details" },
  ];

  const authLinks = [
    { path: "/login",  label: "Sign In" },
    { path: "/signup", label: "Sign Up" },
  ];

  return (
    <motion.nav
      className="navbar"
      // Slides down from above on page load
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 28, delay: 0.1 }}
      style={{
        backgroundColor: navBg,
        backdropFilter: navBlur,
        WebkitBackdropFilter: navBlur, // Safari support
        borderBottom: `1px solid`,
        borderColor: navBorder,
      }}
    >
      <div className="navbar__inner">
        {/* Logo */}
        <motion.div
          className="navbar__logo"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link to="/">
            <motion.span
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              ✈ SkyBook
            </motion.span>
          </Link>
        </motion.div>

        {/* Desktop links */}
        <div className="navbar__links">
          {navLinks.map((link) => (
            <motion.div
              key={link.path}
              className={`navbar__link-wrap ${pathname === link.path ? "navbar__link-wrap--active" : ""}`}
              whileHover={{ scale: 1.03 }}
            >
              <Link to={link.path} className="navbar__link">
                {link.label}
              </Link>
              {/* Animated underline slides between active links */}
              {pathname === link.path && (
                <motion.div
                  className="navbar__active-bar"
                  layoutId="navActiveBar"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Auth buttons — Sign In / Sign Up */}
        <div className="navbar__auth">
          <motion.div whileHover={{ scale: 1.03 }}>
            <Link
              to="/login"
              className={`navbar__auth-signin ${pathname === "/login" ? "navbar__auth-signin--active" : ""}`}
            >
              Sign In
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
            <Link
              to="/signup"
              className="navbar__auth-signup"
            >
              Sign Up
            </Link>
          </motion.div>
        </div>

        {/* Mobile hamburger */}
        <motion.button
          className="navbar__hamburger"
          onClick={() => setMobileOpen((o) => !o)}
          whileTap={{ scale: 0.9 }}
        >
          <motion.span
            className="hamburger-line"
            animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.span
            className="hamburger-line"
            animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="hamburger-line"
            animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
          />
        </motion.button>
      </div>

      {/* Mobile dropdown menu */}
      <motion.div
        className="navbar__mobile-menu"
        initial={false}
        animate={mobileOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        style={{ overflow: "hidden" }}
      >
        {navLinks.map((link, i) => (
          <motion.div
            key={link.path}
            initial={{ opacity: 0, x: -12 }}
            animate={mobileOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
            transition={{ delay: i * 0.06 }}
          >
            <Link
              to={link.path}
              className="navbar__mobile-link"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          </motion.div>
        ))}
        {/* Mobile auth links */}
        {authLinks.map((link, i) => (
          <motion.div
            key={link.path}
            initial={{ opacity: 0, x: -12 }}
            animate={mobileOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
            transition={{ delay: (navLinks.length + i) * 0.06 }}
          >
            <Link
              to={link.path}
              className={`navbar__mobile-link ${link.path === "/signup" ? "navbar__mobile-link--accent" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.nav>
  );
}

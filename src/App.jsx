/**
 * App.jsx — Root Router with Animated Page Transitions
 * ======================================================
 * This is where page transitions are wired together.
 *
 * THE CRITICAL SETUP:
 *
 * 1. `useLocation()` gives us the current route path
 * 2. We pass `location.key` as the `key` prop to <Routes>
 *    → Every time the route changes, `key` changes
 *    → React unmounts the old <Routes> and mounts a new one
 *    → AnimatePresence intercepts the unmount → plays exit animation
 *    → Then mounts the new Routes → plays enter animation
 *
 * 3. `AnimatePresence mode="wait"`:
 *    "wait" → exit animation FINISHES before enter animation starts
 *    (vs "sync" where they play simultaneously — can look cluttered)
 *
 * COMMON MISTAKE:
 *   Putting AnimatePresence INSIDE Routes (inside the route components) breaks it.
 *   AnimatePresence must be the PARENT of the thing that's being animated away.
 */

import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import Results from "./pages/Results";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ToastProvider } from "./components/Toast";

export default function App() {
  // Get current location — its `.key` changes on every route change
  const location = useLocation();

  return (
    <ToastProvider>
      {/* Navbar sits outside transitions — it's always visible */}
      <Navbar />

      {/*
        AnimatePresence wraps Routes.
        `mode="wait"` ensures old page exits before new page enters.
        `initial={false}` prevents the animation from playing on first load
       (the page is already visible, no need to animate in from nothing).
      */}
      <AnimatePresence mode="wait" initial={false}>
        {/*
          KEY IS CRITICAL: passing `location.key` forces React to treat
          each route change as a different component, enabling exit animations.
        */}
        <Routes location={location} key={location.key}>
          <Route path="/"        element={<Home />} />
          <Route path="/results" element={<Results />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/login"   element={<Login />} />
          <Route path="/signup"  element={<SignUp />} />
        </Routes>
      </AnimatePresence>

      <Footer />
    </ToastProvider>
  );
}

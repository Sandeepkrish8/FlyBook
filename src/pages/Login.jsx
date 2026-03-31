/**
 * Login.jsx — Flight-Themed Login Page
 * =======================================
 * GSAP Animations:
 *  - Plane flies from left → right across the sky background
 *  - Clouds drift slowly across the scene
 *  - Stars twinkle using GSAP stagger + repeat
 *  - Form card + fields stagger-fade in from below on mount
 *  - Submit button "takeoff" shake then fly animation on click
 *  - Contrail trail follows the plane
 */

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import AnimatedPage from "../components/AnimatedPage";

export default function Login() {
  const navigate = useNavigate();

  // Scene refs
  const sceneRef      = useRef(null);
  const planeRef      = useRef(null);
  const contrailRef   = useRef(null);
  const cloud1Ref     = useRef(null);
  const cloud2Ref     = useRef(null);
  const cloud3Ref     = useRef(null);
  const starsRef      = useRef([]);

  // Form refs
  const cardRef       = useRef(null);
  const titleRef      = useRef(null);
  const subtitleRef   = useRef(null);
  const field1Ref     = useRef(null);
  const field2Ref     = useRef(null);
  const btnRef        = useRef(null);
  const linkRef       = useRef(null);

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // ── GSAP Scene Animations ────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Plane flies across from left to right, looping endlessly
      gsap.set(planeRef.current, { x: -120, y: 0 });
      gsap.to(planeRef.current, {
        x: "110vw",
        y: -40,
        duration: 12,
        ease: "none",
        repeat: -1,
        delay: 0.5,
        onRepeat: () => gsap.set(planeRef.current, { x: -120, y: 0 }),
      });

      // 2. Contrail fades in and expands behind the plane
      gsap.set(contrailRef.current, { opacity: 0, scaleX: 0, transformOrigin: "left center" });
      gsap.to(contrailRef.current, {
        opacity: 0.35,
        scaleX: 1,
        duration: 2,
        delay: 1,
        ease: "power2.out",
      });

      // 3. Clouds drift continuously
      const cloudTl = gsap.timeline({ repeat: -1 });

      gsap.set(cloud1Ref.current, { x: -200 });
      gsap.to(cloud1Ref.current, {
        x: "110vw",
        duration: 30,
        ease: "none",
        repeat: -1,
        delay: 0,
      });

      gsap.set(cloud2Ref.current, { x: -300 });
      gsap.to(cloud2Ref.current, {
        x: "110vw",
        duration: 40,
        ease: "none",
        repeat: -1,
        delay: 8,
      });

      gsap.set(cloud3Ref.current, { x: -150 });
      gsap.to(cloud3Ref.current, {
        x: "110vw",
        duration: 22,
        ease: "none",
        repeat: -1,
        delay: 15,
      });

      // 4. Stars twinkle with stagger
      if (starsRef.current.length > 0) {
        gsap.to(starsRef.current, {
          opacity: 0.1,
          duration: 1.5,
          stagger: { each: 0.3, repeat: -1, yoyo: true, from: "random" },
          ease: "sine.inOut",
        });
      }
    }, sceneRef);

    return () => ctx.revert();
  }, []);

  // ── GSAP Form Entrance Animations ───────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = [
        titleRef.current,
        subtitleRef.current,
        field1Ref.current,
        field2Ref.current,
        btnRef.current,
        linkRef.current,
      ];

      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out", delay: 0.2 }
      );

      gsap.fromTo(
        els,
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.45,
        }
      );
    });

    return () => ctx.revert();
  }, []);

  // ── Submit Handler ────────────────────────────────────────────────────────
  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);

    // Runway shake → then takeoff animation on the button
    gsap.timeline()
      .to(btnRef.current, { x: -6, duration: 0.06, ease: "power1.inOut" })
      .to(btnRef.current, { x: 6,  duration: 0.06, ease: "power1.inOut" })
      .to(btnRef.current, { x: -4, duration: 0.05 })
      .to(btnRef.current, { x: 0,  duration: 0.05 })
      .to(btnRef.current, { y: -3, scale: 1.04, duration: 0.25, ease: "power2.out" })
      .to(btnRef.current, { y: 0,  scale: 1,    duration: 0.2,  ease: "bounce.out" });

    // Simulate auth and navigate
    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 1600);
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <AnimatedPage>
      <div className="auth-page" ref={sceneRef}>

        {/* ── Sky Scene ── */}
        <div className="auth-sky">
          {/* Stars */}
          {Array.from({ length: 60 }).map((_, i) => (
            <span
              key={i}
              className="auth-star"
              ref={(el) => { starsRef.current[i] = el; }}
              style={{
                left:  `${Math.random() * 100}%`,
                top:   `${Math.random() * 70}%`,
                width:  `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
                opacity: 0.6 + Math.random() * 0.4,
              }}
            />
          ))}

          {/* Clouds */}
          <div className="auth-cloud auth-cloud--1" ref={cloud1Ref}>
            <CloudSVG />
          </div>
          <div className="auth-cloud auth-cloud--2" ref={cloud2Ref}>
            <CloudSVG />
          </div>
          <div className="auth-cloud auth-cloud--3" ref={cloud3Ref}>
            <CloudSVG small />
          </div>

          {/* Plane + Contrail */}
          <div className="auth-plane-wrap" ref={planeRef}>
            <div className="auth-contrail" ref={contrailRef} />
            <PlaneSVG />
          </div>

          {/* Horizon glow */}
          <div className="auth-horizon" />
        </div>

        {/* ── Form Card ── */}
        <div className="auth-center">
          <div className="auth-card" ref={cardRef}>
            {/* Logo */}
            <div className="auth-logo">
              <span className="auth-logo__icon">✈</span>
              <span className="auth-logo__text">SkyBook</span>
            </div>

            <div ref={titleRef}>
              <h1 className="auth-title">Welcome back</h1>
            </div>
            <div ref={subtitleRef}>
              <p className="auth-subtitle">Sign in to manage your flights</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div
                ref={field1Ref}
                className={`auth-field ${focusedField === "email" ? "auth-field--focused" : ""}`}
              >
                <label className="auth-field__label" htmlFor="login-email">
                  Email address
                </label>
                <div className="auth-field__inner">
                  <span className="auth-field__icon">✉</span>
                  <input
                    id="login-email"
                    type="email"
                    className="auth-field__input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div
                ref={field2Ref}
                className={`auth-field ${focusedField === "password" ? "auth-field--focused" : ""}`}
              >
                <div className="auth-field__label-row">
                  <label className="auth-field__label" htmlFor="login-password">
                    Password
                  </label>
                  <button type="button" className="auth-forgot">Forgot password?</button>
                </div>
                <div className="auth-field__inner">
                  <span className="auth-field__icon">🔒</span>
                  <input
                    id="login-password"
                    type="password"
                    className="auth-field__input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                ref={btnRef}
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="auth-btn-loading">
                    <span className="auth-btn-plane">✈</span> Taking off…
                  </span>
                ) : (
                  "Sign In  ✈"
                )}
              </button>
            </form>

            {/* Sign up link */}
            <p ref={linkRef} className="auth-switch">
              New to SkyBook?{" "}
              <Link to="/signup" className="auth-switch__link">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PlaneSVG() {
  return (
    <svg
      className="auth-plane-svg"
      viewBox="0 0 80 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fuselage */}
      <path
        d="M8 20 Q20 13 38 12 L62 18 Q70 20 72 20 Q70 22 62 22 L38 28 Q20 27 8 20Z"
        fill="white"
      />
      {/* Nose cone */}
      <path
        d="M62 18 Q74 19 76 20 Q74 21 62 22Z"
        fill="#c8e8fa"
      />
      {/* Main wing */}
      <path
        d="M28 18 L18 6 L24 6 L42 18Z"
        fill="#e2f3fc"
      />
      <path
        d="M28 22 L18 34 L24 34 L42 22Z"
        fill="#e2f3fc"
      />
      {/* Tail fin */}
      <path
        d="M12 18 L6 10 L10 10 L16 18Z"
        fill="#e2f3fc"
      />
      <path
        d="M12 22 L6 30 L10 30 L16 22Z"
        fill="#e2f3fc"
      />
      {/* Windows */}
      <circle cx="46" cy="19" r="2.2" fill="#b3d9f5" />
      <circle cx="52" cy="19" r="2.2" fill="#b3d9f5" />
      <circle cx="58" cy="19" r="2.2" fill="#b3d9f5" />
    </svg>
  );
}

function CloudSVG({ small = false }) {
  const scale = small ? 0.65 : 1;
  return (
    <svg
      className="auth-cloud-svg"
      viewBox="0 0 160 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `scale(${scale})`, transformOrigin: "left center" }}
    >
      <ellipse cx="55"  cy="50" rx="50" ry="24" fill="white" opacity="0.18" />
      <ellipse cx="88"  cy="40" rx="42" ry="28" fill="white" opacity="0.22" />
      <ellipse cx="120" cy="52" rx="38" ry="20" fill="white" opacity="0.15" />
      <ellipse cx="30"  cy="54" rx="28" ry="16" fill="white" opacity="0.12" />
    </svg>
  );
}

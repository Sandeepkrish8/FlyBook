/**
 * SignUp.jsx — Flight-Themed Sign Up Page
 * =========================================
 * GSAP Animations:
 *  - Multiple planes fly across at different altitudes + speeds
 *  - Clouds drift at parallax layers
 *  - Stars twinkle in the upper sky
 *  - Runway dots animate upward (launch sequence)
 *  - Form fields stagger in from the right
 *  - Submit button launches (scale up → shoots upward on click)
 *  - Progress ring animates during loading state
 */

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import AnimatedPage from "../components/AnimatedPage";

export default function SignUp() {
  const navigate = useNavigate();

  // Scene refs
  const sceneRef    = useRef(null);
  const plane1Ref   = useRef(null);
  const plane2Ref   = useRef(null);
  const cloud1Ref   = useRef(null);
  const cloud2Ref   = useRef(null);
  const cloud3Ref   = useRef(null);
  const runwayRef   = useRef(null);
  const starsRef    = useRef([]);

  // Form refs
  const cardRef     = useRef(null);
  const titleRef    = useRef(null);
  const subRef      = useRef(null);
  const nameRef     = useRef(null);
  const emailRef    = useRef(null);
  const passRef     = useRef(null);
  const confirmRef  = useRef(null);
  const btnRef      = useRef(null);
  const linkRef     = useRef(null);

  // State
  const [fullName, setFullName]       = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [confirm, setConfirm]         = useState("");
  const [loading, setLoading]         = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // ── GSAP Scene Animations ────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Plane 1 — main altitude, standard speed
      gsap.set(plane1Ref.current, { x: -100, y: 10 });
      gsap.to(plane1Ref.current, {
        x: "110vw",
        y: -20,
        duration: 14,
        ease: "none",
        repeat: -1,
        delay: 1,
        onRepeat: () => gsap.set(plane1Ref.current, { x: -100, y: 10 }),
      });

      // Plane 2 — lower altitude, slower (distant feel)
      gsap.set(plane2Ref.current, { x: -80, y: 0, scale: 0.55, opacity: 0.65 });
      gsap.to(plane2Ref.current, {
        x: "110vw",
        y: 15,
        duration: 22,
        ease: "none",
        repeat: -1,
        delay: 6,
        onRepeat: () => gsap.set(plane2Ref.current, { x: -80, y: 0 }),
      });

      // Clouds — three layers at different speeds (parallax depth)
      gsap.set(cloud1Ref.current, { x: -240 });
      gsap.to(cloud1Ref.current, {
        x: "115vw", duration: 35, ease: "none", repeat: -1, delay: 0,
        onRepeat: () => gsap.set(cloud1Ref.current, { x: -240 }),
      });

      gsap.set(cloud2Ref.current, { x: -180 });
      gsap.to(cloud2Ref.current, {
        x: "115vw", duration: 50, ease: "none", repeat: -1, delay: 10,
        onRepeat: () => gsap.set(cloud2Ref.current, { x: -180 }),
      });

      gsap.set(cloud3Ref.current, { x: -120 });
      gsap.to(cloud3Ref.current, {
        x: "115vw", duration: 28, ease: "none", repeat: -1, delay: 18,
        onRepeat: () => gsap.set(cloud3Ref.current, { x: -120 }),
      });

      // Stars twinkle
      if (starsRef.current.length > 0) {
        gsap.to(starsRef.current, {
          opacity: 0.08,
          duration: 1.8,
          stagger: { each: 0.25, repeat: -1, yoyo: true, from: "random" },
          ease: "sine.inOut",
        });
      }

      // Runway dots pulse upward in sequence (launch atmosphere)
      if (runwayRef.current) {
        const dots = runwayRef.current.querySelectorAll(".runway-dot");
        gsap.to(dots, {
          opacity: 1,
          y: -6,
          duration: 0.4,
          stagger: { each: 0.15, repeat: -1, yoyo: true },
          ease: "power1.inOut",
        });
      }
    }, sceneRef);

    return () => ctx.revert();
  }, []);

  // ── GSAP Form Entrance ───────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, x: 40, scale: 0.97 },
        { opacity: 1, x: 0, scale: 1, duration: 0.65, ease: "power3.out", delay: 0.15 }
      );

      const els = [
        titleRef.current,
        subRef.current,
        nameRef.current,
        emailRef.current,
        passRef.current,
        confirmRef.current,
        btnRef.current,
        linkRef.current,
      ];

      gsap.fromTo(
        els,
        { opacity: 0, x: 18 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.07,
          ease: "power2.out",
          delay: 0.35,
        }
      );
    });

    return () => ctx.revert();
  }, []);

  // ── Submit ────────────────────────────────────────────────────────────────
  function handleSubmit(e) {
    e.preventDefault();
    if (!fullName || !email || !password || !confirm) return;
    if (password !== confirm) return;

    setLoading(true);

    // Launch sequence: scale up → shoot upward
    gsap.timeline()
      .to(btnRef.current, {
        scale: 1.06,
        duration: 0.18,
        ease: "power1.out",
      })
      .to(btnRef.current, {
        y: -8,
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
      })
      .to(btnRef.current, {
        y: 0,
        scale: 1,
        duration: 0.35,
        ease: "elastic.out(1, 0.5)",
      });

    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 1800);
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <AnimatedPage>
      <div className="auth-page auth-page--signup" ref={sceneRef}>

        {/* ── Sky Scene ── */}
        <div className="auth-sky">
          {/* Stars */}
          {Array.from({ length: 50 }).map((_, i) => (
            <span
              key={i}
              className="auth-star"
              ref={(el) => { starsRef.current[i] = el; }}
              style={{
                left:  `${Math.random() * 100}%`,
                top:   `${Math.random() * 65}%`,
                width:  `${1 + Math.random() * 2.5}px`,
                height: `${1 + Math.random() * 2.5}px`,
                opacity: 0.5 + Math.random() * 0.5,
              }}
            />
          ))}

          {/* Clouds */}
          <div className="auth-cloud auth-cloud--1" ref={cloud1Ref}>
            <CloudSVG />
          </div>
          <div className="auth-cloud auth-cloud--2" ref={cloud2Ref}>
            <CloudSVG small />
          </div>
          <div className="auth-cloud auth-cloud--3" ref={cloud3Ref}>
            <CloudSVG />
          </div>

          {/* Planes */}
          <div className="auth-plane-wrap auth-plane-wrap--main"  ref={plane1Ref}><PlaneSVG /></div>
          <div className="auth-plane-wrap auth-plane-wrap--small" ref={plane2Ref}><PlaneSVG /></div>

          {/* Horizon glow */}
          <div className="auth-horizon auth-horizon--orange" />

          {/* Runway dots at bottom */}
          <div className="auth-runway" ref={runwayRef}>
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="runway-dot" />
            ))}
          </div>
        </div>

        {/* ── Form Card ── */}
        <div className="auth-center">
          <div className="auth-card auth-card--wide" ref={cardRef}>

            {/* Logo */}
            <div className="auth-logo">
              <span className="auth-logo__icon">✈</span>
              <span className="auth-logo__text">SkyBook</span>
            </div>

            <div ref={titleRef}>
              <h1 className="auth-title">Create your account</h1>
            </div>
            <div ref={subRef}>
              <p className="auth-subtitle">Join millions of travellers worldwide</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              {/* Full Name */}
              <div
                ref={nameRef}
                className={`auth-field ${focusedField === "name" ? "auth-field--focused" : ""}`}
              >
                <label className="auth-field__label" htmlFor="signup-name">Full name</label>
                <div className="auth-field__inner">
                  <span className="auth-field__icon">👤</span>
                  <input
                    id="signup-name"
                    type="text"
                    className="auth-field__input"
                    placeholder="Jane Smith"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div
                ref={emailRef}
                className={`auth-field ${focusedField === "email" ? "auth-field--focused" : ""}`}
              >
                <label className="auth-field__label" htmlFor="signup-email">Email address</label>
                <div className="auth-field__inner">
                  <span className="auth-field__icon">✉</span>
                  <input
                    id="signup-email"
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

              {/* Two-column password row */}
              <div className="auth-form-row">
                <div
                  ref={passRef}
                  className={`auth-field ${focusedField === "pass" ? "auth-field--focused" : ""}`}
                >
                  <label className="auth-field__label" htmlFor="signup-pass">Password</label>
                  <div className="auth-field__inner">
                    <span className="auth-field__icon">🔒</span>
                    <input
                      id="signup-pass"
                      type="password"
                      className="auth-field__input"
                      placeholder="Min 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField("pass")}
                      onBlur={() => setFocusedField(null)}
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>

                <div
                  ref={confirmRef}
                  className={`auth-field ${focusedField === "confirm" ? "auth-field--focused" : ""}`}
                >
                  <label className="auth-field__label" htmlFor="signup-confirm">Confirm password</label>
                  <div className="auth-field__inner">
                    <span className="auth-field__icon">🔑</span>
                    <input
                      id="signup-confirm"
                      type="password"
                      className="auth-field__input"
                      placeholder="Repeat password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      onFocus={() => setFocusedField("confirm")}
                      onBlur={() => setFocusedField(null)}
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password mismatch hint */}
              {confirm && password !== confirm && (
                <p className="auth-error">Passwords do not match</p>
              )}

              {/* Submit */}
              <button
                ref={btnRef}
                type="submit"
                className="auth-submit-btn auth-submit-btn--launch"
                disabled={loading || (confirm.length > 0 && password !== confirm)}
              >
                {loading ? (
                  <span className="auth-btn-loading">
                    <span className="auth-btn-plane">✈</span> Preparing for takeoff…
                  </span>
                ) : (
                  "Create Account  🚀"
                )}
              </button>
            </form>

            {/* Login link */}
            <p ref={linkRef} className="auth-switch">
              Already have an account?{" "}
              <Link to="/login" className="auth-switch__link">
                Sign in
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
      <path d="M8 20 Q20 13 38 12 L62 18 Q70 20 72 20 Q70 22 62 22 L38 28 Q20 27 8 20Z" fill="white" />
      <path d="M62 18 Q74 19 76 20 Q74 21 62 22Z" fill="#c8e8fa" />
      <path d="M28 18 L18 6 L24 6 L42 18Z"  fill="#e2f3fc" />
      <path d="M28 22 L18 34 L24 34 L42 22Z" fill="#e2f3fc" />
      <path d="M12 18 L6 10 L10 10 L16 18Z"  fill="#e2f3fc" />
      <path d="M12 22 L6 30 L10 30 L16 22Z"  fill="#e2f3fc" />
      <circle cx="46" cy="19" r="2.2" fill="#b3d9f5" />
      <circle cx="52" cy="19" r="2.2" fill="#b3d9f5" />
      <circle cx="58" cy="19" r="2.2" fill="#b3d9f5" />
    </svg>
  );
}

function CloudSVG({ small = false }) {
  const scale = small ? 0.6 : 1;
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

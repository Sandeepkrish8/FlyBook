import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const FOOTER_LINKS = {
  Company:  ["About Us", "Careers", "Press", "Blog"],
  Support:  ["Help Center", "Contact Us", "Privacy Policy", "Terms"],
  Product:  ["How It Works", "Pricing", "Partnerships", "Affiliates"],
  Destinations: ["Europe", "Asia", "Americas", "Middle East"],
};

const SOCIALS = [
  { icon: "𝕏",  label: "Twitter" },
  { icon: "in", label: "LinkedIn" },
  { icon: "f",  label: "Facebook" },
  { icon: "▶",  label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">

        {/* Brand column */}
        <div className="footer__brand">
          <Link to="/" className="footer__logo">✈ SkyBook</Link>
          <p className="footer__tagline">
            The smartest way to find and book flights. Compare 500+ airlines in seconds.
          </p>

          {/* Social links */}
          <div className="footer__socials">
            {SOCIALS.map((s) => (
              <motion.a
                key={s.label}
                href="#"
                className="footer__social-btn"
                aria-label={s.label}
                whileHover={{ scale: 1.12, color: "#00c9a7" }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                {s.icon}
              </motion.a>
            ))}
          </div>

          {/* App badges */}
          <div className="footer__app-badges">
            <motion.div className="app-badge" whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400 }}>
              <span className="app-badge__icon">🍎</span>
              <div>
                <span className="app-badge__sub">Download on the</span>
                <span className="app-badge__title">App Store</span>
              </div>
            </motion.div>
            <motion.div className="app-badge" whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400 }}>
              <span className="app-badge__icon">▶</span>
              <div>
                <span className="app-badge__sub">Get it on</span>
                <span className="app-badge__title">Google Play</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(FOOTER_LINKS).map(([section, links], colIdx) => (
          <motion.div
            key={section}
            className="footer__col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: colIdx * 0.08, duration: 0.45 }}
          >
            <h4 className="footer__col-title">{section}</h4>
            <ul className="footer__col-links">
              {links.map((link) => (
                <li key={link}>
                  <motion.a
                    href="#"
                    className="footer__col-link"
                    whileHover={{ x: 4, color: "#00c9a7" }}
                    transition={{ duration: 0.15 }}
                  >
                    {link}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <div className="footer__bottom-inner">
          <span className="footer__copy">© 2026 SkyBook. All rights reserved.</span>
          <div className="footer__bottom-links">
            {["Privacy", "Terms", "Cookies", "Sitemap"].map((l) => (
              <a key={l} href="#" className="footer__bottom-link">{l}</a>
            ))}
          </div>
          <div className="footer__currencies">
            <span className="currency-badge">🇺🇸 USD</span>
            <span className="currency-badge">🌐 EN</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

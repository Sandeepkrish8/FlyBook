/**
 * variants.js — Central Animation Library
 * =========================================
 * All Framer Motion animation variants live here.
 *
 * WHY A CENTRAL FILE?
 * - Single source of truth: change one value → entire app updates
 * - Keeps component files clean and readable
 * - Easy to A/B test animations by swapping variant objects
 *
 * FRAMER MOTION CORE CONCEPTS (plain English):
 * --------------------------------------------
 * `initial`  → the state BEFORE the animation plays (hidden, small, offset)
 * `animate`  → the state AFTER the animation plays (visible, full size, in place)
 * `exit`     → the state WHEN the component is removed from the DOM
 * `transition` → HOW the animation moves (duration, easing, spring physics)
 *
 * EASING GUIDE:
 * "easeOut"       → starts fast, ends slow  → great for things entering screens
 * "easeIn"        → starts slow, ends fast  → great for things leaving screens
 * "easeInOut"     → slow-fast-slow          → smooth, polished feel (Apple-style)
 * spring {stiffness, damping} → physics-based bounce → organic, alive feeling
 */

// ─────────────────────────────────────────────────────────
// SECTION 1: PAGE TRANSITIONS
// Used to animate entire pages in/out when routes change.
// ─────────────────────────────────────────────────────────

/**
 * Fade + slight upward slide: the most universally polished transition.
 * Apple.com, Airbnb, Linear.app all use this pattern.
 *
 * BEFORE → page is invisible (opacity:0) and 24px below its final position
 * AFTER  → page is fully visible and at its natural position
 */
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 24,          // starts 24px below final position
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.25, 0.46, 0.45, 0.94], // custom cubic-bezier: "easeOutQuart" — very silky
      when: "beforeChildren",          // parent finishes entering BEFORE children animate
      staggerChildren: 0.08,           // each child animates 80ms after the previous one
    },
  },
  exit: {
    opacity: 0,
    y: -16, // exits upward (feels like page is leaving to make room)
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

/**
 * Horizontal slide — useful for step-based flows (Search → Results → Booking)
 * Feels like a native mobile app navigation.
 */
export const slidePageVariants = {
  initial: { opacity: 0, x: 60 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    x: -60,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};


// ─────────────────────────────────────────────────────────
// SECTION 2: STAGGER CONTAINERS
// When you have a LIST of items, stagger makes each item
// animate one after another instead of all at once.
// ─────────────────────────────────────────────────────────

/**
 * Wrap a list with this to get staggered child animations.
 * The parent itself is invisible; it just orchestrates children.
 */
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,    // 100ms gap between each child's entrance
      delayChildren: 0.05,     // small delay before the very first child
    },
  },
  exit: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

/**
 * Each CHILD in a stagger list uses this variant.
 * Fades in + slides up from 20px below.
 */
export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
};


// ─────────────────────────────────────────────────────────
// SECTION 3: CARD ANIMATIONS
// Flight cards, result cards — the most interactive component.
// ─────────────────────────────────────────────────────────

/**
 * Card entrance animation: rises from below with a subtle fade.
 * Each card in a list should use `staggerItem` INSIDE a `staggerContainer`.
 */
export const cardVariants = {
  initial: { opacity: 0, y: 30, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1], // "backOut" easing — tiny overshoot = alive feel
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

/**
 * Card HOVER state — used in the `whileHover` prop directly on <motion.div>.
 * Scale + shadow lift = premium card interaction (used by Stripe, Airbnb).
 *
 * NOTE: whileHover variants don't need initial/animate/exit structure.
 * They are just the target state to animate TO on hover.
 */
export const cardHover = {
  scale: 1.025,
  y: -4,
  boxShadow: "0 20px 60px rgba(99, 102, 241, 0.18), 0 8px 24px rgba(0,0,0,0.12)",
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 20,  // lower damping = more springy/bouncy
  },
};

/**
 * Card TAP/PRESS state — used in `whileTap`.
 * Slight scale-down gives physical "press" feedback.
 */
export const cardTap = {
  scale: 0.98,
  transition: { type: "spring", stiffness: 600, damping: 30 },
};


// ─────────────────────────────────────────────────────────
// SECTION 4: BUTTON ANIMATIONS
// ─────────────────────────────────────────────────────────

/**
 * Primary button hover: subtle lift + brightness boost.
 * Feel like glass lifting off the surface.
 */
export const buttonHover = {
  scale: 1.04,
  filter: "brightness(1.08)",
  transition: { type: "spring", stiffness: 500, damping: 18 },
};

/**
 * Button tap: physical press-down feel.
 */
export const buttonTap = {
  scale: 0.95,
  filter: "brightness(0.96)",
  transition: { type: "spring", stiffness: 700, damping: 25 },
};


// ─────────────────────────────────────────────────────────
// SECTION 5: MODAL ANIMATIONS
// Modals need to feel like they materialize from the center.
// ─────────────────────────────────────────────────────────

/**
 * Backdrop (dark overlay behind modal).
 * Fades in quickly to focus user attention.
 */
export const backdropVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, delay: 0.1, ease: "easeIn" },
    // delay: wait for modal to leave first, then fade backdrop
  },
};

/**
 * Modal panel: scales up from 94% → 100% with a fade.
 * The scale source point is "center" by default.
 */
export const modalVariants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    y: 30,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 28,
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 20,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};


// ─────────────────────────────────────────────────────────
// SECTION 6: SCROLL-REVEAL ANIMATIONS
// Elements reveal as user scrolls. Uses whileInView.
// ─────────────────────────────────────────────────────────

/**
 * Reveal from below: the standard scroll animation used everywhere.
 * viewport.once:true → only plays once (not on scroll back up)
 */
export const revealVariants = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

/**
 * Reveal from left: for left-aligned content blocks.
 */
export const revealFromLeft = {
  initial: { opacity: 0, x: -40 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/**
 * Reveal from right: for right-aligned content blocks.
 */
export const revealFromRight = {
  initial: { opacity: 0, x: 40 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/**
 * Scale reveal: for stats, numbers, featured cards — draws the eye.
 */
export const scaleReveal = {
  initial: { opacity: 0, scale: 0.85 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
};


// ─────────────────────────────────────────────────────────
// SECTION 7: FORM ANIMATIONS
// Search inputs, dropdowns, form containers.
// ─────────────────────────────────────────────────────────

/**
 * Form container entrance: slides down into view.
 */
export const formVariants = {
  initial: { opacity: 0, y: -20, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1],
      staggerChildren: 0.06,
    },
  },
};

/**
 * Individual form field entrance (used as stagger child).
 */
export const formFieldVariant = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

/**
 * Input focus glow — applied as a layout animation on the border wrapper.
 * Use `layoutId` for smooth layout transitions in form rearrangements.
 */
export const inputFocusVariant = {
  rest: { scale: 1, boxShadow: "0 0 0 2px transparent" },
  focus: {
    scale: 1.01,
    boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.4)",
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },
};


// ─────────────────────────────────────────────────────────
// SECTION 8: SEAT SELECTION ANIMATIONS
// Individual seat cell states: available, selected, taken.
// ─────────────────────────────────────────────────────────

/**
 * Seat entrance in a staggered grid.
 */
export const seatVariants = {
  initial: { opacity: 0, scale: 0.6 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 22,
    },
  },
};

/**
 * Seat selection confirmation burst: scale up then settle.
 */
export const seatSelectVariant = {
  unselected: { scale: 1 },
  selected: {
    scale: [1, 1.35, 1.15, 1.2],   // keyframes array: pop → settle
    rotate: [0, -8, 4, 0],          // slight wiggle reinforces the action
    transition: {
      duration: 0.45,
      times: [0, 0.3, 0.7, 1],
    },
  },
};


// ─────────────────────────────────────────────────────────
// SECTION 9: SKELETON / LOADING
// ─────────────────────────────────────────────────────────

/**
 * Container for skeleton screen: fades out when content loads.
 */
export const skeletonContainerVariants = {
  loading: { opacity: 1 },
  loaded: {
    opacity: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};


// ─────────────────────────────────────────────────────────
// SECTION 10: UTILITY / MICRO INTERACTIONS
// ─────────────────────────────────────────────────────────

/**
 * Notification / toast: slides in from top, exits up.
 */
export const toastVariants = {
  initial: { opacity: 0, y: -60, scale: 0.9 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 400, damping: 28 },
  },
  exit: {
    opacity: 0,
    y: -40,
    scale: 0.9,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

/**
 * Icon spin (for loading indicators, refresh buttons).
 */
export const spinTransition = {
  repeat: Infinity,
  ease: "linear",
  duration: 1,
};

/**
 * Pulse animation (for live price indicators, status dots).
 * Used with animate={{ scale: [1, 1.15, 1] }} on a motion.div.
 */
export const pulseAnimation = {
  animate: {
    scale: [1, 1.12, 1],
    opacity: [1, 0.75, 1],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: "easeInOut",
    },
  },
};

/**
 * Checkmark success animation: scale in after form success.
 */
export const successVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 16,
    },
  },
};

/**
 * Number counter roll-in (for price displays).
 */
export const priceReveal = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

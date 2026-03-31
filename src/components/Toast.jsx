import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Context ──────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

// ── Icons by type ─────────────────────────────────────────────────────────────
const ICONS = {
  success: "✓",
  error:   "✕",
  warning: "⚠",
  info:    "ℹ",
};

// ── Individual Toast ──────────────────────────────────────────────────────────
function Toast({ id, type = "info", title, message, onDismiss }) {
  return (
    <motion.div
      className={`toast toast--${type}`}
      layout
      initial={{ opacity: 0, x: 80, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.88, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
    >
      <span className="toast__icon">{ICONS[type]}</span>
      <div className="toast__body">
        {title && <span className="toast__title">{title}</span>}
        {message && <span className="toast__message">{message}</span>}
      </div>
      <motion.button
        className="toast__close"
        onClick={() => onDismiss(id)}
        whileHover={{ scale: 1.15, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.15 }}
      >
        ✕
      </motion.button>

      {/* Progress bar */}
      <motion.div
        className="toast__progress"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 4, ease: "linear" }}
        style={{ transformOrigin: "left" }}
      />
    </motion.div>
  );
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(({ type = "info", title, message, duration = 4000 }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-4), { id, type, title, message }]);
    if (duration > 0) setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  // Convenience shorthands
  toast.success = (msg, title = "Success")  => toast({ type: "success", title, message: msg });
  toast.error   = (msg, title = "Error")    => toast({ type: "error",   title, message: msg });
  toast.warning = (msg, title = "Warning")  => toast({ type: "warning", title, message: msg });
  toast.info    = (msg, title)              => toast({ type: "info",    title, message: msg });

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Toast stack — fixed bottom-right */}
      <div className="toast-stack" aria-live="polite">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <Toast key={t.id} {...t} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

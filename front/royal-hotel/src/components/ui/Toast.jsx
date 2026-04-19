// ui/Toast.jsx — Système de notifications toast animées
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ICONS = { success: CheckCircle, error: AlertCircle, info: Info };
const COLORS = {
  success: { icon: 'text-emerald-500', bar: 'bg-emerald-500' },
  error:   { icon: 'text-red-400',     bar: 'bg-red-400' },
  info:    { icon: 'text-gold',        bar: 'bg-gold' },
};

function ToastItem({ id, message, type = 'info', onRemove }) {
  const Icon = ICONS[type] || Info;
  const color = COLORS[type] || COLORS.info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.88 }}
      animate={{ opacity: 1, x: 0,  scale: 1 }}
      exit={{    opacity: 0, x: 80, scale: 0.88 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative flex items-start gap-4 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.14)]
                 p-5 min-w-[290px] max-w-[370px] overflow-hidden"
    >
      {/* Barre colorée en bas */}
      <span className={`absolute bottom-0 left-0 h-[3px] w-full ${color.bar} opacity-80`} />
      <Icon size={20} className={`${color.icon} shrink-0 mt-0.5`} />
      <p className="flex-1 font-jost font-light text-sm text-dark leading-relaxed">{message}</p>
      <button
        onClick={() => onRemove(id)}
        className="text-muted hover:text-dark transition-colors duration-200
                   bg-transparent border-none cursor-pointer mt-0.5 shrink-0"
        aria-label="Fermer"
      >
        <X size={13} />
      </button>
    </motion.div>
  );
}

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-6 right-6 z-[2000] flex flex-col-reverse gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem {...t} onRemove={removeToast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 4500) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
    return id;
  }, [removeToast]);

  return { toasts, addToast, removeToast };
}

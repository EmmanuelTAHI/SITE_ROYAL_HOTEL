// ui/FloatingActions.jsx — Boutons flottants : WhatsApp + Réserver
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, CalendarCheck, ChevronUp } from 'lucide-react';
import { HOTEL } from '../../data/constants';

export default function FloatingActions({ onReserve }) {
  const [visible, setVisible]     = useState(false);
  const [showBack, setShowBack]   = useState(false);
  const [showLabel, setShowLabel] = useState('');

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
      setShowBack(window.scrollY > 800);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const phoneRaw = HOTEL.phone.replace(/[\s\-+]/g, '');
  const whatsappHref = `https://wa.me/${phoneRaw}?text=Bonjour%2C%20je%20souhaite%20avoir%20des%20informations%20sur%20une%20r%C3%A9servation.`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed bottom-8 right-6 z-[900] flex flex-col items-end gap-3"
        >
          {/* Back to top */}
          {showBack && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-10 h-10 bg-white border border-gold-light/40 flex items-center justify-center
                         shadow-md hover:border-gold hover:shadow-lg transition-all duration-300"
              aria-label="Retour en haut"
            >
              <ChevronUp size={16} className="text-dark" />
            </motion.button>
          )}

          {/* WhatsApp */}
          <motion.div className="relative flex items-center gap-3">
            <AnimatePresence>
              {showLabel === 'wa' && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="bg-dark text-white text-[10px] tracking-[2px] uppercase font-jost
                             font-medium px-3 py-2 shadow-lg whitespace-nowrap pointer-events-none"
                >
                  WhatsApp
                </motion.span>
              )}
            </AnimatePresence>
            <motion.a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.93 }}
              onMouseEnter={() => setShowLabel('wa')}
              onMouseLeave={() => setShowLabel('')}
              className="w-[52px] h-[52px] rounded-full bg-[#25D366] flex items-center justify-center
                         shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_28px_rgba(37,211,102,0.55)]
                         transition-shadow duration-300"
              aria-label="WhatsApp"
            >
              <MessageCircle size={22} className="text-white" />
            </motion.a>
          </motion.div>

          {/* Réserver */}
          <motion.div className="relative flex items-center gap-3">
            <AnimatePresence>
              {showLabel === 'res' && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="bg-dark text-white text-[10px] tracking-[2px] uppercase font-jost
                             font-medium px-3 py-2 shadow-lg whitespace-nowrap pointer-events-none"
                >
                  Réserver
                </motion.span>
              )}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.93 }}
              onMouseEnter={() => setShowLabel('res')}
              onMouseLeave={() => setShowLabel('')}
              onClick={onReserve}
              className="w-[52px] h-[52px] bg-gold flex items-center justify-center
                         shadow-[0_4px_20px_rgba(205,154,182,0.5)] hover:shadow-[0_6px_28px_rgba(205,154,182,0.65)]
                         transition-shadow duration-300"
              aria-label="Réserver"
            >
              <CalendarCheck size={20} className="text-dark" />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

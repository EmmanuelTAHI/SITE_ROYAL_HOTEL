// components/layout/Navbar.jsx
// Navbar sticky avec effet blur au scroll, hamburger mobile animé
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarCheck } from 'lucide-react';
import { NAV_LINKS } from '../../data/constants';

export default function Navbar({ onReserve }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState('accueil');

  // ── Scroll listener ──────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);

      const sections = NAV_LINKS.map(l => document.getElementById(l.id)).filter(Boolean);
      const active = sections.reduce((prev, curr) => {
        const rect = curr.getBoundingClientRect();
        return rect.top <= 120 ? curr : prev;
      }, sections[0]);
      if (active) setActiveId(active.id);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Smooth scroll ────────────────────────────────────────────────────────
  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  }, []);

  // ── Lock body scroll when menu open ─────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleReserve = useCallback(() => {
    setMenuOpen(false);
    onReserve?.();
  }, [onReserve]);

  return (
    <>
      {/* ──────── DESKTOP NAVBAR ──────── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-500 flex items-center justify-between
          ${scrolled
            ? 'bg-dark/95 backdrop-blur-xl py-3.5 px-8 lg:px-12 border-b border-gold/20'
            : 'bg-transparent py-6 px-8 lg:px-12'
          }`}
      >
        {/* Logo */}
        <button
          onClick={() => scrollTo('accueil')}
          className="flex flex-col items-start gap-0.5 bg-transparent border-none cursor-pointer"
        >
          <span className="font-cormorant text-gold text-xl tracking-[5px] uppercase leading-none font-medium">
            Royal Hotel
          </span>
          <span className="text-white/40 text-[8px] tracking-[4px] uppercase font-jost font-light">
            Grand-Bassam · Côte d'Ivoire
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`nav-link text-[10px] tracking-[2px] transition-colors duration-300
                ${activeId === id ? 'text-gold' : 'text-white/75 hover:text-gold'}`}
            >
              {label}
            </button>
          ))}

          {/* Bouton Réserver → ouvre la MODAL */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleReserve}
            className="btn-gold ml-4 text-[10px] px-7 py-3.5 flex items-center gap-2"
          >
            <CalendarCheck size={13} />
            Réserver
          </motion.button>
        </div>

        {/* Hamburger (mobile) */}
        <button
          className="lg:hidden flex flex-col gap-1.5 bg-transparent border-none cursor-pointer p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Ouvrir le menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-6 h-px bg-gold transition-all duration-300"
              style={{
                transform:
                  menuOpen && i === 0 ? 'rotate(45deg) translate(4px, 4px)'  :
                  menuOpen && i === 2 ? 'rotate(-45deg) translate(4px, -4px)' : 'none',
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </motion.nav>

      {/* ──────── MOBILE MENU OVERLAY ──────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{   opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[998] bg-dark/98 flex flex-col items-center justify-center gap-8"
          >
            {NAV_LINKS.map(({ id, label }, index) => (
              <motion.button
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.07, duration: 0.4 }}
                onClick={() => scrollTo(id)}
                className="bg-transparent border-none cursor-pointer text-white/80 hover:text-gold
                           text-3xl font-cormorant font-light tracking-[4px] transition-colors duration-300"
              >
                {label}
              </motion.button>
            ))}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + NAV_LINKS.length * 0.07, duration: 0.4 }}
              onClick={handleReserve}
              className="btn-gold mt-4 flex items-center gap-2"
            >
              <CalendarCheck size={14} />
              Réserver maintenant
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

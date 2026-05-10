// components/layout/Navbar.jsx
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarCheck, X, Menu } from 'lucide-react';
import { NAV_LINKS } from '../../data/constants';

export default function Navbar({ onReserve }) {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [activeId, setActiveId]   = useState('accueil');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const sections = NAV_LINKS.map(l => document.getElementById(l.id)).filter(Boolean);
      const active = sections.reduce((prev, curr) => {
        return curr.getBoundingClientRect().top <= 120 ? curr : prev;
      }, sections[0]);
      if (active) setActiveId(active.id);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  }, []);

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
      {/* ──────── DESKTOP / SCROLLED NAVBAR ──────── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-500
          flex items-center justify-between
          ${scrolled
            ? 'bg-dark/96 backdrop-blur-xl py-3 px-6 lg:px-12 shadow-[0_1px_0_rgba(205,154,182,0.15)]'
            : 'bg-transparent py-5 px-6 lg:px-12'
          }`}
      >
        {/* ── Logo ── */}
        <button
          onClick={() => scrollTo('accueil')}
          className="flex flex-col items-start gap-0.5 bg-transparent border-none cursor-pointer group"
        >
          <span
            className="font-cormorant text-gold text-xl tracking-[5px] uppercase leading-none font-medium
                       transition-all duration-300 group-hover:text-gold-light"
            style={{ textShadow: scrolled ? 'none' : '0 0 30px rgba(205,154,182,0.6)' }}
          >
            Royal Hotel
          </span>
          <span className="text-white/50 text-[8px] tracking-[3px] uppercase font-jost font-light">
            Grand-Bassam · Côte d'Ivoire
          </span>
        </button>

        {/* ── Desktop links ── */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`nav-link text-[10px] tracking-[2px] transition-all duration-300
                ${activeId === id ? 'text-gold' : 'text-white/80 hover:text-gold'}`}
            >
              {label}
              {activeId === id && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-px bg-gold"
                />
              )}
            </button>
          ))}

          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleReserve}
            className="btn-gold ml-4 text-[10px] px-6 py-3 flex items-center gap-2"
          >
            <CalendarCheck size={12} />
            Réserver
          </motion.button>
        </div>

        {/* ── Hamburger (mobile) ── */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="lg:hidden relative flex items-center justify-center
                     w-11 h-11 rounded-full
                     border border-gold/40 bg-dark/60 backdrop-blur-md
                     cursor-pointer transition-all duration-300
                     hover:bg-gold/20 hover:border-gold/70"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          <AnimatePresence mode="wait" initial={false}>
            {menuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={18} className="text-gold" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={18} className="text-gold" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.nav>

      {/* ──────── MOBILE FULLSCREEN MENU ──────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[998]"
            style={{ background: 'rgba(10,10,10,0.98)' }}
          >
            {/* Top gold line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

            {/* Content centered */}
            <div className="flex flex-col items-center justify-center h-full gap-2 px-8">

              {/* Hotel label */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.4 }}
                className="flex items-center gap-3 mb-10"
              >
                <span className="w-8 h-px bg-gold/40" />
                <span className="font-cormorant text-gold text-sm tracking-[5px] uppercase font-medium">
                  Royal Hotel
                </span>
                <span className="w-8 h-px bg-gold/40" />
              </motion.div>

              {/* Nav links */}
              {NAV_LINKS.map(({ id, label }, index) => (
                <motion.button
                  key={id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ delay: 0.08 + index * 0.07, duration: 0.4, ease: [0.25,0.1,0.25,1] }}
                  onClick={() => scrollTo(id)}
                  className={`relative bg-transparent border-none cursor-pointer py-3 px-6
                             transition-all duration-300 group w-full text-center
                             ${activeId === id ? 'text-gold' : 'text-white/75 hover:text-gold'}`}
                >
                  <span className="font-cormorant text-4xl font-light tracking-[4px]">
                    {label}
                  </span>
                  {activeId === id && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-gold rounded-full" />
                  )}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gold/40
                                   group-hover:w-20 transition-all duration-400" />
                </motion.button>
              ))}

              {/* Reserve button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.08 + NAV_LINKS.length * 0.07, duration: 0.4 }}
                onClick={handleReserve}
                className="btn-gold mt-8 flex items-center gap-2 text-[11px] px-12 py-4"
              >
                <CalendarCheck size={14} />
                Réserver maintenant
              </motion.button>

              {/* Bottom contact */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-white/25 text-[10px] font-jost tracking-[3px] uppercase mt-10"
              >
                +225 07 04 63 63 63
              </motion.p>
            </div>

            {/* Bottom gold line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

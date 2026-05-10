// sections/Testimonials.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { TESTIMONIALS } from '../../data/constants';

const AUTO_PLAY_DURATION = 5000;

export default function Testimonials() {
  const [current,   setCurrent]   = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused,    setPaused]    = useState(false);
  const [progress,  setProgress]  = useState(0);
  const startTime   = useRef(Date.now());
  const rafRef      = useRef(null);
  const total       = TESTIMONIALS.length;

  const go = useCallback((idx) => {
    const next = ((idx % total) + total) % total;
    setDirection(next > current ? 1 : -1);
    setCurrent(next);
    startTime.current = Date.now();
    setProgress(0);
  }, [current, total]);

  const next = useCallback(() => go(current + 1), [current, go]);
  const prev = useCallback(() => go(current - 1), [current, go]);

  // Progress bar + auto-play
  useEffect(() => {
    if (paused) { cancelAnimationFrame(rafRef.current); return; }

    const tick = () => {
      const elapsed = Date.now() - startTime.current;
      const pct     = Math.min(elapsed / AUTO_PLAY_DURATION, 1);
      setProgress(pct);
      if (pct >= 1) {
        next();
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [paused, current, next]);

  const slideVariants = {
    enter:  (d) => ({ opacity: 0, x: d > 0 ? 80 : -80, scale: 0.96 }),
    center: { opacity: 1, x: 0, scale: 1,
              transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
    exit:   (d) => ({ opacity: 0, x: d > 0 ? -80 : 80, scale: 0.96,
                      transition: { duration: 0.4 } }),
  };

  const t = TESTIMONIALS[current];

  return (
    <section
      id="temoignages"
      className="py-32 bg-charcoal overflow-hidden relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { setPaused(false); startTime.current = Date.now() - progress * AUTO_PLAY_DURATION; }}
    >
      {/* Fond décoratif */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold/3 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-gold/5 blur-2xl" />
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10">

        <SectionHeader label="Ils nous font confiance" title="Témoignages" light />

        {/* Icône quote décorative */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: 'spring', stiffness: 120 }}
          className="flex justify-center mb-10"
        >
          <div className="w-16 h-16 rounded-full border border-gold/20 flex items-center justify-center
                          bg-gold/5">
            <Quote size={28} className="text-gold/40" />
          </div>
        </motion.div>

        {/* Zone du slide */}
        <div className="relative min-h-[280px] flex items-center justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full text-center"
            >
              {/* Étoiles */}
              <div className="flex justify-center gap-1.5 mb-8">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, rotate: -30 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.3 }}
                  >
                    <Star size={15} className="text-gold fill-gold" />
                  </motion.div>
                ))}
              </div>

              {/* Texte */}
              <p className="font-cormorant text-white/85 font-light leading-relaxed italic
                            mx-auto max-w-2xl px-4"
                 style={{ fontSize: 'clamp(18px, 2.5vw, 26px)', lineHeight: 1.7 }}>
                "{t.text}"
              </p>

              {/* Auteur */}
              <div className="flex flex-col items-center gap-3 mt-10">
                <motion.div
                  className="relative w-14 h-14 rounded-full bg-gold/15 border-2 border-gold/40
                             flex items-center justify-center"
                  animate={{ boxShadow: ['0 0 0 0 rgba(205,154,182,0.3)', '0 0 0 10px rgba(205,154,182,0)', '0 0 0 0 rgba(205,154,182,0)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="font-cormorant text-gold text-xl font-medium">
                    {t.avatar}
                  </span>
                </motion.div>
                <div>
                  <div className="text-white font-jost font-medium text-sm tracking-wider">
                    {t.name}
                  </div>
                  <div className="text-white/35 font-jost font-light text-xs tracking-[3px] uppercase mt-0.5">
                    {t.country}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Barre de progression */}
        <div className="mt-16 max-w-xs mx-auto">
          <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gold rounded-full origin-left"
              style={{ scaleX: progress }}
              transition={{ duration: 0 }}
            />
          </div>
        </div>

        {/* Contrôles */}
        <div className="flex items-center justify-center gap-8 mt-8">
          <motion.button
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={prev}
            className="w-11 h-11 border border-white/15 flex items-center justify-center
                       text-white/40 hover:text-gold hover:border-gold/50
                       transition-all duration-300 bg-transparent cursor-pointer rounded-full"
            aria-label="Précédent"
          >
            <ChevronLeft size={18} />
          </motion.button>

          {/* Dots */}
          <div className="flex gap-2.5 items-center">
            {TESTIMONIALS.map((_, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => go(i)}
                className={`transition-all duration-300 rounded-full bg-transparent border-none cursor-pointer
                  ${i === current
                    ? 'w-8 h-1.5 bg-gold'
                    : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/50'}`}
                aria-label={`Témoignage ${i + 1}`}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.9 }}
            onClick={next}
            className="w-11 h-11 border border-white/15 flex items-center justify-center
                       text-white/40 hover:text-gold hover:border-gold/50
                       transition-all duration-300 bg-transparent cursor-pointer rounded-full"
            aria-label="Suivant"
          >
            <ChevronRight size={18} />
          </motion.button>
        </div>

        {/* Nombre total */}
        <p className="text-center text-white/20 text-[10px] font-jost tracking-[3px] uppercase mt-6">
          {current + 1} sur {total} témoignages
        </p>

      </div>
    </section>
  );
}

// sections/Testimonials.jsx
// Carousel auto-play d'avis clients avec dots de navigation (NOUVEAU)
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { TESTIMONIALS } from '../../data/constants';

export default function Testimonials() {
  const [current, setCurrent]   = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev
  const total = TESTIMONIALS.length;

  const go = useCallback((idx) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent((idx + total) % total);
  }, [current, total]);

  const next = useCallback(() => go(current + 1), [current, go]);
  const prev = useCallback(() => go(current - 1), [current, go]);

  // Auto-play toutes les 5 secondes
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slideVariants = {
    enter:  (d) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
    exit:   (d) => ({ opacity: 0, x: d > 0 ? -60 : 60, transition: { duration: 0.35 } }),
  };

  const t = TESTIMONIALS[current];

  return (
    <section id="temoignages" className="py-32 bg-charcoal overflow-hidden">
      <div className="max-w-4xl mx-auto px-8 lg:px-12">
        <SectionHeader label="Ils nous font confiance" title="Témoignages" light />

        {/* ── Quote icon ─────────────────────────────────────────────── */}
        <div className="flex justify-center mb-10">
          <Quote size={48} className="text-gold/25" />
        </div>

        {/* ── Slide ──────────────────────────────────────────────────── */}
        <div className="relative min-h-[260px] flex items-center justify-center">
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
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-7">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} className="text-gold fill-gold" />
                ))}
              </div>

              {/* Text */}
              <p className="font-cormorant text-white/85 text-[22px] md:text-[26px] font-light
                            leading-relaxed italic mb-10 mx-auto max-w-2xl">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex flex-col items-center gap-2">
                {/* Avatar initials */}
                <div className="w-12 h-12 rounded-full bg-gold/20 border border-gold/40
                                flex items-center justify-center
                                font-cormorant text-gold text-[18px] font-medium">
                  {t.avatar}
                </div>
                <div className="text-white font-jost font-medium text-sm tracking-wider">
                  {t.name}
                </div>
                <div className="text-white/40 font-jost font-light text-xs tracking-widest">
                  {t.country}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Controls ───────────────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-8 mt-16">
          <button
            onClick={prev}
            className="w-10 h-10 border border-white/20 flex items-center justify-center
                       text-white/50 hover:text-gold hover:border-gold/50
                       transition-all duration-300 bg-transparent cursor-pointer"
            aria-label="Précédent"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Dots */}
          <div className="flex gap-2.5">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={`transition-all duration-300 rounded-full bg-transparent border-none cursor-pointer
                  ${i === current
                    ? 'w-8 h-1.5 bg-gold'
                    : 'w-1.5 h-1.5 bg-white/25 hover:bg-white/50'}`}
                aria-label={`Aller au témoignage ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 border border-white/20 flex items-center justify-center
                       text-white/50 hover:text-gold hover:border-gold/50
                       transition-all duration-300 bg-transparent cursor-pointer"
            aria-label="Suivant"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

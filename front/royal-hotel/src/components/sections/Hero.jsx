// sections/Hero.jsx
import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronDown, Star } from 'lucide-react';
import { IMAGES } from '../../data/constants';

// Floating particles — positions définies statiquement pour éviter hydration mismatch
const PARTICLES = [
  { x: 8,  y: 22, s: 2,   d: 11, delay: 0   },
  { x: 18, y: 68, s: 1.5, d: 14, delay: 1.5 },
  { x: 30, y: 35, s: 3,   d: 9,  delay: 0.5 },
  { x: 42, y: 78, s: 1,   d: 12, delay: 2   },
  { x: 55, y: 18, s: 2.5, d: 10, delay: 0.8 },
  { x: 65, y: 55, s: 1.5, d: 13, delay: 3   },
  { x: 75, y: 30, s: 2,   d: 8,  delay: 1   },
  { x: 85, y: 72, s: 1,   d: 15, delay: 2.5 },
  { x: 92, y: 42, s: 2,   d: 11, delay: 0.3 },
  { x: 12, y: 85, s: 1.5, d: 9,  delay: 4   },
  { x: 48, y: 48, s: 3,   d: 13, delay: 1.2 },
  { x: 78, y: 15, s: 1,   d: 10, delay: 3.5 },
];

// Mots animés dans le tagline
const TAGLINES = [
  "Où l'élégance rencontre le confort",
  "Un séjour inoubliable vous attend",
  "L'hospitalité ivoirienne au plus haut",
];

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function openReservationModal() {
  window.dispatchEvent(new CustomEvent('openReservation', { detail: { room: '' } }));
}

// Animation: chaque mot du titre s'anime séparément
const titleWords = ['Royal', 'Hotel'];

export default function Hero() {
  const heroRef = useRef(null);
  const [taglineIdx, setTaglineIdx] = useState(0);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const y       = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale   = useTransform(scrollYProgress, [0, 0.5], [1, 1.08]);

  // Cycle le tagline toutes les 4s
  useEffect(() => {
    const t = setInterval(() => {
      setTaglineIdx(i => (i + 1) % TAGLINES.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      id="accueil"
      ref={heroRef}
      className="relative h-screen min-h-[640px] overflow-hidden"
    >
      {/* ── Background avec parallax ─── */}
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <img
          src={IMAGES.hero}
          alt="Façade du Royal Hotel à Grand-Bassam"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </motion.div>

      {/* ── Overlays ─── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/45 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />

      {/* ── Particules flottantes ─── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gold"
            style={{
              left: `${p.x}%`,
              top:  `${p.y}%`,
              width:  p.s,
              height: p.s,
              opacity: 0.4,
            }}
            animate={{
              y:       [0, -20, 0],
              opacity: [0.25, 0.65, 0.25],
            }}
            transition={{
              duration: p.d,
              delay:    p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* ── Lignes décoratives verticales ─── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 120, opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.5 }}
          className="absolute top-1/4 left-8 sm:left-12 w-px bg-gradient-to-b from-gold/0 via-gold/50 to-gold/0"
        />
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 120, opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.7 }}
          className="absolute top-1/4 right-8 sm:right-12 w-px bg-gradient-to-b from-gold/0 via-gold/50 to-gold/0"
        />
      </div>

      {/* ── Contenu principal ─── */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
      >
        {/* Badge étoiles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center gap-3 mb-6"
        >
          <span className="w-8 h-px bg-gold/60" />
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.3 }}
              >
                <Star size={9} className="text-gold fill-gold" />
              </motion.div>
            ))}
          </div>
          <span className="w-8 h-px bg-gold/60" />
        </motion.div>

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mb-6"
        >
          <span className="section-label mb-0 text-gold/90 tracking-[6px]">
            Hôtel de Luxe · Grand-Bassam
          </span>
        </motion.div>

        {/* Titre animé mot par mot */}
        <div className="overflow-hidden mb-6">
          <motion.h1
            className="font-cormorant font-light text-white leading-none tracking-[8px] text-shadow-hero"
            style={{ fontSize: 'clamp(56px, 11vw, 120px)' }}
          >
            {titleWords.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.6 + i * 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="inline-block mr-6"
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        {/* Séparateur doré */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.1 }}
          className="flex items-center gap-3 mb-7"
        >
          <span className="w-12 h-px bg-gold/40" />
          <span className="w-1.5 h-1.5 bg-gold/60 rotate-45 block" />
          <span className="w-12 h-px bg-gold/40" />
        </motion.div>

        {/* Tagline animé (texte qui change) */}
        <div className="h-8 flex items-center mb-12 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={taglineIdx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="text-white/70 font-jost font-light tracking-[4px]"
              style={{ fontSize: 'clamp(11px, 1.3vw, 15px)' }}
            >
              {TAGLINES[taglineIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.2 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <motion.button
            className="btn-gold"
            onClick={openReservationModal}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            Réserver maintenant
          </motion.button>
          <motion.button
            className="btn-outline"
            onClick={() => scrollTo('galerie')}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            Découvrir l'hôtel
          </motion.button>
        </motion.div>

        {/* Stats rapides sous les boutons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.5 }}
          className="flex items-center gap-8 mt-12 flex-wrap justify-center"
        >
          {[
            ['14', 'Chambres'],
            ['19+', 'Années'],
            ['98%', 'Satisfaction'],
          ].map(([val, label]) => (
            <div key={label} className="text-center">
              <div className="font-cormorant text-gold font-medium leading-none"
                   style={{ fontSize: 'clamp(20px, 2vw, 26px)' }}>
                {val}
              </div>
              <div className="text-white/40 text-[8px] tracking-[3px] uppercase font-jost mt-1">
                {label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ─── */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        onClick={() => scrollTo('apropos')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2
                   text-white/40 cursor-pointer bg-transparent border-none z-10"
      >
        <span className="text-[8px] tracking-[4px] uppercase font-jost">Défiler</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-gold/60 to-transparent relative"
        >
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-gold/80 rounded-full"
            animate={{ y: [0, 0, 0], opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.button>
    </section>
  );
}

// sections/Hero.jsx
// Hero section plein écran avec parallax, animations d'entrée et scroll indicator
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { IMAGES } from '../../data/constants';

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function openReservationModal() {
  window.dispatchEvent(new CustomEvent('openReservation', { detail: { room: '' } }));
}

export default function Hero() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  // Parallax : image bouge moins vite que le scroll
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <section
      id="accueil"
      ref={heroRef}
      className="relative h-screen min-h-[640px] overflow-hidden"
    >
      {/* ── Background image with parallax ─────────────────────────────── */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <img
          src={IMAGES.hero}
          alt="Façade de l'Hôtel Le Palmier"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </motion.div>

      {/* ── Dark overlay ───────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />

      {/* ── Gold decorative lines ──────────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-8 w-px h-32 bg-gradient-to-b from-gold/0 via-gold/30 to-gold/0" />
        <div className="absolute top-1/4 right-8 w-px h-32 bg-gradient-to-b from-gold/0 via-gold/30 to-gold/0" />
      </div>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="w-8 h-px bg-gold/60" />
          <span className="section-label text-gold mb-0">Hôtel de Luxe</span>
          <span className="w-8 h-px bg-gold/60" />
        </motion.div>

        {/* Hotel name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-cormorant font-light text-white leading-[1.05] tracking-[6px] mb-6"
          style={{ fontSize: 'clamp(60px, 10vw, 110px)' }}
        >
          Royal Hotel
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="text-white/70 font-jost font-light tracking-[4px] mb-14"
          style={{ fontSize: 'clamp(12px, 1.4vw, 16px)' }}
        >
          Où l'élégance rencontre le confort
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <button
            className="btn-gold"
            onClick={openReservationModal}
          >
            Réserver maintenant
          </button>
          <button
            className="btn-outline"
            onClick={() => scrollTo('galerie')}
          >
            Découvrir l'hôtel
          </button>
        </motion.div>
      </div>

      {/* ── Scroll indicator ───────────────────────────────────────────── */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        onClick={() => scrollTo('apropos')}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2
                   text-white/40 cursor-pointer bg-transparent border-none"
      >
        <span className="text-[9px] tracking-[4px] uppercase font-jost">Défiler</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <ChevronDown size={16} className="text-gold/60" />
        </motion.div>
      </motion.button>
    </section>
  );
}

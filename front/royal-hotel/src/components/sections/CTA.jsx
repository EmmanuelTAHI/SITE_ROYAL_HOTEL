// sections/CTA.jsx
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { fadeUpVariants, staggerContainerVariants } from '../../hooks/useScrollAnimation';
import { Shield, Wifi, Tag, Star } from 'lucide-react';

// Particules flottantes pour le fond
const CTA_PARTICLES = [
  { x: 10, y: 20, s: 2,   d: 10, delay: 0   },
  { x: 85, y: 15, s: 1.5, d: 13, delay: 1   },
  { x: 25, y: 75, s: 3,   d: 8,  delay: 2   },
  { x: 70, y: 65, s: 1,   d: 12, delay: 0.5 },
  { x: 50, y: 30, s: 2,   d: 9,  delay: 3   },
  { x: 90, y: 80, s: 1.5, d: 11, delay: 1.5 },
  { x: 15, y: 55, s: 1,   d: 14, delay: 2.5 },
  { x: 60, y: 10, s: 2,   d: 10, delay: 4   },
];

const BADGES = [
  { Icon: Tag,    label: 'Meilleur prix garanti' },
  { Icon: Shield, label: 'Annulation gratuite'   },
  { Icon: Wifi,   label: 'Wi-Fi inclus'          },
  { Icon: Star,   label: 'Service 24h/24'         },
];

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function openReservationModal() {
  window.dispatchEvent(new CustomEvent('openReservation', { detail: { room: '' } }));
}

export default function CTA() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    <section ref={ref} className="relative py-36 bg-dark text-center overflow-hidden">

      {/* ── Fond animé parallax ── */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Cercles concentriques */}
        {[350, 550, 750, 950, 1150].map((size, i) => (
          <motion.div
            key={size}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                       rounded-full border border-gold pointer-events-none"
            style={{ width: size, height: size }}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: [0.10, 0.06, 0.04, 0.025, 0.012][i], scale: 1 }}
            animate={{
              rotate: i % 2 === 0 ? [0, 360] : [360, 0],
            }}
            transition={{
              opacity: { duration: 1.2, delay: i * 0.15 },
              scale:   { duration: 1.2, delay: i * 0.15 },
              rotate:  { duration: 80 + i * 20, repeat: Infinity, ease: 'linear' },
            }}
            viewport={{ once: true }}
          />
        ))}
      </motion.div>

      {/* Glow central */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      w-[500px] h-[500px] bg-gold/4 rounded-full blur-3xl pointer-events-none" />

      {/* Particules flottantes */}
      {CTA_PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gold pointer-events-none"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, opacity: 0.3 }}
          animate={{ y: [0, -18, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: p.d, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* ── Contenu ── */}
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="relative z-10 max-w-2xl mx-auto px-6"
      >
        <motion.span variants={fadeUpVariants} className="section-label">
          Offre exclusive
        </motion.span>

        <motion.h2
          variants={fadeUpVariants}
          className="section-title-white mb-6"
        >
          Réservez votre séjour<br />
          <em className="not-italic text-gradient-gold">de rêve aujourd'hui</em>
        </motion.h2>

        <motion.div
          variants={fadeUpVariants}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="w-12 h-px bg-gold/40" />
          <div className="w-1.5 h-1.5 bg-gold/60 rotate-45" />
          <div className="w-12 h-px bg-gold/40" />
        </motion.div>

        <motion.p
          variants={fadeUpVariants}
          className="text-white/50 font-jost font-light text-[15px] leading-relaxed mb-12 max-w-lg mx-auto"
        >
          Profitez de nos tarifs préférentiels réservés aux réservations en direct.
          <br />
          <span className="text-gold/70">Petit-déjeuner offert</span> pour toute réservation de 3 nuits ou plus.
        </motion.p>

        <motion.div variants={fadeUpVariants} className="flex flex-wrap gap-4 justify-center mb-14">
          <motion.button
            className="btn-gold"
            onClick={openReservationModal}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.97 }}
          >
            Réserver maintenant
          </motion.button>
          <motion.button
            className="btn-outline"
            onClick={() => scrollTo('galerie')}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.97 }}
          >
            Découvrir l'hôtel
          </motion.button>
        </motion.div>

        {/* Badges */}
        <motion.div
          variants={fadeUpVariants}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {BADGES.map(({ Icon, label }) => (
            <motion.div
              key={label}
              whileHover={{ y: -4, scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-2 py-3 px-2
                         border border-white/8 hover:border-gold/30
                         transition-all duration-300"
            >
              <Icon size={16} className="text-gold/70" strokeWidth={1.5} />
              <span className="text-white/30 text-[9px] tracking-[1.5px] uppercase font-jost text-center">
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

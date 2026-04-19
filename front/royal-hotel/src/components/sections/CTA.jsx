// sections/CTA.jsx
// Bannière Call-to-Action avec cercles décoratifs animés et fond sombre
import { motion } from 'framer-motion';
import { fadeUpVariants, staggerContainerVariants } from '../../hooks/useScrollAnimation';

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function openReservationModal() {
  window.dispatchEvent(new CustomEvent('openReservation', { detail: { room: '' } }));
}

export default function CTA() {
  return (
    <section className="relative py-36 bg-dark text-center overflow-hidden">

      {/* ── Cercles décoratifs animés ───────────────────────────────── */}
      {[380, 580, 780, 980].map((size, i) => (
        <motion.div
          key={size}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                     rounded-full border border-gold pointer-events-none"
          style={{ width: size, height: size }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{
            opacity: [0.12, 0.06, 0.03, 0.015][i],
            scale: 1,
          }}
          transition={{ duration: 1.2, delay: i * 0.15 }}
          viewport={{ once: true }}
        />
      ))}

      {/* ── Glow central ───────────────────────────────────────────── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* ── Content ────────────────────────────────────────────────── */}
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="relative z-10 max-w-2xl mx-auto px-8"
      >
        <motion.span variants={fadeUpVariants} className="section-label">
          Offre exclusive
        </motion.span>

        <motion.h2
          variants={fadeUpVariants}
          className="section-title-white mb-6"
        >
          Réservez votre séjour<br />de rêve aujourd'hui
        </motion.h2>

        <motion.p
          variants={fadeUpVariants}
          className="text-white/50 font-jost font-light text-[15px] leading-relaxed mb-12"
        >
          Profitez de nos tarifs préférentiels réservés aux réservations en direct sur notre site.
          Petit-déjeuner offert pour toute réservation de 3 nuits ou plus.
        </motion.p>

        <motion.div variants={fadeUpVariants} className="flex flex-wrap gap-4 justify-center">
          <button
            className="btn-gold"
            onClick={openReservationModal}
          >
            Réserver maintenant
          </button>
          <button
            className="btn-outline"
            onClick={() => scrollTo('chambres')}
          >
            Voir les chambres
          </button>
        </motion.div>

        {/* Badges de confiance */}
        <motion.div
          variants={fadeUpVariants}
          className="mt-14 flex flex-wrap justify-center gap-8"
        >
          {[
            ['✦', 'Meilleur prix garanti'],
            ['✦', 'Annulation gratuite'],
            ['✦', 'Wi-Fi inclus'],
          ].map(([icon, label]) => (
            <div key={label} className="flex items-center gap-2 text-white/30 text-[11px]
                                        tracking-[2px] uppercase font-jost">
              <span className="text-gold text-[8px]">{icon}</span>
              {label}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

// sections/Services.jsx — 3 services avec design éditorial premium
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { SERVICES } from '../../data/constants';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};

const cardVariants = {
  hidden:   { opacity: 0, y: 40 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function Services() {
  return (
    <section id="services" className="py-32 bg-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-8 lg:px-12">

        {/* ── En-tête section ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="section-label">Ce que nous offrons</span>
          <h2 className="section-title">Nos Services</h2>
          <p className="text-muted font-jost font-light text-sm mt-5 max-w-xl mx-auto leading-relaxed">
            Au Royal Hotel, nous avons à cœur de vous offrir une expérience simple, authentique
            et conviviale dans un cadre calme et reposant.
          </p>
        </motion.div>

        {/* ── Ligne décorative ────────────────────────────────────────── */}
        <div className="flex items-center gap-4 mb-16 justify-center">
          <div className="w-16 h-px bg-gold/40" />
          <div className="w-2 h-2 bg-gold/60 rotate-45" />
          <div className="w-16 h-px bg-gold/40" />
        </div>

        {/* ── Cartes ──────────────────────────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-gold/15"
        >
          {SERVICES.map(({ icon, number, title, desc, detail }, idx) => {
            const Icon = Icons[icon] ?? Icons.Star;
            return (
              <motion.div
                key={title}
                variants={cardVariants}
                className={`relative group bg-white p-10 xl:p-14 flex flex-col gap-0
                  transition-all duration-500 hover:bg-dark cursor-default
                  ${idx < SERVICES.length - 1 ? 'border-b lg:border-b-0 lg:border-r border-gold/15' : ''}
                `}
              >
                {/* Numéro décoratif */}
                <span
                  className="absolute top-8 right-10 font-cormorant font-light leading-none
                             text-gold/10 group-hover:text-gold/20 transition-colors duration-500
                             select-none pointer-events-none"
                  style={{ fontSize: 'clamp(64px, 8vw, 96px)' }}
                >
                  {number}
                </span>

                {/* Icône */}
                <div className="relative z-10 w-16 h-16 flex items-center justify-center mb-8
                               border border-gold/25 group-hover:border-gold/60
                               bg-cream group-hover:bg-gold/10
                               transition-all duration-500">
                  <Icon
                    size={28}
                    className="text-gold transition-colors duration-500"
                    strokeWidth={1.5}
                  />
                </div>

                {/* Titre */}
                <h3 className="relative z-10 font-cormorant text-dark group-hover:text-white
                              font-medium mb-4 transition-colors duration-500"
                    style={{ fontSize: 'clamp(22px, 2vw, 26px)' }}>
                  {title}
                </h3>

                {/* Ligne gold */}
                <div className="relative z-10 w-10 h-0.5 bg-gold mb-6
                               group-hover:w-16 transition-all duration-500" />

                {/* Description */}
                <p className="relative z-10 text-muted group-hover:text-white/65
                             font-jost font-light text-sm leading-[1.9]
                             transition-colors duration-500 mb-8 flex-1">
                  {desc}
                </p>

                {/* Tags */}
                <div className="relative z-10 flex flex-wrap gap-2 mt-auto">
                  {detail.split(' · ').map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] tracking-[2px] uppercase font-jost
                                 text-gold/70 group-hover:text-gold/90 border border-gold/20
                                 group-hover:border-gold/40 px-3 py-1.5
                                 transition-all duration-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Overlay glow au hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100
                               pointer-events-none transition-opacity duration-500
                               bg-gradient-to-br from-gold/5 via-transparent to-transparent" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── CTA bas ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <button
            className="btn-gold"
            onClick={() =>
              window.dispatchEvent(new CustomEvent('openReservation', { detail: { room: '' } }))
            }
          >
            Réserver votre chambre
          </button>
        </motion.div>

      </div>
    </section>
  );
}

// sections/Services.jsx
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { SERVICES } from '../../data/constants';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function Services() {
  return (
    <section id="services" className="py-32 bg-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">

        {/* ── En-tête ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-8"
        >
          <span className="section-label">Ce que nous offrons</span>
          <h2 className="section-title">Nos Services</h2>
        </motion.div>

        {/* Séparateur */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="flex items-center justify-center gap-4 mb-10"
        >
          <div className="w-20 h-px bg-gold/40" />
          <div className="w-2 h-2 bg-gold/60 rotate-45" />
          <div className="w-20 h-px bg-gold/40" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted font-jost font-light text-sm text-center max-w-xl mx-auto leading-relaxed mb-16"
        >
          Au Royal Hotel, nous avons à cœur de vous offrir une expérience simple, authentique
          et conviviale dans un cadre calme et reposant.
        </motion.p>

        {/* ── Cartes ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-0"
          style={{ border: '1px solid rgba(205,154,182,0.15)' }}
        >
          {SERVICES.map(({ icon, number, title, desc, detail }, idx) => {
            const Icon = Icons[icon] ?? Icons.Star;
            return (
              <motion.div
                key={title}
                variants={cardVariants}
                whileHover={{ backgroundColor: '#0F0F0F' }}
                className={`relative group bg-white p-10 xl:p-12 flex flex-col
                  transition-all duration-500 cursor-default overflow-hidden
                  ${idx < SERVICES.length - 1
                    ? 'border-b lg:border-b-0 lg:border-r border-gold/15'
                    : ''}`}
              >
                {/* Numéro décoratif */}
                <motion.span
                  className="absolute top-6 right-8 font-cormorant font-light leading-none
                             text-gold/8 group-hover:text-gold/15 transition-colors duration-500
                             select-none pointer-events-none"
                  style={{ fontSize: 'clamp(72px, 9vw, 100px)' }}
                >
                  {number}
                </motion.span>

                {/* Icône dans un carré */}
                <motion.div
                  whileHover={{ rotate: 5 }}
                  className="relative z-10 w-16 h-16 flex items-center justify-center mb-8
                             border border-gold/25 group-hover:border-gold/60
                             bg-cream/80 group-hover:bg-gold/10
                             transition-all duration-500"
                >
                  <Icon size={26} className="text-gold" strokeWidth={1.5} />
                </motion.div>

                {/* Titre */}
                <h3
                  className="relative z-10 font-cormorant text-dark group-hover:text-white
                             font-medium mb-4 transition-colors duration-500"
                  style={{ fontSize: 'clamp(20px, 2vw, 25px)' }}
                >
                  {title}
                </h3>

                {/* Ligne qui s'étend au hover */}
                <div className="relative z-10 h-0.5 bg-gold mb-6
                               w-10 group-hover:w-16 transition-all duration-500 origin-left" />

                {/* Description */}
                <p className="relative z-10 text-muted group-hover:text-white/60
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
                                 text-gold/70 group-hover:text-gold/90
                                 border border-gold/20 group-hover:border-gold/40
                                 px-3 py-1.5 transition-all duration-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Lueur de fond au hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100
                               pointer-events-none transition-opacity duration-700
                               bg-gradient-to-br from-gold/5 via-transparent to-transparent" />

                {/* Ligne décorative bas */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold
                               scale-x-0 group-hover:scale-x-100
                               transition-transform duration-500 origin-left" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── CTA bas ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="btn-gold"
            onClick={() =>
              window.dispatchEvent(new CustomEvent('openReservation', { detail: { room: '' } }))
            }
          >
            Réserver votre chambre
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
}

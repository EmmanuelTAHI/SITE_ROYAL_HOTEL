// sections/Rooms.jsx
// Section chambres — "Réserver" ouvre la modal de réservation avec la chambre pré-sélectionnée
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { staggerContainerVariants, cardVariants } from '../../hooks/useScrollAnimation';
import { ROOMS } from '../../data/constants';

function openReservationModal(roomTitle) {
  window.dispatchEvent(
    new CustomEvent('openReservation', { detail: { room: roomTitle } })
  );
}

export default function Rooms() {
  return (
    <section id="chambres" className="py-32 bg-cream">
      <div className="max-w-6xl mx-auto px-8 lg:px-12">
        <SectionHeader
          label="Nos hébergements"
          title="Chambres & Suites"
        />

        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {ROOMS.map((room) => (
            <motion.div
              key={room.title}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              className="bg-white group overflow-hidden shadow-card hover:shadow-card-hover
                         transition-all duration-500"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-64">
                <img
                  src={room.image}
                  alt={room.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700
                             group-hover:scale-110"
                />
                {/* Category badge */}
                <div className="absolute top-4 left-4 bg-dark/80 backdrop-blur-sm
                                px-3 py-1 text-[9px] tracking-[3px] uppercase font-jost text-gold">
                  {room.category}
                </div>
                {/* Popularity badge */}
                {room.badge && (
                  <div className="absolute top-4 right-4 bg-gold px-3 py-1
                                  text-[9px] tracking-[3px] uppercase font-jost text-dark font-medium">
                    {room.badge}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-cormorant text-dark text-[24px] font-medium leading-tight">
                    {room.title}
                  </h3>
                  {/* Price */}
                  <div className="text-right shrink-0 ml-4">
                    <div className="font-cormorant text-gold text-[22px] font-medium leading-none">
                      {room.price}
                    </div>
                    <div className="text-muted text-[10px] font-jost font-light">
                      {room.currency} {room.perNight}
                    </div>
                  </div>
                </div>

                <p className="text-muted font-jost font-light text-sm leading-relaxed mb-6">
                  {room.desc}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-7">
                  {room.features.map((feat) => (
                    <span
                      key={feat}
                      className="flex items-center gap-1.5 text-[11px] font-jost font-light
                                 text-muted bg-cream px-3 py-1.5"
                    >
                      <Check size={10} className="text-gold" />
                      {feat}
                    </span>
                  ))}
                </div>

                {/* CTA → ouvre la modal avec cette chambre pré-sélectionnée */}
                <motion.button
                  whileHover={{ x: 4 }}
                  onClick={() => openReservationModal(room.title)}
                  className="group/btn flex items-center gap-2 text-[11px] tracking-[2px]
                             uppercase font-jost text-dark hover:text-gold transition-colors duration-300
                             bg-transparent border-none cursor-pointer"
                >
                  Réserver cette chambre
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover/btn:translate-x-1"
                  />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

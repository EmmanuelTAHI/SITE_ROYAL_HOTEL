// sections/Rooms.jsx
import { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Check, ArrowRight, Bed } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { staggerContainerVariants, cardVariants } from '../../hooks/useScrollAnimation';
import { ROOMS } from '../../data/constants';

function openReservationModal(roomTitle) {
  window.dispatchEvent(
    new CustomEvent('openReservation', { detail: { room: roomTitle } })
  );
}

// Composant de carte avec effet de tilt 3D
function TiltCard({ room }) {
  const cardRef = useRef(null);
  const mouseX  = useMotionValue(0);
  const mouseY  = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]),  { stiffness: 180, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]),  { stiffness: 180, damping: 20 });
  const shine   = useSpring(useTransform(mouseX, [-0.5, 0.5], [-100, 100]), { stiffness: 180, damping: 20 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect   = cardRef.current.getBoundingClientRect();
    const relX   = (e.clientX - rect.left) / rect.width  - 0.5;
    const relY   = (e.clientY - rect.top)  / rect.height - 0.5;
    mouseX.set(relX);
    mouseY.set(relY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1200 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      variants={cardVariants}
      className="bg-white group overflow-hidden shadow-card hover:shadow-card-hover
                 transition-shadow duration-500 cursor-default"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-60 sm:h-64">
        <motion.img
          src={room.image}
          alt={room.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700
                     group-hover:scale-108"
          style={{ scale: useTransform(mouseY, [-0.5, 0.5], [1, 1.03]) }}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/50 via-transparent to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        {/* Badges */}
        <div className="absolute top-4 left-4 bg-dark/75 backdrop-blur-sm
                        px-3 py-1 text-[9px] tracking-[3px] uppercase font-jost text-gold">
          {room.category}
        </div>
        {room.badge && (
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-4 right-4 bg-gold px-3 py-1
                       text-[9px] tracking-[2px] uppercase font-jost text-dark font-medium shadow-lg"
          >
            {room.badge}
          </motion.div>
        )}

        {/* Prix en surimpression */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark/80 to-transparent
                        px-6 pb-4 pt-8 opacity-0 group-hover:opacity-100 transition-all duration-400">
          <div className="flex items-end gap-2">
            <span className="font-cormorant text-gold text-2xl font-medium leading-none">{room.price}</span>
            <span className="text-white/60 text-[10px] font-jost font-light mb-0.5">
              {room.currency} / nuit
            </span>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-7">
        {/* Titre + Prix (desktop, quand pas en hover sur image) */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-cormorant text-dark text-[22px] font-medium leading-tight">
            {room.title}
          </h3>
          <div className="text-right shrink-0 ml-4">
            <div className="font-cormorant text-gold text-[20px] font-medium leading-none">
              {room.price}
            </div>
            <div className="text-muted text-[9px] font-jost font-light tracking-[1px]">
              {room.currency} / nuit
            </div>
          </div>
        </div>

        {/* Ligne décorative */}
        <div className="w-8 h-0.5 bg-gold mb-4 group-hover:w-14 transition-all duration-500" />

        <p className="text-muted font-jost font-light text-[13px] leading-relaxed mb-5">
          {room.desc}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-6">
          {room.features.map((feat) => (
            <span
              key={feat}
              className="flex items-center gap-1.5 text-[10px] font-jost font-light
                         text-muted bg-cream/80 border border-gold/10 px-2.5 py-1.5
                         hover:border-gold/30 transition-colors duration-300"
            >
              <Check size={9} className="text-gold shrink-0" />
              {feat}
            </span>
          ))}
        </div>

        {/* CTA */}
        <motion.button
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => openReservationModal(room.title)}
          className="group/btn flex items-center gap-2 text-[10px] tracking-[2px]
                     uppercase font-jost text-dark hover:text-gold transition-all duration-300
                     bg-transparent border-none cursor-pointer"
        >
          <Bed size={13} className="text-gold" />
          Réserver cette chambre
          <ArrowRight
            size={13}
            className="transition-transform duration-300 group-hover/btn:translate-x-2"
          />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function Rooms() {
  return (
    <section id="chambres" className="py-32 bg-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">

        <SectionHeader
          label="Nos hébergements"
          title="Chambres & Suites"
        />

        {/* Sous-titre */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-muted font-jost font-light text-sm text-center max-w-xl mx-auto -mt-6 mb-14 leading-relaxed"
        >
          Choisissez votre chambre parmi nos hébergements soigneusement aménagés
          pour un confort optimal.
        </motion.p>

        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 perspective-1000"
        >
          {ROOMS.map((room) => (
            <TiltCard key={room.title} room={room} />
          ))}
        </motion.div>

        {/* CTA bas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-14"
        >
          <p className="text-muted font-jost text-sm mb-6">
            Besoin d'aide pour choisir ? Contactez-nous directement.
          </p>
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="btn-dark"
            onClick={() =>
              window.dispatchEvent(new CustomEvent('openReservation', { detail: { room: '' } }))
            }
          >
            Voir toutes les disponibilités
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
}

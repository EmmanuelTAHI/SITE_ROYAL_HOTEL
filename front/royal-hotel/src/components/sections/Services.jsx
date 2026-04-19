// sections/Services.jsx
// Grille de cartes services avec icônes Lucide et animations hover + scroll
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { staggerContainerVariants, cardVariants } from '../../hooks/useScrollAnimation';
import { SERVICES } from '../../data/constants';

export default function Services() {
  return (
    <section id="services" className="py-32 bg-cream">
      <div className="max-w-6xl mx-auto px-8 lg:px-12">
        <SectionHeader label="Ce que nous offrons" title="Nos Services" />

        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
        >
          {SERVICES.map(({ icon, title, desc }) => {
            const Icon = Icons[icon] ?? Icons.Star;
            return (
              <motion.div
                key={title}
                variants={cardVariants}
                whileHover={{ y: -10, boxShadow: '0 24px 64px rgba(0,0,0,0.10)' }}
                className="bg-white p-12 border-b-[3px] border-gold group cursor-default
                           transition-shadow duration-400"
              >
                {/* Icon container */}
                <div className="w-14 h-14 flex items-center justify-center mb-6
                               bg-cream group-hover:bg-gold transition-colors duration-400">
                  <Icon
                    size={26}
                    className="text-gold group-hover:text-dark transition-colors duration-400"
                  />
                </div>

                <h3 className="font-cormorant text-dark text-[22px] font-medium mb-3">
                  {title}
                </h3>
                <p className="text-muted font-jost font-light text-sm leading-[1.85]">
                  {desc}
                </p>

                {/* Hover underline */}
                <div className="mt-6 w-0 h-px bg-gold group-hover:w-10
                               transition-all duration-500 ease-out" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

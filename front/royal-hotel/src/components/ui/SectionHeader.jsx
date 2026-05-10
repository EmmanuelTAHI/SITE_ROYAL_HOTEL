// components/ui/SectionHeader.jsx
import { motion } from 'framer-motion';
import { fadeUpVariants } from '../../hooks/useScrollAnimation';

export default function SectionHeader({ label, title, titleHtml, light = false, className = '' }) {
  return (
    <div className={`text-center mb-16 ${className}`}>

      {label && (
        <motion.span
          className="section-label"
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {label}
        </motion.span>
      )}

      <motion.h2
        className={`section-title${light ? '-white' : ''}`}
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        transition={{ delay: 0.1 }}
        {...(titleHtml ? { dangerouslySetInnerHTML: { __html: titleHtml } } : {})}
      >
        {!titleHtml && title}
      </motion.h2>

      {/* Séparateur décoratif */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.25 }}
        className="flex items-center justify-center gap-3 mt-6"
      >
        <div className={`w-8 h-px ${light ? 'bg-gold/50' : 'bg-gold/40'}`} />
        <div className={`w-1.5 h-1.5 rotate-45 ${light ? 'bg-gold/50' : 'bg-gold/60'}`} />
        <div className={`w-8 h-px ${light ? 'bg-gold/50' : 'bg-gold/40'}`} />
      </motion.div>
    </div>
  );
}

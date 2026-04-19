// components/ui/SectionHeader.jsx
// En-tête de section réutilisable avec label doré + titre animé
import { motion } from 'framer-motion';
import { fadeUpVariants } from '../../hooks/useScrollAnimation';

/**
 * @param {string}  label      - Étiquette dorée au-dessus du titre (ex: "Notre histoire")
 * @param {string}  title      - Titre principal (peut contenir du HTML via dangerouslySetInnerHTML)
 * @param {string}  titleHtml  - Titre avec HTML (prioritaire sur title)
 * @param {boolean} light      - Si vrai, texte blanc (section sombre)
 * @param {string}  className  - Classes additionnelles
 */
export default function SectionHeader({ label, title, titleHtml, light = false, className = '' }) {
  return (
    <div className={`text-center mb-20 ${className}`}>
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
        className={`section-title${light ? '-white' : ''} mt-0`}
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        transition={{ delay: 0.1 }}
        {...(titleHtml ? { dangerouslySetInnerHTML: { __html: titleHtml } } : {})}
      >
        {!titleHtml && title}
      </motion.h2>
    </div>
  );
}

// components/ui/Loader.jsx
// Loader d'entrée élégant affiché pendant le premier chargement de la page
import { motion, AnimatePresence } from 'framer-motion';

export default function Loader({ isVisible }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-dark flex flex-col items-center justify-center"
          exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
        >
          {/* Logo animé */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center"
          >
            <div className="font-cormorant text-gold tracking-[10px] text-3xl mb-2 uppercase">
              Royal Hotel
            </div>
            <div className="text-white/30 text-[9px] tracking-[5px] uppercase font-jost">
              Grand-Bassam · Côte d'Ivoire
            </div>
          </motion.div>

          {/* Barre de chargement */}
          <div className="mt-12 w-48 h-[1px] bg-white/10 relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gold"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.6, ease: 'easeInOut' }}
            />
          </div>

          {/* Texte de chargement */}
          <motion.p
            className="mt-6 text-white/40 text-[10px] tracking-[4px] uppercase font-jost"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Chargement en cours...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// components/ui/ScrollProgress.jsx
// Barre de progression du scroll en haut de la page (BONUS)
import { useScroll, useSpring, motion } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gold origin-left z-[1001]"
      style={{ scaleX }}
    />
  );
}

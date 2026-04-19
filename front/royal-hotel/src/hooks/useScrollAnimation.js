// hooks/useScrollAnimation.js
// Hook réutilisable pour déclencher des animations au scroll avec Framer Motion
import { useInView } from 'framer-motion';
import { useRef } from 'react';

/**
 * Retourne une ref et un booléen indiquant si l'élément est visible.
 * @param {Object} options - Options de useInView
 * @param {number} options.margin - Marge avant déclenchement (ex: "-100px")
 * @param {boolean} options.once - Déclencher une seule fois
 */
export function useScrollAnimation({ margin = '-80px', once = true } = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin, once });
  return { ref, isInView };
}

/**
 * Variantes Framer Motion réutilisables pour les animations d'entrée
 */
export const fadeUpVariants = {
  hidden:  { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export const fadeInVariants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

export const slideFromLeftVariants = {
  hidden:  { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export const slideFromRightVariants = {
  hidden:  { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export const staggerContainerVariants = {
  hidden:  {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

export const cardVariants = {
  hidden:  { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

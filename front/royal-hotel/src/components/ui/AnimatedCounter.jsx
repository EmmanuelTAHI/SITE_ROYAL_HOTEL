// components/ui/AnimatedCounter.jsx
// Compteur qui s'anime de 0 à la valeur cible au scroll (BONUS)
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

/**
 * @param {number} target   - Valeur cible
 * @param {string} suffix   - Suffixe (%, +, h...)
 * @param {number} duration - Durée de l'animation en ms
 */
export default function AnimatedCounter({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const step = target / (duration / 16); // ~60fps

    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className="font-cormorant text-[44px] font-medium text-dark leading-none">
      {count}{suffix}
    </span>
  );
}

// sections/About.jsx
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import AnimatedCounter from '../ui/AnimatedCounter';
import {
  slideFromLeftVariants,
  slideFromRightVariants,
  staggerContainerVariants,
  fadeUpVariants,
} from '../../hooks/useScrollAnimation';
import { IMAGES, STATS } from '../../data/constants';

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function About() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);

  return (
    <section id="apropos" ref={sectionRef} className="py-32 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">

          {/* ── Texte ── */}
          <motion.div
            variants={slideFromLeftVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {/* Label animé */}
            <motion.span
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 'auto', opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="section-label overflow-hidden whitespace-nowrap"
            >
              Notre histoire
            </motion.span>

            <h2 className="section-title mb-3">
              Un havre de paix<br />
              <em className="not-italic text-gradient-gold">au cœur de Grand-Bassam</em>
            </h2>

            {/* Ligne décorative */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-16 h-0.5 bg-gold origin-left mb-8"
            />

            <p className="text-muted font-jost font-light text-[15px] leading-[1.9] mb-5">
              Depuis 2007, le Royal Hotel incarne l'hospitalité ivoirienne dans ce qu'elle a de plus
              chaleureux. Situé à Grand-Bassam, notre établissement allie confort moderne
              et authenticité africaine dans un cadre calme et reposant.
            </p>

            {/* Citation mise en valeur */}
            <motion.blockquote
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="border-l-2 border-gold pl-6 my-8"
            >
              <p className="font-cormorant italic text-dark/70 text-[20px] leading-snug font-light">
                "Avec 14 chambres soigneusement aménagées, nous accueillons voyageurs et familles
                qui cherchent un séjour simple, agréable et convivial."
              </p>
            </motion.blockquote>

            <p className="text-muted font-jost font-light text-[15px] leading-[1.9] mb-12">
              Notre équipe dévouée veille à ce que chaque instant soit parfait, 24h/24 et 7j/7.
            </p>

            {/* Stats animées */}
            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-12"
            >
              {STATS.map(({ value, suffix, label }) => (
                <motion.div
                  key={label}
                  variants={fadeUpVariants}
                  whileHover={{ y: -4, scale: 1.03 }}
                  className="relative bg-cream/60 border border-gold/15 p-4 text-center
                             transition-all duration-300 hover:border-gold/40 hover:shadow-gold/10
                             hover:shadow-md cursor-default group"
                >
                  <AnimatedCounter target={value} suffix={suffix} />
                  <div className="text-[9px] tracking-[2px] uppercase text-muted font-jost font-light mt-2">
                    {label}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold scale-x-0
                                  group-hover:scale-x-100 transition-transform duration-400 origin-left" />
                </motion.div>
              ))}
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.03, x: 4 }}
              whileTap={{ scale: 0.97 }}
              className="btn-dark"
              onClick={() => scrollTo('services')}
            >
              Nos services →
            </motion.button>
          </motion.div>

          {/* ── Image ── */}
          <motion.div
            variants={slideFromRightVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="relative"
          >
            {/* Cadre décoratif */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute -top-5 -left-5 w-28 h-28 border border-gold/30 z-0"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="absolute -bottom-5 -right-5 w-20 h-20 border border-gold/20 z-0"
            />

            {/* Image principale avec parallax léger */}
            <div className="relative z-10 overflow-hidden">
              <motion.img
                src={IMAGES.about}
                alt="Réception de Royal Hotel"
                style={{ y: imageY }}
                className="w-full h-[520px] object-cover block"
                loading="lazy"
              />
              {/* Overlay teinté */}
              <div className="absolute inset-0 bg-gradient-to-tr from-dark/20 via-transparent to-transparent" />
            </div>

            {/* Badge flottant */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.5, type: 'spring', stiffness: 120 }}
              className="absolute -bottom-6 -right-4 sm:-right-8 bg-gold px-6 py-5 z-20 shadow-lg shadow-gold/30"
            >
              <p className="font-cormorant italic text-dark text-[16px] leading-snug font-medium">
                "L'excellence<br />en toutes choses"
              </p>
              <div className="flex gap-0.5 mt-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-dark/60 text-[8px]">★</span>
                ))}
              </div>
            </motion.div>

            {/* Année de fondation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute top-6 -left-4 sm:-left-8 bg-dark py-4 px-5 z-20"
            >
              <div className="font-cormorant text-gold text-3xl font-light leading-none">2007</div>
              <div className="text-white/40 text-[8px] tracking-[3px] uppercase font-jost mt-1">
                Fondation
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

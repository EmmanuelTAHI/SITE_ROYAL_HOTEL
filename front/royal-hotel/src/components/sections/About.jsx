// sections/About.jsx
// Section À propos : layout image + texte avec compteurs animés
import { motion } from 'framer-motion';
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
  return (
    <section id="apropos" className="py-32 bg-white">
      <div className="max-w-6xl mx-auto px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* ── Texte ─────────────────────────────────────────────────── */}
          <motion.div
            variants={slideFromLeftVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <span className="section-label">Notre histoire</span>
            <h2 className="section-title mb-8">
              Un havre de paix<br />au cœur de Grand-Bassam
            </h2>

            <p className="text-muted font-jost font-light text-[15px] leading-[1.9] mb-5">
              Depuis 2007, le Royal Hotel incarne l'hospitalité ivoirienne dans ce qu'elle a de plus
              chaleureux. Situé à Grand-Bassam, notre établissement allie confort moderne
              et authenticité africaine dans un cadre calme et reposant.
            </p>
            <p className="text-muted font-jost font-light text-[15px] leading-[1.9] mb-12">
              Avec 14 chambres soigneusement aménagées, nous accueillons voyageurs et familles qui
              cherchent un séjour simple, agréable et convivial. Notre équipe dévouée veille à
              ce que chaque instant soit parfait.
            </p>

            {/* Statistiques animées */}
            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10"
            >
              {STATS.map(({ value, suffix, label }) => (
                <motion.div
                  key={label}
                  variants={fadeUpVariants}
                  className="border-t-2 border-gold pt-4"
                >
                  <AnimatedCounter target={value} suffix={suffix} />
                  <div className="text-[10px] tracking-[2px] uppercase text-muted font-jost font-light mt-2">
                    {label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <button
              className="btn-dark"
              onClick={() => scrollTo('services')}
            >
              Nos services
            </button>
          </motion.div>

          {/* ── Image ─────────────────────────────────────────────────── */}
          <motion.div
            variants={slideFromRightVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="relative"
          >
            {/* Decorative corner */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border border-gold-light z-0" />

            <img
              src={IMAGES.about}
              alt="Réception de Royal Hotel"
              className="relative z-10 w-full h-[500px] object-cover block"
              loading="lazy"
            />

            {/* Gold quote callout */}
            <div className="absolute -bottom-7 -right-7 bg-gold p-8 z-20 max-w-[200px]">
              <p className="font-cormorant italic text-dark text-[17px] leading-snug">
                "L'excellence en toutes choses"
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

// components/layout/Footer.jsx
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, ArrowUp } from 'lucide-react';
import { HOTEL, NAV_LINKS } from '../../data/constants';

const IconFacebook = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const FOOTER_LINKS = {
  'Navigation': NAV_LINKS.map(l => ({ label: l.label, id: l.id })),
  'Services': [
    { label: 'Hébergement',      id: 'services' },
    { label: 'Bar & Boissons',   id: 'services' },
    { label: 'Livraison Repas',  id: 'services' },
  ],
};

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white/60 relative overflow-hidden">
      {/* Ligne dorée supérieure */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      {/* Glow décoratif */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48
                      bg-gold/3 blur-3xl rounded-full pointer-events-none" />

      {/* ── Contenu principal ── */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 pt-20 pb-12
                      grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">

        {/* ── Brand ── */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-px h-8 bg-gold/50" />
              <div>
                <div className="font-cormorant text-gold text-2xl tracking-[6px] uppercase leading-none">
                  Royal Hotel
                </div>
                <p className="text-[8px] tracking-[4px] uppercase text-white/25 mt-1 font-jost">
                  Grand-Bassam · Côte d'Ivoire · Depuis 2007
                </p>
              </div>
            </div>

            <div className="w-12 h-px bg-gold/30 mt-4 mb-6" />

            <p className="text-sm font-jost font-light leading-relaxed text-white/45 mb-8 max-w-sm">
              Un havre de paix au cœur de Grand-Bassam, où l'élégance rencontre
              l'hospitalité ivoirienne dans toute sa chaleur authentique.
            </p>

            {/* Contacts */}
            <div className="flex flex-col gap-3 mb-8">
              {[
                { Icon: Phone, val: HOTEL.phone,  href: `tel:${HOTEL.phone}` },
                { Icon: Phone, val: HOTEL.phone2, href: `tel:${HOTEL.phone2}` },
                { Icon: Mail,  val: HOTEL.email,  href: `mailto:${HOTEL.email}` },
              ].map(({ Icon, val, href }) => (
                <a
                  key={val}
                  href={href}
                  className="flex items-center gap-2.5 text-[12px] font-jost font-light
                             text-white/40 hover:text-gold transition-colors duration-300 group"
                >
                  <Icon size={11} className="text-gold shrink-0 group-hover:scale-110 transition-transform" />
                  <span>{val}</span>
                </a>
              ))}
            </div>

            {/* Social */}
            <div className="flex items-center gap-4">
              <span className="text-[9px] tracking-[3px] uppercase text-white/20 font-jost">
                Suivez-nous
              </span>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href={HOTEL.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 border border-white/15 flex items-center justify-center
                           text-white/35 hover:text-[#1877F2] hover:border-[#1877F2]/50
                           transition-all duration-300"
              >
                <IconFacebook />
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* ── Liens ── */}
        {Object.entries(FOOTER_LINKS).map(([groupTitle, links], gi) => (
          <motion.div
            key={groupTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 + gi * 0.1 }}
          >
            <h4 className="text-white/80 text-[10px] tracking-[4px] uppercase font-jost mb-6 flex items-center gap-2">
              <span className="w-4 h-px bg-gold/50" />
              {groupTitle}
            </h4>
            <ul className="flex flex-col gap-3">
              {links.map(({ label, id }) => (
                <li key={label}>
                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => scrollTo(id)}
                    className="text-[13px] font-jost font-light text-white/35 hover:text-gold
                               transition-all duration-300 bg-transparent border-none cursor-pointer
                               text-left flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-gold group-hover:w-4 transition-all duration-300" />
                    {label}
                  </motion.button>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* ── Adresse ── */}
      <div className="border-t border-white/6 max-w-6xl mx-auto px-6 lg:px-12 py-5
                      flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <MapPin size={11} className="text-gold shrink-0" />
          <span className="text-[11px] font-jost font-light text-white/30">{HOTEL.address}</span>
        </div>

        {/* Retour en haut */}
        <motion.button
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="flex items-center gap-2 text-[10px] font-jost tracking-[2px] uppercase
                     text-white/25 hover:text-gold transition-all duration-300
                     bg-transparent border-none cursor-pointer"
        >
          <ArrowUp size={12} />
          Haut de page
        </motion.button>
      </div>

      {/* ── Copyright ── */}
      <div className="border-t border-white/4 py-5 text-center">
        <p className="text-[10px] font-jost text-white/15 tracking-[2px]">
          © {new Date().getFullYear()} Royal Hotel · Grand-Bassam, Côte d'Ivoire · Tous droits réservés
        </p>
      </div>
    </footer>
  );
}

// components/layout/Footer.jsx
import { Phone, Mail, MapPin } from 'lucide-react';
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
    { label: 'Hébergement',       id: 'services' },
    { label: 'Bar & Boissons',    id: 'services' },
    { label: 'Livraison Repas',   id: 'services' },
  ],
};

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white/60">

      {/* ── Top section ───────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-8 lg:px-12 pt-20 pb-12
                      grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Brand */}
        <div className="lg:col-span-2">
          <div className="font-cormorant text-gold text-2xl tracking-[6px] uppercase mb-2">
            Royal Hotel
          </div>
          <p className="text-[9px] tracking-[4px] uppercase text-white/30 mb-6 font-jost">
            Grand-Bassam · Côte d'Ivoire · Depuis 2007
          </p>
          <p className="text-sm font-jost font-light leading-relaxed text-white/50 mb-8 max-w-sm">
            Un havre de paix au cœur de Grand-Bassam, où l'élégance rencontre
            l'hospitalité ivoirienne dans toute sa chaleur authentique.
          </p>

          {/* Contact rapide */}
          <div className="flex flex-col gap-3 mb-8">
            {[
              { Icon: Phone, val: HOTEL.phone },
              { Icon: Phone, val: HOTEL.phone2 },
              { Icon: Mail,  val: HOTEL.email },
            ].map(({ Icon, val }) => (
              <div key={val} className="flex items-center gap-2.5 text-[12px] font-jost font-light">
                <Icon size={12} className="text-gold shrink-0" />
                <span className="text-white/45">{val}</span>
              </div>
            ))}
          </div>

          {/* Social — Facebook uniquement */}
          <div className="flex items-center gap-3">
            <span className="text-[9px] tracking-[3px] uppercase text-white/25 font-jost">Suivez-nous</span>
            <a
              href={HOTEL.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 border border-white/15 flex items-center justify-center
                         text-white/40 hover:text-[#1877F2] hover:border-[#1877F2]/40
                         transition-all duration-300"
            >
              <IconFacebook />
            </a>
          </div>
        </div>

        {/* Link groups */}
        {Object.entries(FOOTER_LINKS).map(([groupTitle, links]) => (
          <div key={groupTitle}>
            <h4 className="text-white text-[10px] tracking-[4px] uppercase font-jost mb-6">
              {groupTitle}
            </h4>
            <ul className="flex flex-col gap-3">
              {links.map(({ label, id }) => (
                <li key={label}>
                  <button
                    onClick={() => scrollTo(id)}
                    className="text-sm font-jost font-light text-white/40 hover:text-gold
                               transition-colors duration-300 bg-transparent border-none cursor-pointer"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Adresse bar ───────────────────────────────────────────── */}
      <div className="border-t border-white/8 max-w-6xl mx-auto px-8 lg:px-12 py-6
                      flex items-center justify-center gap-2">
        <MapPin size={12} className="text-gold shrink-0" />
        <span className="text-[12px] font-jost font-light text-white/35">{HOTEL.address}</span>
      </div>

      {/* ── Bottom bar ────────────────────────────────────────────── */}
      <div className="border-t border-white/5 py-6 text-center">
        <p className="text-[11px] font-jost text-white/20 tracking-widest">
          © {new Date().getFullYear()} Royal Hotel · Grand-Bassam, Côte d'Ivoire · Tous droits réservés
        </p>
      </div>
    </footer>
  );
}

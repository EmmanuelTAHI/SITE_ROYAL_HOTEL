// components/layout/Footer.jsx
// Footer complet avec logo, liens groupés, réseaux sociaux et copyright
import { Phone, Mail, MapPin } from 'lucide-react';
import { HOTEL, NAV_LINKS } from '../../data/constants';

// Icônes SVG inline pour les réseaux sociaux (compatibilité universelle)
const IconInstagram = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const IconFacebook = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const IconTwitter = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);
const IconLinkedin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

const SOCIAL_LINKS = [
  { Icon: IconInstagram, label: 'Instagram', href: '#' },
  { Icon: IconFacebook,  label: 'Facebook',  href: '#' },
  { Icon: IconTwitter,   label: 'Twitter',   href: '#' },
  { Icon: IconLinkedin,  label: 'LinkedIn',  href: '#' },
];

const FOOTER_LINKS = {
  'Navigation': NAV_LINKS.map(l => ({ label: l.label, id: l.id })),
  'Services': [
    { label: 'Restaurant',    id: 'services' },
    { label: 'Piscine & Spa', id: 'services' },
    { label: 'Événements',    id: 'services' },
    { label: 'Navette',       id: 'services' },
  ],
  'Chambres': [
    { label: 'Standard',         id: 'chambres' },
    { label: 'Deluxe',           id: 'chambres' },
    { label: 'Suite Junior',     id: 'chambres' },
    { label: 'Suite Présidentielle', id: 'chambres' },
  ],
};

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white/60">

      {/* ── Top section ────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-8 lg:px-12 pt-20 pb-12
                      grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="font-cormorant text-gold text-2xl tracking-[6px] uppercase mb-2">
            Royal Hotel
          </div>
          <p className="text-[9px] tracking-[4px] uppercase text-white/30 mb-6 font-jost">
            Grand-Bassam · Côte d'Ivoire
          </p>
          <p className="text-sm font-jost font-light leading-relaxed text-white/50 mb-8">
            Un havre de paix au cœur de Grand-Bassam, où l'élégance rencontre l'hospitalité ivoirienne dans toute sa splendeur.
          </p>

          {/* Social links */}
          <div className="flex gap-3">
            {SOCIAL_LINKS.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 border border-white/15 flex items-center justify-center
                           text-white/40 hover:text-gold hover:border-gold/50
                           transition-all duration-300"
              >
                <Icon />
              </a>
            ))}
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

      {/* ── Contact info bar ──────────────────────────────────────────────── */}
      <div className="border-t border-white/8 max-w-6xl mx-auto px-8 lg:px-12 py-8
                      flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap gap-8 justify-center md:justify-start">
          {[
            { Icon: Phone,  value: HOTEL.phone },
            { Icon: Mail,   value: HOTEL.email },
            { Icon: MapPin, value: HOTEL.address },
          ].map(({ Icon, value }) => (
            <div key={value} className="flex items-center gap-2 text-[12px] font-jost font-light">
              <Icon size={12} className="text-gold shrink-0" />
              <span className="text-white/40">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────────────────────── */}
      <div className="border-t border-white/5 py-6 text-center">
        <p className="text-[11px] font-jost text-white/20 tracking-widest">
          © 2026 Hôtel Le Palmier · Tous droits réservés · Abidjan, Côte d'Ivoire
        </p>
      </div>
    </footer>
  );
}

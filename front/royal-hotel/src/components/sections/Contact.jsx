// sections/Contact.jsx — Formulaire de contact pur (hors réservation)
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Phone, Mail, Clock,
  Send, CheckCircle,
} from 'lucide-react';

// Icônes réseaux sociaux (SVG inline — non disponibles dans cette version de lucide-react)
const IconInstagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);
const IconFacebook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const IconX = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
import {
  slideFromLeftVariants,
  slideFromRightVariants,
  fadeUpVariants,
} from '../../hooks/useScrollAnimation';
import { HOTEL } from '../../data/constants';

const CONTACT_INFO = [
  { Icon: MapPin, label: 'Adresse',   value: HOTEL.address },
  { Icon: Phone,  label: 'Téléphone', value: HOTEL.phone },
  { Icon: Mail,   label: 'Email',     value: HOTEL.email },
  { Icon: Clock,  label: 'Réception', value: 'Ouverte 24h/24 · 7j/7' },
];

const SUBJECTS = [
  'Sélectionnez un sujet',
  'Renseignements généraux',
  'Informations sur les chambres',
  'Événement / Mariage / Séminaire',
  'Restaurant & Gastronomie',
  'Spa & Bien-être',
  'Service de navette',
  'Réclamation',
  'Autre',
];

const SOCIALS = [
  { href: 'https://www.instagram.com', Icon: IconInstagram, label: 'Instagram', color: 'hover:text-[#E4405F]' },
  { href: 'https://www.facebook.com',  Icon: IconFacebook,  label: 'Facebook',  color: 'hover:text-[#1877F2]' },
  { href: 'https://www.twitter.com',   Icon: IconX,         label: 'Twitter/X', color: 'hover:text-[#1DA1F2]' },
];

const INITIAL = { name: '', email: '', phone: '', subject: '', message: '' };

export default function Contact() {
  const [form, setForm]       = useState(INITIAL);
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  const update = (key) => (e) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Requis';
    if (!form.email.trim())   e.email   = 'Requis';
    if (!form.subject || form.subject === SUBJECTS[0]) e.subject = 'Requis';
    if (!form.message.trim()) e.message = 'Requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSend = () => {
    if (!validate()) return;
    setLoading(true);
    // TODO : brancher EmailJS / Formspree / backend API
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setForm(INITIAL);
    }, 1400);
  };

  return (
    <section id="contact" className="relative overflow-hidden">

      {/* ── Bloc supérieur : fond sombre + infos ──────────────────────── */}
      <div className="bg-charcoal relative">
        {/* Décoration dorée fine */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        <div className="max-w-6xl mx-auto px-8 lg:px-12 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Texte gauche */}
            <motion.div
              variants={slideFromLeftVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <span className="text-gold text-[11px] tracking-[5px] uppercase font-jost font-light block mb-4">
                Parlons ensemble
              </span>
              <h2 className="font-cormorant text-white font-light mb-6"
                  style={{ fontSize: 'clamp(36px, 4vw, 54px)', lineHeight: 1.15 }}>
                Une question ?<br />
                <em className="text-gold not-italic">Nous sommes là.</em>
              </h2>
              <p className="text-white/55 font-jost font-light text-sm leading-relaxed max-w-md">
                Notre équipe est disponible 24h/24 et 7j/7 pour répondre à toutes vos
                questions. Nous nous engageons à vous répondre dans les plus brefs délais.
              </p>

              {/* Ligne décorative */}
              <div className="flex items-center gap-4 mt-8 mb-10">
                <div className="w-12 h-px bg-gold/50" />
                <span className="text-gold/60 text-[10px] tracking-[3px] uppercase font-jost">
                  Nos coordonnées
                </span>
              </div>

              {/* Infos de contact */}
              <div className="flex flex-col gap-6">
                {CONTACT_INFO.map(({ Icon, label, value }) => (
                  <motion.div
                    key={label}
                    variants={fadeUpVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex gap-5 items-start group"
                  >
                    <div className="w-10 h-10 bg-gold/10 border border-gold/20 flex items-center
                                    justify-center shrink-0 transition-all duration-300
                                    group-hover:bg-gold/20 group-hover:border-gold/40">
                      <Icon size={15} className="text-gold" />
                    </div>
                    <div>
                      <div className="text-[9px] tracking-[3px] uppercase text-white/35 font-jost mb-1">
                        {label}
                      </div>
                      <div className="text-white/80 font-jost font-light text-[14px]">{value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Réseaux sociaux */}
              <div className="flex items-center gap-6 mt-10">
                <span className="text-white/30 text-[10px] tracking-[3px] uppercase font-jost">
                  Suivez-nous
                </span>
                {SOCIALS.map(({ href, Icon, label, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`text-white/40 ${color} transition-colors duration-300`}
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Carte Google Maps */}
            <motion.div
              variants={slideFromRightVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="relative"
            >
              <div className="overflow-hidden h-72 lg:h-80 border border-gold/20">
                <iframe
                  title="Localisation Royal Hotel"
                  src={HOTEL.mapEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(20%) contrast(1.05)' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              {/* Badge sur la carte */}
              <div className="absolute -bottom-4 -right-4 bg-gold px-5 py-3 shadow-lg">
                <span className="text-dark text-[10px] tracking-[3px] uppercase font-jost font-medium">
                  Grand-Bassam, CI
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Bloc inférieur : formulaire sur fond crème ────────────────── */}
      <div className="bg-cream relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />

        <div className="max-w-6xl mx-auto px-8 lg:px-12 py-24">
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="text-center mb-14"
          >
            <span className="section-label">Formulaire de contact</span>
            <h2 className="section-title">Envoyez-nous un message</h2>
            <p className="text-muted font-jost font-light text-sm mt-4 max-w-lg mx-auto leading-relaxed">
              Pour une réservation, utilisez le bouton <strong className="font-medium text-dark">Réserver</strong> dans
              la navigation. Ce formulaire est dédié à vos questions, demandes d'informations et commentaires.
            </p>
          </motion.div>

          <motion.div
            variants={slideFromRightVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="max-w-3xl mx-auto"
          >
            <AnimatePresence mode="wait">
              {sent ? (
                /* ── SUCCÈS ── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white p-14 text-center flex flex-col items-center shadow-card"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.15, type: 'spring', stiffness: 220, damping: 14 }}
                    className="w-20 h-20 bg-gold/10 flex items-center justify-center mb-8"
                  >
                    <CheckCircle size={38} className="text-gold" strokeWidth={1.5} />
                  </motion.div>
                  <h3 className="font-cormorant text-dark text-[30px] font-light mb-3">
                    Message envoyé !
                  </h3>
                  <p className="text-muted font-jost font-light text-sm mb-8 max-w-md leading-relaxed">
                    Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais,
                    généralement sous 24 heures.
                  </p>
                  <button onClick={() => setSent(false)} className="btn-outline-gold">
                    Envoyer un autre message
                  </button>
                </motion.div>
              ) : (
                /* ── FORMULAIRE ── */
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white p-10 md:p-14 shadow-card"
                >
                  <div className="flex flex-col gap-7">
                    {/* Nom + Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                      <div>
                        <label className="text-[10px] tracking-[3px] uppercase text-muted font-jost block mb-2">
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={update('name')}
                          placeholder="Jean Kouassi"
                          className={`form-input ${errors.name ? 'border-red-300' : ''}`}
                        />
                        {errors.name && (
                          <p className="text-red-400 text-[10px] font-jost mt-1">{errors.name}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-[10px] tracking-[3px] uppercase text-muted font-jost block mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={update('email')}
                          placeholder="jean@exemple.com"
                          className={`form-input ${errors.email ? 'border-red-300' : ''}`}
                        />
                        {errors.email && (
                          <p className="text-red-400 text-[10px] font-jost mt-1">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Téléphone + Sujet */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                      <div>
                        <label className="text-[10px] tracking-[3px] uppercase text-muted font-jost block mb-2">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={update('phone')}
                          placeholder="+225 07 00 00 00"
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] tracking-[3px] uppercase text-muted font-jost block mb-2">
                          Sujet *
                        </label>
                        <select
                          value={form.subject}
                          onChange={update('subject')}
                          className={`form-input bg-transparent cursor-pointer appearance-none ${
                            errors.subject ? 'border-red-300' : ''
                          } ${!form.subject || form.subject === SUBJECTS[0] ? 'text-muted' : 'text-dark'}`}
                        >
                          {SUBJECTS.map((s) => (
                            <option key={s} value={s} disabled={s === SUBJECTS[0]} className="text-dark">
                              {s}
                            </option>
                          ))}
                        </select>
                        {errors.subject && (
                          <p className="text-red-400 text-[10px] font-jost mt-1">{errors.subject}</p>
                        )}
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="text-[10px] tracking-[3px] uppercase text-muted font-jost block mb-2">
                        Votre message *
                      </label>
                      <textarea
                        rows={5}
                        value={form.message}
                        onChange={update('message')}
                        placeholder="Décrivez votre demande en détail…"
                        className={`form-input resize-none ${errors.message ? 'border-red-300' : ''}`}
                      />
                      {errors.message && (
                        <p className="text-red-400 text-[10px] font-jost mt-1">{errors.message}</p>
                      )}
                    </div>

                    {/* Footer formulaire */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                      <p className="text-muted text-[11px] font-jost font-light leading-relaxed max-w-xs">
                        Champs marqués * obligatoires. Réponse sous 24h.
                      </p>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSend}
                        disabled={loading}
                        className={`btn-dark flex items-center gap-3 shrink-0 transition-opacity duration-300 ${
                          loading ? 'opacity-60 cursor-not-allowed' : ''
                        }`}
                      >
                        {loading ? (
                          <span className="inline-block w-4 h-4 border-2 border-white/25 border-t-white
                                           rounded-full animate-spin" />
                        ) : (
                          <Send size={14} />
                        )}
                        {loading ? 'Envoi…' : 'Envoyer le message →'}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

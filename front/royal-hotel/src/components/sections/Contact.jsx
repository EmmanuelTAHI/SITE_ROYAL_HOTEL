// sections/Contact.jsx — Formulaire de contact avec validation sécurisée
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import {
  slideFromLeftVariants,
  slideFromRightVariants,
  fadeUpVariants,
} from '../../hooks/useScrollAnimation';
import { HOTEL } from '../../data/constants';

// ─── Icône Facebook SVG ───────────────────────────────────────────────────────
const IconFacebook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

// ─── Validation & sécurité ────────────────────────────────────────────────────
const sanitize = (s) =>
  String(s)
    .replace(/<[^>]*>/g, '')
    .replace(/[<>&"'`{}[\]\\]/g, '')
    .trim()
    .slice(0, 1000);

const validatePhone = (p) => {
  const c = p.replace(/[\s\-\.()]/g, '');
  return /^(\+225|00225)[0-9]{10}$/.test(c) || /^0[0-9]{9}$/.test(c);
};

const validateEmail = (e) => {
  if (!e.trim()) return true;
  return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(e.trim());
};

// ─── Données ──────────────────────────────────────────────────────────────────
const CONTACT_INFO = [
  { Icon: MapPin, label: 'Adresse',    value: HOTEL.address },
  { Icon: Phone,  label: 'Téléphone',  value: HOTEL.phone },
  { Icon: Phone,  label: 'Téléphone 2',value: HOTEL.phone2 },
  { Icon: Mail,   label: 'Email',      value: HOTEL.email },
  { Icon: Clock,  label: 'Réception',  value: 'Ouverte 24h/24 · 7j/7' },
];

const SUBJECTS = [
  'Sélectionnez un sujet',
  'Renseignements généraux',
  'Informations sur les chambres',
  'Livraison de repas',
  'Réclamation',
  'Autre',
];

const INITIAL = { name: '', phone: '', email: '', subject: '', message: '' };

export default function Contact() {
  const [form,    setForm]    = useState(INITIAL);
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});

  const update = (key) => (e) => {
    let val = e.target.value;
    if (key === 'phone') {
      val = val.replace(/[^+0-9\s\-\.()]/g, '').slice(0, 20);
    } else if (key === 'email') {
      val = sanitize(val).slice(0, 150);
    } else {
      val = sanitize(val);
    }
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(er => ({ ...er, [key]: '' }));
  };

  // Validation complète en JS (protection bypass inspecteur)
  const validate = () => {
    const e = {};
    if (!sanitize(form.name))                       e.name    = 'Votre nom est requis.';
    if (!validatePhone(form.phone))                 e.phone   = 'Format requis : +225 XXXXXXXXXX';
    if (form.email && !validateEmail(form.email))   e.email   = 'Adresse e-mail invalide.';
    if (!form.subject || form.subject === SUBJECTS[0]) e.subject = 'Veuillez choisir un sujet.';
    if (!sanitize(form.message))                    e.message = 'Votre message est requis.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSend = () => {
    // Double vérification JS — les attributs HTML peuvent être contournés via l'inspecteur
    if (!validate()) return;
    if (!sanitize(form.name) || !validatePhone(form.phone)) return;
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

      {/* ── Bloc supérieur : fond sombre + infos ─────────────────────── */}
      <div className="bg-charcoal relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        <div className="max-w-6xl mx-auto px-8 lg:px-12 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

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
                  style={{ fontSize: 'clamp(34px, 4vw, 52px)', lineHeight: 1.15 }}>
                Une question ?<br />
                <em className="text-gold not-italic">Nous sommes là.</em>
              </h2>
              <p className="text-white/55 font-jost font-light text-sm leading-relaxed max-w-md">
                Notre équipe est disponible 24h/24 et 7j/7 pour répondre à toutes
                vos questions. Nous nous engageons à vous répondre dans les plus brefs délais.
              </p>

              <div className="flex items-center gap-4 mt-8 mb-10">
                <div className="w-12 h-px bg-gold/50" />
                <span className="text-gold/60 text-[10px] tracking-[3px] uppercase font-jost">
                  Nos coordonnées
                </span>
              </div>

              <div className="flex flex-col gap-5">
                {CONTACT_INFO.map(({ Icon, label, value }) => (
                  <motion.div
                    key={label + value}
                    variants={fadeUpVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex gap-4 items-start group"
                  >
                    <div className="w-10 h-10 bg-gold/10 border border-gold/20 flex items-center
                                    justify-center shrink-0 transition-all duration-300
                                    group-hover:bg-gold/20 group-hover:border-gold/40">
                      <Icon size={14} className="text-gold" />
                    </div>
                    <div>
                      <div className="text-[9px] tracking-[3px] uppercase text-white/35 font-jost mb-0.5">
                        {label}
                      </div>
                      <div className="text-white/80 font-jost font-light text-[13px]">{value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Réseaux sociaux — Facebook uniquement */}
              <div className="flex items-center gap-5 mt-10">
                <span className="text-white/30 text-[10px] tracking-[3px] uppercase font-jost">
                  Suivez-nous
                </span>
                <a
                  href={HOTEL.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 border border-white/15 flex items-center justify-center
                             text-white/40 hover:text-[#1877F2] hover:border-[#1877F2]/50
                             transition-all duration-300"
                >
                  <IconFacebook />
                </a>
              </div>
            </motion.div>

            {/* Google Maps */}
            <motion.div
              variants={slideFromRightVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="relative"
            >
              <div className="overflow-hidden h-80 border border-gold/20">
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
              <div className="absolute -bottom-4 -right-4 bg-gold px-5 py-3 shadow-lg">
                <span className="text-dark text-[10px] tracking-[3px] uppercase font-jost font-medium">
                  Grand-Bassam, CI
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Bloc inférieur : formulaire ──────────────────────────────── */}
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
              Pour une réservation, utilisez le bouton{' '}
              <strong className="font-medium text-dark">Réserver</strong> dans la navigation.
              Ce formulaire est dédié à vos questions et demandes d'informations.
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
                  <h3 className="font-cormorant text-dark text-[28px] font-light mb-3">
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
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white p-10 md:p-14 shadow-card"
                >
                  <div className="flex flex-col gap-7">

                    {/* Nom + Téléphone */}
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
                          maxLength={100}
                          className={`form-input ${errors.name ? 'border-red-300' : ''}`}
                        />
                        {errors.name && <p className="text-red-400 text-[10px] font-jost mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="text-[10px] tracking-[3px] uppercase text-muted font-jost block mb-2">
                          Téléphone * <span className="normal-case text-muted/60">(+225…)</span>
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={update('phone')}
                          placeholder="+225 07 00 00 00 00"
                          maxLength={20}
                          className={`form-input ${errors.phone ? 'border-red-300' : ''}`}
                        />
                        {errors.phone && <p className="text-red-400 text-[10px] font-jost mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    {/* Email + Sujet */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                      <div>
                        <label className="text-[10px] tracking-[3px] uppercase text-muted font-jost block mb-2">
                          Email <span className="normal-case text-muted/60">(optionnel)</span>
                        </label>
                        <input
                          type="text"
                          value={form.email}
                          onChange={update('email')}
                          placeholder="jean@exemple.com"
                          maxLength={150}
                          className={`form-input ${errors.email ? 'border-red-300' : ''}`}
                        />
                        {errors.email && <p className="text-red-400 text-[10px] font-jost mt-1">{errors.email}</p>}
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
                        {errors.subject && <p className="text-red-400 text-[10px] font-jost mt-1">{errors.subject}</p>}
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
                        maxLength={1000}
                        className={`form-input resize-none ${errors.message ? 'border-red-300' : ''}`}
                      />
                      {errors.message && <p className="text-red-400 text-[10px] font-jost mt-1">{errors.message}</p>}
                    </div>

                    {/* Footer formulaire */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                      <p className="text-muted text-[11px] font-jost font-light leading-relaxed max-w-xs">
                        Champs * obligatoires. Réponse sous 24h.
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

// ui/ReservationModal.jsx — Modal de réservation 4 étapes + paiement Wave via GeniusPay
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Check, ChevronLeft, ChevronRight, Calendar,
  Tag, Banknote, AlertCircle, ExternalLink, MessageCircle, RefreshCw,
} from 'lucide-react';
import { ROOM_TYPES } from '../../data/constants';
import { createPaymentSession, paymentMode } from '../../lib/geniuspay';
import waveLogo from '../../assets/images/logo-wave.jpg';

// ─── Constantes ───────────────────────────────────────────────────────────────
const STEPS = ['Chambre', 'Séjour', 'Coordonnées', 'Paiement'];

const MONTHS_FR = [
  'Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre',
];

const DAYS_FR = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];

// ─── Utilitaires dates ────────────────────────────────────────────────────────
const toStr = (d) => {
  if (!d) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const fromStr = (s) => {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const todayStr = toStr(new Date());

const formatDisplay = (s) => {
  if (!s) return '';
  const d = fromStr(s);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
};

const fmt = (n) => n.toLocaleString('fr-FR');

// ─── Validation (protection bypass inspecteur) ────────────────────────────────
const sanitize = (s) =>
  String(s)
    .replace(/<[^>]*>/g, '')
    .replace(/[<>&"'`]/g, '')
    .trim()
    .slice(0, 500);

const validatePhone = (p) => {
  const c = p.replace(/[\s\-\.()]/g, '');
  return /^(\+225|00225)[0-9]{10}$/.test(c) || /^0[0-9]{9}$/.test(c);
};

const validateEmail = (e) => {
  if (!e.trim()) return true;
  return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(e.trim());
};

// ─── Composant Calendrier ────────────────────────────────────────────────────
function CalendarPicker({ checkin, checkout, onCheckin, onCheckout }) {
  const [view, setView]       = useState(() => {
    const t = new Date();
    return { year: t.getFullYear(), month: t.getMonth() };
  });
  const [hoverDate, setHoverDate] = useState('');

  const { year, month } = view;

  const prevMonth = () => setView(v =>
    v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 }
  );
  const nextMonth = () => setView(v =>
    v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 }
  );

  const days = useMemo(() => {
    const first = new Date(year, month, 1);
    const last  = new Date(year, month + 1, 0);
    const startDow = (first.getDay() + 6) % 7; // 0=Lun
    const cells = [];
    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= last.getDate(); d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [year, month]);

  const handleClick = (date) => {
    const s = toStr(date);
    if (!checkin || (checkin && checkout)) {
      onCheckin(s);
      onCheckout('');
    } else {
      if (s > checkin) {
        onCheckout(s);
      } else {
        onCheckin(s);
        onCheckout('');
      }
    }
    setHoverDate('');
  };

  const handleEnter = (date) => {
    if (checkin && !checkout) setHoverDate(toStr(date));
  };

  const getCellClass = (date) => {
    if (!date) return '';
    const s = toStr(date);
    const isPast = s < todayStr;
    if (isPast) return 'text-gray-300 cursor-not-allowed pointer-events-none';

    const isCheckin  = s === checkin;
    const isCheckout = s === checkout;
    const inRange    = checkin && checkout && s > checkin && s < checkout;
    const inHover    = checkin && !checkout && hoverDate && s > checkin && s <= hoverDate;
    const isToday    = s === todayStr;

    if (isCheckin && isCheckout) return 'bg-gold text-white font-semibold rounded-full';
    if (isCheckin)  return 'bg-gold text-white font-semibold rounded-l-full cursor-pointer';
    if (isCheckout) return 'bg-gold text-white font-semibold rounded-r-full cursor-pointer';
    if (inRange)    return 'bg-gold/20 text-dark cursor-pointer';
    if (inHover)    return 'bg-gold/12 text-dark cursor-pointer';
    if (isToday)    return 'ring-1 ring-gold/70 text-dark font-medium hover:bg-gold/10 cursor-pointer';
    return 'text-dark hover:bg-gold/12 cursor-pointer transition-colors duration-150';
  };

  return (
    <div className="rounded-sm overflow-hidden border border-gold/20 bg-white select-none">
      {/* ── Navigation mois ─────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 bg-dark">
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center text-white/60
                     hover:text-gold transition-colors duration-200 bg-transparent border-none cursor-pointer"
        >
          <ChevronLeft size={16} />
        </motion.button>
        <span className="font-cormorant text-white font-light text-[17px] tracking-[2px]">
          {MONTHS_FR[month]} {year}
        </span>
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center text-white/60
                     hover:text-gold transition-colors duration-200 bg-transparent border-none cursor-pointer"
        >
          <ChevronRight size={16} />
        </motion.button>
      </div>

      {/* ── Jours de la semaine ─────────────────────────────── */}
      <div className="grid grid-cols-7 bg-gold/8 border-b border-gold/15">
        {DAYS_FR.map((d) => (
          <span key={d} className="py-2 text-center text-[9px] tracking-[2px] uppercase
                                    font-jost text-gold/80 font-medium">
            {d}
          </span>
        ))}
      </div>

      {/* ── Grille des jours ─────────────────────────────────── */}
      <div className="grid grid-cols-7 p-2 gap-y-1">
        {days.map((date, i) => (
          <div
            key={i}
            className={`h-9 flex items-center justify-center text-[12px] font-jost rounded-sm
              ${date ? getCellClass(date) : ''}`}
            onClick={() => date && toStr(date) >= todayStr && handleClick(date)}
            onMouseEnter={() => date && toStr(date) > todayStr && handleEnter(date)}
            onMouseLeave={() => setHoverDate('')}
          >
            {date ? date.getDate() : ''}
          </div>
        ))}
      </div>

      {/* ── Légende ─────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-6 py-3 border-t border-gold/10
                      text-[9px] tracking-[2px] uppercase font-jost text-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-gold rounded-full" />
          Arrivée / Départ
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-gold/20" />
          Séjour
        </span>
      </div>
    </div>
  );
}

// ─── Composant Counter ────────────────────────────────────────────────────────
function Counter({ value, min, max, onChange, label }) {
  return (
    <div>
      <p className="text-[10px] tracking-[3px] uppercase text-muted font-jost mb-3">{label}</p>
      <div className="flex items-center gap-4 border-b border-gold/30 pb-3">
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-9 h-9 flex items-center justify-center bg-cream hover:bg-gold/15
                     transition-colors duration-200 text-dark text-xl leading-none select-none
                     border-none cursor-pointer font-light"
        >
          −
        </motion.button>
        <span className="font-cormorant text-dark text-[28px] font-medium w-7 text-center leading-none">
          {value}
        </span>
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-9 h-9 flex items-center justify-center bg-cream hover:bg-gold/15
                     transition-colors duration-200 text-dark text-xl leading-none select-none
                     border-none cursor-pointer font-light"
        >
          +
        </motion.button>
      </div>
    </div>
  );
}

// ─── Modal principal ──────────────────────────────────────────────────────────
const INITIAL_FORM = {
  room:    null,
  checkin: '',
  checkout:'',
  persons: 1,
  name:    '',
  phone:   '',
  email:   '',
};

const STORAGE_KEY = 'rh_reservation_draft';
const DRAFT_TTL   = 2 * 60 * 60 * 1000; // 2 heures

export default function ReservationModal({ isOpen, onClose, initialRoom = '', successData = null }) {
  const [step,         setStep]         = useState(0);
  const [form,         setForm]         = useState(INITIAL_FORM);
  const [errors,       setErrors]       = useState({});
  const [loading,      setLoading]      = useState(false);
  const [done,           setDone]           = useState(false);
  const [paymentError,   setPaymentError]   = useState('');
  const [sandboxBlocked, setSandboxBlocked] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setDone(false);
    setLoading(false);
    setErrors({});
    setPaymentError('');

    // Retour paiement : affiche directement l'écran de succès
    if (successData) {
      setDone(true);
      return;
    }

    if (initialRoom) {
      const preselect = ROOM_TYPES.find(r => r.label === initialRoom) || null;
      setForm({ ...INITIAL_FORM, room: preselect });
      setStep(0);
      return;
    }

    // Restaure le brouillon depuis sessionStorage si récent (≤ 2h)
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { form: sf, step: ss, ts } = JSON.parse(saved);
        if (Date.now() - ts < DRAFT_TTL) {
          const room = sf.room ? ROOM_TYPES.find(r => r.id === sf.room.id) || null : null;
          setForm({ ...sf, room });
          setStep(ss);
          return;
        }
      }
    } catch {}

    setForm(INITIAL_FORM);
    setStep(0);
  }, [isOpen, initialRoom, successData]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Sauvegarde le brouillon en temps réel dans sessionStorage
  useEffect(() => {
    if (!isOpen || done) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        form: { ...form, room: form.room ? { id: form.room.id } : null },
        step,
        ts: Date.now(),
      }));
    } catch {}
  }, [form, step, isOpen, done]);

  // ── Calculs prix ──────────────────────────────────────────────────────────
  const nights = useMemo(() => {
    if (!form.checkin || !form.checkout) return 0;
    const diff = Math.round((fromStr(form.checkout) - fromStr(form.checkin)) / 86400000);
    return diff > 0 ? diff : 0;
  }, [form.checkin, form.checkout]);

  const basePrice     = form.room && nights > 0 ? form.room.price * nights : 0;
  const discountRate  = nights >= 2 ? 0.10 : 0;
  const discountAmt   = Math.round(basePrice * discountRate);
  const finalPrice    = basePrice - discountAmt;

  // ── Validation par étape ──────────────────────────────────────────────────
  const validateStep = useCallback((s) => {
    const e = {};
    if (s === 0 && !form.room)                      e.room  = 'Veuillez choisir une chambre.';
    if (s === 1) {
      if (!form.checkin || !form.checkout)           e.dates = "Sélectionnez vos dates d'arrivée et de départ.";
      else if (nights < 1)                           e.dates = "La date de départ doit être après l'arrivée.";
    }
    if (s === 2) {
      if (!sanitize(form.name))                      e.name  = 'Votre nom est requis.';
      if (!validatePhone(form.phone))                e.phone = 'Format requis : +225 XXXXXXXXXX';
      if (form.email && !validateEmail(form.email))  e.email = 'Adresse e-mail invalide.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form, nights]);

  const canNext = useCallback(() => {
    if (step === 0) return !!form.room;
    if (step === 1) return !!(form.checkin && form.checkout && nights >= 1);
    if (step === 2) {
      if (!sanitize(form.name)) return false;
      if (!validatePhone(form.phone)) return false;
      if (form.email && !validateEmail(form.email)) return false;
      return true;
    }
    if (step === 3) return true; // Wave est le seul moyen, toujours disponible
    return false;
  }, [step, form, nights]);

  const goNext = () => {
    if (!validateStep(step)) return;
    setStep(s => s + 1);
  };

  const handleSubmit = useCallback(async () => {
    // Double validation JS — protection contre le bypass via l'inspecteur
    if (!form.room || !form.checkin || !form.checkout || !sanitize(form.name) || !validatePhone(form.phone)) return;
    if (nights < 1) return;

    setLoading(true);
    setPaymentError('');

    const base        = `${window.location.origin}${window.location.pathname}`;
    const successUrl  = `${base}?payment=success`;
    const errorUrl    = `${base}?payment=error`;

    const description = `Royal Hotel — ${form.room.label} · ${nights} nuit${nights > 1 ? 's' : ''} · ${sanitize(form.name)}`;

    const result = await createPaymentSession({
      amount:        finalPrice,
      description,
      customerName:  sanitize(form.name),
      customerPhone: sanitize(form.phone),
      successUrl,
      errorUrl,
    });

    setLoading(false);
    setSandboxBlocked(!!result.sandboxBlocked);

    if (result.success && result.paymentUrl) {
      try {
        sessionStorage.setItem('rh_pending_confirmation', JSON.stringify({
          name:       sanitize(form.name),
          email:      form.email?.trim() || '',
          phone:      sanitize(form.phone),
          roomLabel:  form.room.label,
          checkin:    form.checkin,
          checkout:   form.checkout,
          nights,
          persons:    form.persons,
          finalPrice,
        }));
      } catch {}
      window.location.href = result.paymentUrl;
    } else {
      setPaymentError(result.error || 'Une erreur est survenue. Veuillez réessayer.');
    }
  }, [form, nights, finalPrice]); // fin handleSubmit

  // Message WhatsApp pré-rempli pour réservation manuelle
  const buildWhatsAppUrl = useCallback(() => {
    if (!form.room) return `https://wa.me/2250704636363`;
    const msg = encodeURIComponent(
      `Bonjour, je souhaite réserver :\n` +
      `• Chambre : ${form.room?.label ?? ''}\n` +
      `• Arrivée : ${form.checkin || '—'}\n` +
      `• Départ : ${form.checkout || '—'}\n` +
      `• Personnes : ${form.persons}\n` +
      `• Nom : ${form.name || '—'}\n` +
      `• Tél : ${form.phone || '—'}\n` +
      `Montant estimé : ${finalPrice.toLocaleString('fr-FR')} FCFA\n\nMerci !`
    );
    return `https://wa.me/2250704636363?text=${msg}`;
  }, [form, finalPrice]); // fin buildWhatsAppUrl

  const setCheckin  = (v) => setForm(f => ({ ...f, checkin: v }));
  const setCheckout = (v) => setForm(f => ({ ...f, checkout: v }));

  // ── Slide animation ───────────────────────────────────────────────────────
  const slideVariants = {
    enter:  { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } },
    exit:   { opacity: 0, x: -30, transition: { duration: 0.22 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-dark/92 backdrop-blur-xl"
          />

          {/* Panneau */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full max-w-2xl max-h-[94vh] overflow-y-auto
                       bg-cream shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
          >
            {/* Bouton fermer */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center
                         bg-white/80 hover:bg-white transition-colors duration-200 shadow-sm"
              aria-label="Fermer"
            >
              <X size={16} className="text-dark" />
            </button>

            {/* ════ ÉCRAN SUCCÈS ══════════════════════════════════════ */}
            {done ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-10 sm:p-14 text-center flex flex-col items-center"
              >
                {/* Icône animée */}
                <div className="relative mb-10">
                  {/* Anneaux pulsants */}
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1.6, opacity: 0 }}
                    transition={{ delay: 0.4, duration: 1.2, repeat: Infinity, repeatDelay: 0.8 }}
                    className="absolute inset-0 rounded-full border border-gold/40"
                  />
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ delay: 0.7, duration: 1.2, repeat: Infinity, repeatDelay: 0.8 }}
                    className="absolute inset-0 rounded-full border border-gold/20"
                  />
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.15, type: 'spring', stiffness: 220, damping: 14 }}
                    className="relative w-24 h-24 bg-gold/10 border-2 border-gold/40
                               flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ delay: 0.35, duration: 0.4 }}
                    >
                      <Check size={42} className="text-gold" strokeWidth={1.5} />
                    </motion.div>
                  </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                  <span className="section-label">Paiement confirmé</span>
                  <h2 className="font-cormorant text-dark text-[38px] font-light leading-tight mb-4">
                    Merci, {(successData?.name || sanitize(form.name)).split(' ')[0]} !
                  </h2>
                  <p className="text-muted font-jost font-light text-sm leading-relaxed mb-2 max-w-md mx-auto">
                    Votre réservation est confirmée et votre chambre est garantie.
                  </p>
                  <p className="text-muted font-jost font-light text-sm leading-relaxed mb-8 max-w-md mx-auto">
                    Notre équipe vous accueillera le{' '}
                    <strong className="text-dark">
                      {formatDisplay(successData?.checkin || form.checkin)}
                    </strong>.
                    {(successData?.phone || form.phone) && (
                      <> Un reçu vous sera envoyé au <strong className="text-dark">{successData?.phone || sanitize(form.phone)}</strong>.</>
                    )}
                  </p>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-3 gap-6 mb-10 w-full max-w-sm"
                >
                  {(() => {
                    const n = successData?.nights ?? nights;
                    const p = successData?.finalPrice ?? finalPrice;
                    const pe = successData?.persons ?? form.persons;
                    return [
                      [n,                     `Nuit${n > 1 ? 's' : ''}`],
                      [`${fmt(p)} FCFA`,      'Payé'],
                      [pe,                    `Pers.`],
                    ];
                  })().map(([val, lab]) => (
                    <div key={lab} className="text-center border-t-2 border-gold pt-4">
                      <div className="font-cormorant text-gold text-[24px] font-medium leading-none">{val}</div>
                      <div className="text-muted text-[9px] tracking-[2px] uppercase font-jost mt-1.5">{lab}</div>
                    </div>
                  ))}
                </motion.div>

                {/* Chambre */}
                {(successData?.roomLabel || form.room?.label) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mb-8 px-5 py-3 bg-gold/8 border border-gold/25"
                  >
                    <span className="text-[10px] tracking-[3px] uppercase font-jost text-gold">
                      {successData?.roomLabel || form.room?.label}
                    </span>
                  </motion.div>
                )}

                <motion.button
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="btn-dark px-10"
                >
                  Retour à l'accueil
                </motion.button>
              </motion.div>
            ) : (
              <>
                {/* ── EN-TÊTE DARK ──────────────────────────────────── */}
                <div className="bg-dark px-7 sm:px-10 py-8">
                  <span className="text-gold text-[10px] tracking-[5px] uppercase font-jost font-light block mb-1">
                    Réservation en ligne
                  </span>
                  <h2 className="font-cormorant text-white text-[26px] font-light mb-7">
                    Réservez votre séjour
                  </h2>

                  {/* Étapes */}
                  <div className="flex items-center">
                    {STEPS.map((label, i) => (
                      <div key={label} className="flex items-center">
                        <button
                          type="button"
                          onClick={() => i < step && setStep(i)}
                          className={`flex items-center gap-2 transition-all duration-300
                            ${i < step ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px]
                                          font-medium border transition-all duration-400 ${
                            i < step  ? 'bg-gold border-gold text-dark' :
                            i === step ? 'border-gold text-gold bg-transparent' :
                                         'border-white/20 text-white/30 bg-transparent'
                          }`}>
                            {i < step ? <Check size={11} /> : i + 1}
                          </div>
                          <span className={`hidden sm:block text-[9px] tracking-[2px] uppercase
                                            font-jost transition-all duration-300 ${
                            i === step ? 'text-gold' : i < step ? 'text-gold/60' : 'text-white/25'
                          }`}>
                            {label}
                          </span>
                        </button>
                        {i < STEPS.length - 1 && (
                          <div className={`w-6 sm:w-10 h-px mx-2.5 transition-all duration-500 ${
                            i < step ? 'bg-gold/50' : 'bg-white/10'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── CORPS ─────────────────────────────────────────── */}
                <div className="px-7 sm:px-10 py-8">
                  <AnimatePresence mode="wait">

                    {/* ── ÉTAPE 0 : Choix de la chambre ──────────── */}
                    {step === 0 && (
                      <motion.div key="step0" variants={slideVariants} initial="enter" animate="center" exit="exit">
                        <h3 className="font-cormorant text-dark text-[22px] font-light mb-5">
                          Choisissez votre chambre
                        </h3>
                        {errors.room && (
                          <p className="text-red-400 text-[11px] font-jost mb-4">{errors.room}</p>
                        )}
                        <div className="flex flex-col gap-3">
                          {ROOM_TYPES.map((room) => {
                            const isSelected = form.room?.id === room.id;
                            return (
                              <motion.button
                                key={room.id}
                                type="button"
                                whileHover={{ scale: 1.005 }}
                                whileTap={{ scale: 0.998 }}
                                onClick={() => setForm(f => ({ ...f, room }))}
                                className={`w-full flex items-center gap-4 p-4 border-2 text-left
                                           transition-all duration-300 ${
                                  isSelected
                                    ? 'border-gold bg-gold/6 shadow-[0_4px_20px_rgba(201,169,110,0.15)]'
                                    : 'border-gold/20 hover:border-gold/50 bg-white'
                                }`}
                              >
                                {/* Indicateur type */}
                                <div className={`w-12 h-12 flex items-center justify-center shrink-0
                                               text-[9px] tracking-[1.5px] uppercase font-jost text-center
                                               leading-tight transition-all duration-300 ${
                                  isSelected ? 'bg-gold text-dark' : 'bg-cream text-muted'
                                }`}>
                                  {room.type === 'Ventilée' ? '🌀' : room.type === 'Test' ? '🧪' : '❄️'}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-cormorant text-dark text-[17px] font-medium leading-none">
                                      {room.label}
                                    </span>
                                    <span className={`text-[8px] tracking-[1.5px] uppercase font-jost px-2 py-0.5 ${
                                      room.type === 'Ventilée'
                                        ? 'bg-blue-50 text-blue-500'
                                        : room.type === 'Test'
                                          ? 'bg-amber-50 text-amber-600'
                                          : 'bg-gold/10 text-gold'
                                    }`}>
                                      {room.type}
                                    </span>
                                  </div>
                                  <p className="text-[11px] font-jost font-light text-muted leading-snug">
                                    {room.desc}
                                  </p>
                                </div>

                                <div className="text-right shrink-0 ml-2">
                                  <div className="font-cormorant text-gold text-[18px] font-medium leading-none">
                                    {fmt(room.price)}
                                  </div>
                                  <div className="text-muted text-[9px] font-jost mt-0.5">FCFA / nuit</div>
                                </div>

                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                                shrink-0 transition-all duration-300 ${
                                  isSelected ? 'border-gold bg-gold' : 'border-gold/30'
                                }`}>
                                  {isSelected && <Check size={10} className="text-dark" />}
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}

                    {/* ── ÉTAPE 1 : Séjour (calendrier + personnes) ── */}
                    {step === 1 && (
                      <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit"
                                  className="flex flex-col gap-6">
                        <h3 className="font-cormorant text-dark text-[22px] font-light">
                          Dates de séjour
                        </h3>

                        {/* Dates sélectionnées */}
                        {(form.checkin || form.checkout) && (
                          <div className="flex items-center gap-4 text-sm font-jost font-light">
                            <span className={`px-3 py-2 text-[11px] flex-1 text-center
                                            border transition-all duration-300 ${
                              form.checkin
                                ? 'border-gold/50 bg-gold/8 text-dark'
                                : 'border-gold/20 text-muted'
                            }`}>
                              <span className="block text-[8px] tracking-[2px] uppercase text-gold mb-0.5">
                                Arrivée
                              </span>
                              {form.checkin ? formatDisplay(form.checkin) : '—'}
                            </span>
                            <ChevronRight size={14} className="text-gold/50 shrink-0" />
                            <span className={`px-3 py-2 text-[11px] flex-1 text-center
                                            border transition-all duration-300 ${
                              form.checkout
                                ? 'border-gold/50 bg-gold/8 text-dark'
                                : 'border-gold/20 text-muted'
                            }`}>
                              <span className="block text-[8px] tracking-[2px] uppercase text-gold mb-0.5">
                                Départ
                              </span>
                              {form.checkout ? formatDisplay(form.checkout) : '—'}
                            </span>
                          </div>
                        )}

                        {errors.dates && (
                          <p className="text-red-400 text-[11px] font-jost -mt-2">{errors.dates}</p>
                        )}

                        {/* Calendrier */}
                        <CalendarPicker
                          checkin={form.checkin}
                          checkout={form.checkout}
                          onCheckin={setCheckin}
                          onCheckout={setCheckout}
                        />

                        {/* Prix en temps réel */}
                        <AnimatePresence>
                          {nights > 0 && form.room && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="bg-gold/6 border border-gold/25 p-5">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <Calendar size={15} className="text-gold" />
                                    <span className="text-[10px] tracking-[2px] uppercase font-jost text-muted">
                                      {nights} nuit{nights > 1 ? 's' : ''} · {form.room.label}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-end justify-between">
                                  <div>
                                    <div className="text-[11px] font-jost text-muted">
                                      {fmt(form.room.price)} × {nights} nuit{nights > 1 ? 's' : ''}
                                    </div>
                                    {discountRate > 0 && (
                                      <div className="flex items-center gap-1.5 mt-1">
                                        <Tag size={11} className="text-green-500" />
                                        <span className="text-[10px] font-jost text-green-600">
                                          Réduction −10% (séjour ≥ 2 nuits) : −{fmt(discountAmt)} FCFA
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <div className="font-cormorant text-gold text-[26px] font-medium leading-none">
                                      {fmt(finalPrice)}
                                    </div>
                                    <div className="text-muted text-[9px] font-jost">FCFA total</div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Personnes */}
                        <Counter
                          value={form.persons}
                          min={1}
                          max={10}
                          label="Personne(s) *"
                          onChange={(v) => setForm(f => ({ ...f, persons: v }))}
                        />
                      </motion.div>
                    )}

                    {/* ── ÉTAPE 2 : Coordonnées ───────────────────── */}
                    {step === 2 && (
                      <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit"
                                  className="flex flex-col gap-6">
                        <h3 className="font-cormorant text-dark text-[22px] font-light">
                          Vos coordonnées
                        </h3>

                        {/* Récap chambre */}
                        {form.room && nights > 0 && (
                          <div className="flex items-center justify-between bg-dark/5 p-4 border-l-2 border-gold">
                            <div>
                              <div className="font-cormorant text-dark text-[16px] font-medium">
                                {form.room.label}
                              </div>
                              <div className="text-muted text-[11px] font-jost font-light mt-0.5">
                                {formatDisplay(form.checkin)} → {formatDisplay(form.checkout)} · {nights} nuit{nights > 1 ? 's' : ''} · {form.persons} pers.
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-cormorant text-gold text-[20px] font-medium leading-none">
                                {fmt(finalPrice)}
                              </div>
                              <div className="text-muted text-[9px] font-jost">FCFA</div>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col gap-5">
                          {/* Nom */}
                          <div>
                            <label className="text-[10px] tracking-[3px] uppercase text-muted font-jost block mb-2">
                              Nom complet *
                            </label>
                            <input
                              type="text"
                              value={form.name}
                              onChange={(e) => {
                                // Filtrage sans trim() pour permettre les espaces entre prénom et nom
                                const v = e.target.value
                                  .replace(/<[^>]*>/g, '')
                                  .replace(/[<>&"'`]/g, '')
                                  .slice(0, 100);
                                setForm(f => ({ ...f, name: v }));
                                if (errors.name) setErrors(er => ({ ...er, name: '' }));
                              }}
                              placeholder="Jean Kouassi"
                              maxLength={100}
                              className={`form-input ${errors.name ? 'border-red-300' : ''}`}
                            />
                            {errors.name && <p className="text-red-400 text-[10px] font-jost mt-1">{errors.name}</p>}
                          </div>

                          {/* Téléphone */}
                          <div>
                            <label className="text-[10px] tracking-[3px] uppercase text-muted font-jost block mb-2">
                              Téléphone * <span className="normal-case text-muted/70">(format : +225 XXXXXXXXXX)</span>
                            </label>
                            <input
                              type="tel"
                              value={form.phone}
                              onChange={(e) => {
                                const v = e.target.value.replace(/[^+0-9\s\-\.()]/g, '').slice(0, 20);
                                setForm(f => ({ ...f, phone: v }));
                                if (errors.phone) setErrors(er => ({ ...er, phone: '' }));
                              }}
                              placeholder="+225 07 00 00 00 00"
                              maxLength={20}
                              className={`form-input ${errors.phone ? 'border-red-300' : ''}`}
                            />
                            {errors.phone && <p className="text-red-400 text-[10px] font-jost mt-1">{errors.phone}</p>}
                          </div>

                          {/* Email (optionnel) */}
                          <div>
                            <label className="text-[10px] tracking-[3px] uppercase text-muted font-jost block mb-2">
                              Email <span className="normal-case text-muted/60">(optionnel)</span>
                            </label>
                            <input
                              type="text"
                              value={form.email}
                              onChange={(e) => {
                                const v = sanitize(e.target.value).slice(0, 150);
                                setForm(f => ({ ...f, email: v }));
                                if (errors.email) setErrors(er => ({ ...er, email: '' }));
                              }}
                              placeholder="jean@exemple.com"
                              maxLength={150}
                              className={`form-input ${errors.email ? 'border-red-300' : ''}`}
                            />
                            {errors.email && <p className="text-red-400 text-[10px] font-jost mt-1">{errors.email}</p>}
                          </div>
                        </div>

                        <p className="text-muted text-[10px] font-jost font-light leading-relaxed">
                          Champs * obligatoires. Vos données sont utilisées uniquement pour votre réservation.
                        </p>
                      </motion.div>
                    )}

                    {/* ── ÉTAPE 3 : Récapitulatif + Paiement Wave ─── */}
                    {step === 3 && (
                      <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit"
                                  className="flex flex-col gap-6">
                        <h3 className="font-cormorant text-dark text-[22px] font-light">
                          Récapitulatif & Paiement
                        </h3>

                        {/* Récapitulatif complet */}
                        <div className="bg-white border border-gold/20 overflow-hidden">
                          <div className="bg-dark px-5 py-3">
                            <span className="text-[9px] tracking-[3px] uppercase font-jost text-gold">
                              Détail de votre réservation
                            </span>
                          </div>
                          <div className="p-5 flex flex-col gap-3">
                            {[
                              ['Chambre',   form.room?.label ?? ''],
                              ['Arrivée',   formatDisplay(form.checkin)],
                              ['Départ',    formatDisplay(form.checkout)],
                              ['Durée',     `${nights} nuit${nights > 1 ? 's' : ''}`],
                              ['Personnes', `${form.persons} pers.`],
                              ['Client',    sanitize(form.name)],
                              ['Tél.',      sanitize(form.phone)],
                            ].map(([k, v]) => (
                              <div key={k} className="flex items-baseline justify-between gap-4">
                                <span className="text-[10px] tracking-[2px] uppercase font-jost text-muted shrink-0">{k}</span>
                                <span className="text-[13px] font-jost text-dark text-right">{v}</span>
                              </div>
                            ))}

                            <div className="border-t border-gold/15 mt-1 pt-3 flex flex-col gap-1.5">
                              <div className="flex justify-between">
                                <span className="text-[10px] tracking-[2px] uppercase font-jost text-muted">Sous-total</span>
                                <span className="text-[13px] font-jost text-dark">{fmt(basePrice)} FCFA</span>
                              </div>
                              {discountRate > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-[10px] tracking-[2px] uppercase font-jost text-green-600 flex items-center gap-1">
                                    <Tag size={10} />
                                    Réduction −10%
                                  </span>
                                  <span className="text-[13px] font-jost text-green-600">−{fmt(discountAmt)} FCFA</span>
                                </div>
                              )}
                            </div>

                            <div className="border-t-2 border-gold pt-3 flex justify-between items-center">
                              <span className="text-[10px] tracking-[3px] uppercase font-jost text-dark font-medium">
                                Total à payer
                              </span>
                              <span className="font-cormorant text-gold text-[26px] font-medium leading-none">
                                {fmt(finalPrice)} FCFA
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Moyen de paiement : Wave uniquement */}
                        <div className="flex items-center gap-4 bg-white border-2 border-[#1A73E8]/40 p-5">
                          {/* Logo Wave */}
                          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-[#1A73E8]/20 bg-white">
                            <img src={waveLogo} alt="Wave" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <div className="font-jost text-dark text-[14px] font-medium">Wave</div>
                            <div className="text-muted text-[11px] font-jost font-light mt-0.5">
                              Vous serez redirigé vers la page de paiement sécurisée Wave via GeniusPay
                            </div>
                          </div>
                          <Check size={18} className="text-[#1A73E8] shrink-0" />
                        </div>

                        {/* Erreur paiement + fallback WhatsApp */}
                        {paymentError && (
                          <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col gap-3 bg-red-50 border border-red-200 p-4"
                          >
                            <div className="flex items-start gap-3">
                              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-red-600 text-[12px] font-jost font-medium">
                                  Erreur de paiement
                                </p>
                                <p className="text-red-500 text-[11px] font-jost font-light mt-0.5 leading-relaxed">
                                  {paymentError}
                                </p>
                              </div>
                            </div>

                            {/* Options de secours */}
                            <div className="border-t border-red-200 pt-3 flex flex-col sm:flex-row gap-2">
                              <button
                                type="button"
                                onClick={() => { setPaymentError(''); setSandboxBlocked(false); }}
                                className="flex items-center justify-center gap-2 px-4 py-2.5
                                           border border-red-300 text-red-600 text-[10px] tracking-[2px]
                                           uppercase font-jost hover:bg-red-100 transition-colors duration-200
                                           cursor-pointer bg-transparent flex-1"
                              >
                                <RefreshCw size={11} />
                                Réessayer
                              </button>
                              <a
                                href={buildWhatsAppUrl()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 px-4 py-2.5
                                           bg-[#25D366] text-white text-[10px] tracking-[2px]
                                           uppercase font-jost hover:bg-[#1DA851]
                                           transition-colors duration-200 flex-1"
                              >
                                <MessageCircle size={11} />
                                Réserver via WhatsApp
                              </a>
                            </div>
                          </motion.div>
                        )}

                        {/* Badge mode sandbox */}
                        {paymentMode === 'sandbox' && (
                          <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 p-3">
                            <span className="text-[9px] tracking-[2px] uppercase font-jost font-semibold text-amber-600">
                              🧪 Mode Test (Sandbox) — aucun débit réel
                            </span>
                          </div>
                        )}

                        {/* Note sécurité */}
                        <div className="flex items-start gap-2 text-[10px] font-jost font-light text-muted leading-relaxed
                                        border border-gold/15 p-4 bg-white">
                          <Banknote size={14} className="text-gold shrink-0 mt-0.5" />
                          <span>
                            Paiement intégral requis à la confirmation via Wave (GeniusPay).
                            Votre chambre est garantie dès réception du paiement.
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── Navigation bas ────────────────────────────── */}
                  <div className="flex items-center justify-between mt-10 pt-7 border-t border-gold/25">
                    {step > 0 ? (
                      <button
                        type="button"
                        onClick={() => setStep(s => s - 1)}
                        className="flex items-center gap-2 text-[10px] tracking-[2px] uppercase font-jost
                                   text-muted hover:text-dark transition-colors duration-200
                                   bg-transparent border-none cursor-pointer"
                      >
                        <ChevronLeft size={13} />
                        Retour
                      </button>
                    ) : <div />}

                    {step < STEPS.length - 1 ? (
                      <motion.button
                        type="button"
                        whileTap={canNext() ? { scale: 0.97 } : {}}
                        onClick={goNext}
                        className={`btn-gold flex items-center gap-3 transition-opacity duration-300 ${
                          !canNext() ? 'opacity-40 cursor-not-allowed' : ''
                        }`}
                      >
                        Continuer
                        <ChevronRight size={14} />
                      </motion.button>
                    ) : (
                      <motion.button
                        type="button"
                        whileTap={!loading ? { scale: 0.97 } : {}}
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`btn-gold flex items-center gap-3 transition-opacity duration-300 ${
                          loading ? 'opacity-60 cursor-not-allowed' : ''
                        }`}
                      >
                        {loading ? (
                          <>
                            <span className="inline-block w-4 h-4 border-2 border-dark/25 border-t-dark
                                             rounded-full animate-spin" />
                            Connexion à Wave…
                          </>
                        ) : (
                          <>
                            <ExternalLink size={14} />
                            Payer avec Wave →
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

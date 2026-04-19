// ui/ReservationModal.jsx — Modal de réservation multi-étapes
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ChevronLeft, ChevronRight, Calendar, Users, Sparkles } from 'lucide-react';
import { ROOMS } from '../../data/constants';

const STEPS = ['Chambre', 'Séjour', 'Coordonnées'];

const INITIAL = {
  room: '',
  checkin: '',
  checkout: '',
  adults: 2,
  children: 0,
  name: '',
  email: '',
  phone: '',
  requests: '',
};

function Counter({ value, min, max, onChange }) {
  return (
    <div className="flex items-center gap-4 border-b border-gold-light/60 pb-3 pt-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-8 h-8 flex items-center justify-center bg-cream hover:bg-gold/10
                   transition-colors duration-200 text-dark font-light text-xl leading-none select-none"
      >
        −
      </button>
      <span className="font-cormorant text-dark text-[26px] font-medium w-6 text-center leading-none">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-8 h-8 flex items-center justify-center bg-cream hover:bg-gold/10
                   transition-colors duration-200 text-dark font-light text-xl leading-none select-none"
      >
        +
      </button>
    </div>
  );
}

export default function ReservationModal({ isOpen, onClose, initialRoom = '' }) {
  const [step, setStep]       = useState(0);
  const [form, setForm]       = useState({ ...INITIAL, room: initialRoom });
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);

  // Reset quand la modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setForm({ ...INITIAL, room: initialRoom });
      setStep(0);
      setDone(false);
      setLoading(false);
    }
  }, [isOpen, initialRoom]);

  // Bloquer le scroll body
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const update = (key) => (e) => {
    const val = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setForm(f => ({ ...f, [key]: val }));
  };

  const nights = (() => {
    if (!form.checkin || !form.checkout) return 0;
    const diff = (new Date(form.checkout) - new Date(form.checkin)) / 86400000;
    return diff > 0 ? diff : 0;
  })();

  const selectedRoom = ROOMS.find(r => r.title === form.room);

  const canNext = () => {
    if (step === 0) return !!form.room;
    if (step === 1) return !!(form.checkin && form.checkout && nights > 0 && form.adults >= 1);
    if (step === 2) return !!(form.name && form.email);
    return false;
  };

  const handleSubmit = () => {
    if (!canNext()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 1600);
  };

  const totalPrice = selectedRoom && nights > 0
    ? (parseInt(selectedRoom.price.replace(/\s/g, '')) * nights).toLocaleString('fr-FR')
    : null;

  const today = new Date().toISOString().split('T')[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-dark/90 backdrop-blur-lg"
          />

          {/* Panneau */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-cream shadow-[0_32px_80px_rgba(0,0,0,0.4)]"
          >
            {/* Bouton fermer */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-20 w-10 h-10 flex items-center justify-center
                         bg-white/80 hover:bg-white transition-colors duration-200 shadow-sm"
              aria-label="Fermer"
            >
              <X size={17} className="text-dark" />
            </button>

            {/* ─── SUCCÈS ──────────────────────────────────────────────── */}
            {done ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-12 text-center flex flex-col items-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.15, type: 'spring', stiffness: 220, damping: 14 }}
                  className="w-24 h-24 bg-gold/10 border border-gold/30 flex items-center justify-center mb-8"
                >
                  <Check size={40} className="text-gold" strokeWidth={1.5} />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <span className="section-label">Réservation reçue</span>
                  <h2 className="font-cormorant text-dark text-[38px] font-light leading-tight mb-4">
                    Merci, {form.name.split(' ')[0]} !
                  </h2>
                  <p className="text-muted font-jost font-light text-sm leading-relaxed mb-3 max-w-md mx-auto">
                    Votre demande pour la <strong className="font-medium text-dark">{form.room}</strong>{' '}
                    a bien été reçue. Notre équipe vous contactera à{' '}
                    <strong className="font-medium text-dark">{form.email}</strong> sous 2 heures.
                  </p>
                </motion.div>

                {totalPrice && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="flex gap-10 mb-10 mt-6"
                  >
                    <div className="text-center">
                      <div className="font-cormorant text-gold text-[36px] font-light leading-none">{nights}</div>
                      <div className="text-muted text-[10px] tracking-[3px] uppercase font-jost mt-1">Nuit{nights > 1 ? 's' : ''}</div>
                    </div>
                    <div className="w-px bg-gold-light/40" />
                    <div className="text-center">
                      <div className="font-cormorant text-gold text-[36px] font-light leading-none">{totalPrice}</div>
                      <div className="text-muted text-[10px] tracking-[3px] uppercase font-jost mt-1">FCFA total</div>
                    </div>
                    <div className="w-px bg-gold-light/40" />
                    <div className="text-center">
                      <div className="font-cormorant text-gold text-[36px] font-light leading-none">
                        {form.adults + form.children}
                      </div>
                      <div className="text-muted text-[10px] tracking-[3px] uppercase font-jost mt-1">Voyageur{(form.adults + form.children) > 1 ? 's' : ''}</div>
                    </div>
                  </motion.div>
                )}

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  onClick={onClose}
                  className="btn-dark"
                >
                  Parfait, merci !
                </motion.button>
              </motion.div>
            ) : (
              <>
                {/* ─── EN-TÊTE DARK ──────────────────────────────────── */}
                <div className="bg-dark px-8 sm:px-10 py-8">
                  <span className="text-gold text-[10px] tracking-[5px] uppercase font-jost font-light block mb-2">
                    Réservation en ligne
                  </span>
                  <h2 className="font-cormorant text-white text-[28px] font-light">
                    Réservez votre séjour
                  </h2>

                  {/* Indicateur d'étapes */}
                  <div className="flex items-center mt-7">
                    {STEPS.map((label, i) => (
                      <div key={label} className="flex items-center">
                        <button
                          type="button"
                          onClick={() => i < step && setStep(i)}
                          className={`flex items-center gap-2.5 transition-all duration-300 ${
                            i < step ? 'cursor-pointer' : 'cursor-default'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium border transition-all duration-400 ${
                            i < step
                              ? 'bg-gold border-gold text-dark'
                              : i === step
                              ? 'border-gold text-gold bg-transparent'
                              : 'border-white/20 text-white/30 bg-transparent'
                          }`}>
                            {i < step ? <Check size={11} /> : i + 1}
                          </div>
                          <span className={`hidden sm:block text-[10px] tracking-[2px] uppercase font-jost transition-all duration-300 ${
                            i === step ? 'text-gold' : i < step ? 'text-gold/60' : 'text-white/30'
                          }`}>
                            {label}
                          </span>
                        </button>
                        {i < STEPS.length - 1 && (
                          <div className={`w-8 sm:w-14 h-px mx-3 transition-all duration-500 ${
                            i < step ? 'bg-gold/50' : 'bg-white/12'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ─── CORPS ─────────────────────────────────────────── */}
                <div className="px-8 sm:px-10 py-9">
                  <AnimatePresence mode="wait">

                    {/* ÉTAPE 0 : Choix de la chambre */}
                    {step === 0 && (
                      <motion.div
                        key="step0"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                      >
                        <h3 className="font-cormorant text-dark text-[23px] font-light mb-6">
                          Choisissez votre chambre
                        </h3>
                        <div className="flex flex-col gap-3">
                          {ROOMS.map((room) => {
                            const isSelected = form.room === room.title;
                            return (
                              <motion.button
                                key={room.title}
                                type="button"
                                whileHover={{ scale: 1.005 }}
                                whileTap={{ scale: 0.998 }}
                                onClick={() => setForm(f => ({ ...f, room: room.title }))}
                                className={`w-full flex items-center gap-4 p-4 border-2 text-left transition-all duration-300 ${
                                  isSelected
                                    ? 'border-gold bg-gold/6 shadow-[0_4px_20px_rgba(205,154,182,0.2)]'
                                    : 'border-gold-light/25 hover:border-gold/40 bg-white'
                                }`}
                              >
                                <img
                                  src={room.image}
                                  alt={room.title}
                                  className="w-20 h-14 object-cover shrink-0"
                                  loading="lazy"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-cormorant text-dark text-[19px] font-medium leading-none">
                                      {room.title}
                                    </span>
                                    {room.badge && (
                                      <span className="text-[8px] tracking-[2px] uppercase font-jost bg-gold text-dark px-2 py-0.5 font-medium">
                                        {room.badge}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap gap-x-3">
                                    {room.features.slice(0, 3).map(f => (
                                      <span key={f} className="text-[10px] font-jost font-light text-muted">
                                        · {f}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div className="text-right shrink-0">
                                  <div className="font-cormorant text-gold text-[19px] font-medium leading-none">
                                    {room.price}
                                  </div>
                                  <div className="text-muted text-[10px] font-jost font-light">
                                    {room.currency}/nuit
                                  </div>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
                                  isSelected ? 'border-gold bg-gold' : 'border-gold-light/40'
                                }`}>
                                  {isSelected && <Check size={10} className="text-dark" />}
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}

                    {/* ÉTAPE 1 : Dates & voyageurs */}
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                        className="flex flex-col gap-7"
                      >
                        <h3 className="font-cormorant text-dark text-[23px] font-light">
                          Dates & Voyageurs
                        </h3>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="text-[10px] tracking-[3px] uppercase text-muted font-jost block mb-2">
                              Arrivée *
                            </label>
                            <input
                              type="date"
                              value={form.checkin}
                              min={today}
                              onChange={update('checkin')}
                              className="form-input"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] tracking-[3px] uppercase text-muted font-jost block mb-2">
                              Départ *
                            </label>
                            <input
                              type="date"
                              value={form.checkout}
                              min={form.checkin || today}
                              onChange={update('checkout')}
                              className="form-input"
                            />
                          </div>
                        </div>

                        {/* Résumé prix */}
                        <AnimatePresence>
                          {nights > 0 && selectedRoom && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="bg-gold/8 border border-gold/25 p-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Calendar size={18} className="text-gold" />
                                  <div>
                                    <div className="text-[10px] tracking-[2px] uppercase font-jost text-muted">
                                      {nights} nuit{nights > 1 ? 's' : ''} · {selectedRoom.title}
                                    </div>
                                    <div className="font-cormorant text-dark text-[22px] font-medium leading-tight mt-0.5">
                                      {totalPrice} FCFA
                                    </div>
                                  </div>
                                </div>
                                <Sparkles size={18} className="text-gold/60" />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Voyageurs */}
                        <div className="grid grid-cols-2 gap-8">
                          <div>
                            <label className="text-[10px] tracking-[3px] uppercase text-muted font-jost block mb-3">
                              Adultes *
                            </label>
                            <Counter
                              value={form.adults}
                              min={1}
                              max={4}
                              onChange={(v) => setForm(f => ({ ...f, adults: v }))}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] tracking-[3px] uppercase text-muted font-jost block mb-3">
                              Enfants
                            </label>
                            <Counter
                              value={form.children}
                              min={0}
                              max={4}
                              onChange={(v) => setForm(f => ({ ...f, children: v }))}
                            />
                          </div>
                        </div>

                        {/* Demandes spéciales */}
                        <div>
                          <label className="text-[10px] tracking-[3px] uppercase text-muted font-jost block mb-2">
                            Demandes spéciales
                          </label>
                          <textarea
                            rows={3}
                            value={form.requests}
                            onChange={update('requests')}
                            placeholder="Arrivée tardive, lit bébé, chambre non-fumeur, vue particulière…"
                            className="form-input resize-none"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* ÉTAPE 2 : Coordonnées */}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                        className="flex flex-col gap-7"
                      >
                        <h3 className="font-cormorant text-dark text-[23px] font-light">
                          Vos coordonnées
                        </h3>

                        {/* Récap chambre */}
                        {selectedRoom && (
                          <div className="flex items-center gap-4 bg-dark/5 p-4">
                            <img
                              src={selectedRoom.image}
                              alt={selectedRoom.title}
                              className="w-16 h-12 object-cover shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-cormorant text-dark text-[18px] font-medium leading-none">
                                {selectedRoom.title}
                              </div>
                              {nights > 0 && (
                                <div className="text-muted text-[11px] font-jost font-light mt-1">
                                  {form.checkin} → {form.checkout} · {nights} nuit{nights > 1 ? 's' : ''}
                                </div>
                              )}
                            </div>
                            {totalPrice && (
                              <div className="text-right shrink-0">
                                <div className="font-cormorant text-gold text-[20px] font-medium leading-none">
                                  {totalPrice}
                                </div>
                                <div className="text-muted text-[10px] font-jost">FCFA</div>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex flex-col gap-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                              <label className="text-[10px] tracking-[3px] uppercase text-muted font-jost block mb-2">
                                Nom complet *
                              </label>
                              <input
                                type="text"
                                value={form.name}
                                onChange={update('name')}
                                placeholder="Jean Kouassi"
                                className="form-input"
                              />
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
                                className="form-input"
                              />
                            </div>
                          </div>
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
                        </div>

                        <p className="text-muted text-[11px] font-jost font-light leading-relaxed">
                          En soumettant ce formulaire, vous acceptez d'être contacté par notre équipe
                          dans les 2 heures suivant votre demande de réservation.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ─── NAVIGATION BAS ───────────────────────────── */}
                  <div className="flex items-center justify-between mt-10 pt-8 border-t border-gold-light/30">
                    {step > 0 ? (
                      <button
                        type="button"
                        onClick={() => setStep(s => s - 1)}
                        className="flex items-center gap-2 text-[10px] tracking-[2px] uppercase font-jost
                                   text-muted hover:text-dark transition-colors duration-200 bg-transparent border-none cursor-pointer"
                      >
                        <ChevronLeft size={14} />
                        Retour
                      </button>
                    ) : <div />}

                    {step < STEPS.length - 1 ? (
                      <motion.button
                        type="button"
                        whileTap={canNext() ? { scale: 0.97 } : {}}
                        onClick={() => canNext() && setStep(s => s + 1)}
                        className={`btn-gold flex items-center gap-3 transition-opacity duration-300 ${
                          !canNext() ? 'opacity-35 cursor-not-allowed' : ''
                        }`}
                      >
                        Continuer
                        <ChevronRight size={14} />
                      </motion.button>
                    ) : (
                      <motion.button
                        type="button"
                        whileTap={canNext() && !loading ? { scale: 0.97 } : {}}
                        onClick={handleSubmit}
                        disabled={!canNext() || loading}
                        className={`btn-gold flex items-center gap-3 transition-opacity duration-300 ${
                          !canNext() || loading ? 'opacity-40 cursor-not-allowed' : ''
                        }`}
                      >
                        {loading && (
                          <span className="inline-block w-4 h-4 border-2 border-dark/25 border-t-dark
                                           rounded-full animate-spin" />
                        )}
                        {loading ? 'Envoi…' : 'Confirmer la réservation →'}
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

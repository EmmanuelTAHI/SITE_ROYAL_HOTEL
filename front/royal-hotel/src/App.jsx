// App.jsx — Assemblage principal + gestion modal réservation + retour paiement GeniusPay
import { useState, useEffect, useCallback } from 'react';

// ── Layout ────────────────────────────────────────────────────────────────────
import Navbar         from './components/layout/Navbar';
import Footer         from './components/layout/Footer';

// ── UI Utilities ──────────────────────────────────────────────────────────────
import Loader           from './components/ui/Loader';
import ScrollProgress   from './components/ui/ScrollProgress';
import ReservationModal from './components/ui/ReservationModal';
import FloatingActions  from './components/ui/FloatingActions';
import { ToastContainer, useToast } from './components/ui/Toast';

// ── Sections ──────────────────────────────────────────────────────────────────
import Hero         from './components/sections/Hero';
import About        from './components/sections/About';
import Services     from './components/sections/Services';
import Gallery      from './components/sections/Gallery';
import Testimonials from './components/sections/Testimonials';
import CTA          from './components/sections/CTA';
import Contact      from './components/sections/Contact';

// ── GeniusPay — parse les paramètres de retour depuis l'URL ──────────────────
import { parsePaymentReturn, clearPaymentParams } from './lib/geniuspay';

// ── EmailJS — confirmation de réservation ────────────────────────────────────
import { sendReservationConfirmation } from './lib/emailService';

// ── Supabase — sauvegarde des réservations ───────────────────────────────────
import { saveReservation } from './lib/supabase';

export default function App() {
  const [loading, setLoading]           = useState(true);
  const [modalOpen, setModalOpen]       = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  const { toasts, addToast, removeToast } = useToast();

  // ── Loader initial ────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // ── Retour depuis GeniusPay (après paiement Wave) ────────────────────────
  useEffect(() => {
    const { status } = parsePaymentReturn();

    if (status === 'success') {
      clearPaymentParams();
      try { sessionStorage.removeItem('rh_reservation_draft'); } catch {}

      let confirmData = null;
      try {
        const raw = sessionStorage.getItem('rh_pending_confirmation');
        if (raw) {
          confirmData = JSON.parse(raw);
          sessionStorage.removeItem('rh_pending_confirmation');
          saveReservation(confirmData).catch(() => {});
          if (confirmData.email) {
            sendReservationConfirmation(confirmData).catch(() => {});
          }
        }
      } catch {}

      setPaymentSuccess(confirmData || {});
      setModalOpen(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (status === 'error' || status === 'cancel') {
      clearPaymentParams();
      addToast(
        'Paiement non finalisé. Vous pouvez relancer une réservation à tout moment.',
        'error',
        6000,
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Écoute l'événement global "openReservation" ──────────────────────────
  useEffect(() => {
    const handler = (e) => {
      setSelectedRoom(e.detail?.room || '');
      setModalOpen(true);
    };
    window.addEventListener('openReservation', handler);
    return () => window.removeEventListener('openReservation', handler);
  }, []);

  const openReservation = useCallback((room = '') => {
    setSelectedRoom(room);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setPaymentSuccess(null);
  }, []);

  return (
    <>
      {/* ── Loader d'entrée ──────────────────────────────────────── */}
      <Loader isVisible={loading} />

      {/* ── Barre de progression scroll ──────────────────────────── */}
      <ScrollProgress />

      {/* ── Navigation sticky ────────────────────────────────────── */}
      <Navbar onReserve={openReservation} />

      {/* ── Contenu principal ────────────────────────────────────── */}
      <main>
        <Hero />
        <About />
        <Services />
        <Gallery />
        <Testimonials />
        <CTA />
        <Contact />
      </main>

      {/* ── Pied de page ─────────────────────────────────────────── */}
      <Footer />

      {/* ── Modal de réservation ─────────────────────────────────── */}
      <ReservationModal
        isOpen={modalOpen}
        onClose={closeModal}
        initialRoom={selectedRoom}
        successData={paymentSuccess}
      />

      {/* ── Boutons flottants ────────────────────────────────────── */}
      <FloatingActions onReserve={() => openReservation()} />

      {/* ── Notifications toast ──────────────────────────────────── */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}

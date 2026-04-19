// App.jsx — Assemblage principal + gestion modal réservation + toasts
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
import Rooms        from './components/sections/Rooms';
import Testimonials from './components/sections/Testimonials';
import CTA          from './components/sections/CTA';
import Contact      from './components/sections/Contact';

export default function App() {
  const [loading, setLoading]             = useState(true);
  const [modalOpen, setModalOpen]         = useState(false);
  const [selectedRoom, setSelectedRoom]   = useState('');

  const { toasts, addToast, removeToast } = useToast();

  // Loader initial
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Écoute l'événement global "openReservation" émis depuis Rooms, CTA, Hero…
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
        <Rooms />
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
      />

      {/* ── Boutons flottants ────────────────────────────────────── */}
      <FloatingActions onReserve={() => openReservation()} />

      {/* ── Notifications toast ──────────────────────────────────── */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}

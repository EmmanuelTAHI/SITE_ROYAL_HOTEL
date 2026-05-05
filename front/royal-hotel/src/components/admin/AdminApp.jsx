// admin/AdminApp.jsx — Racine de l'espace admin (gestion auth)
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLogin     from './AdminLogin';
import AdminDashboard from './AdminDashboard';

export default function AdminApp() {
  const [session, setSession] = useState(undefined); // undefined = chargement en cours

  useEffect(() => {
    // Récupère la session existante
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Écoute les changements d'auth (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Spinner de chargement initial
  if (session === undefined) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-gold/25 border-t-gold rounded-full animate-spin" />
          <span className="text-white/30 text-[10px] tracking-[3px] uppercase font-jost">
            Chargement…
          </span>
        </div>
      </div>
    );
  }

  return session
    ? <AdminDashboard session={session} />
    : <AdminLogin />;
}

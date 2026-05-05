// admin/AdminLogin.jsx — Formulaire de connexion admin
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) setError('Identifiants incorrects. Vérifiez votre email et mot de passe.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo / Titre */}
        <div className="text-center mb-10">
          <span className="text-gold text-[9px] tracking-[6px] uppercase font-jost">Royal Hotel</span>
          <h1 className="font-cormorant text-white text-[34px] font-light mt-2 leading-none">
            Espace Admin
          </h1>
          <p className="text-white/30 text-[11px] font-jost mt-3">
            Accès réservé au personnel autorisé
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleLogin} className="border border-white/10 p-8 bg-white/3">

          <div className="flex flex-col gap-5">
            {/* Email */}
            <div>
              <label className="text-[9px] tracking-[3px] uppercase text-white/40 font-jost block mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="admin@royalhotel.ci"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20
                             pl-9 pr-4 py-3 text-[13px] font-jost outline-none
                             focus:border-gold/50 transition-colors duration-200"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="text-[9px] tracking-[3px] uppercase text-white/40 font-jost block mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20
                             pl-9 pr-10 py-3 text-[13px] font-jost outline-none
                             focus:border-gold/50 transition-colors duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                >
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Erreur */}
            {error && (
              <p className="text-red-400 text-[11px] font-jost bg-red-500/10 border border-red-500/20 px-3 py-2">
                {error}
              </p>
            )}

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-dark py-3 text-[10px] tracking-[3px] uppercase
                         font-jost font-medium hover:bg-gold/85 transition-colors
                         disabled:opacity-40 disabled:cursor-not-allowed mt-1"
            >
              {loading ? 'Connexion en cours…' : 'Se connecter'}
            </button>
          </div>
        </form>

        {/* Retour */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="text-white/25 text-[9px] tracking-[2px] uppercase font-jost
                       hover:text-white/50 transition-colors duration-200"
          >
            ← Retour au site
          </a>
        </div>
      </div>
    </div>
  );
}

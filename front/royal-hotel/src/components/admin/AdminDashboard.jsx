// admin/AdminDashboard.jsx — Tableau de bord des réservations
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import {
  LogOut, Download, Search, RefreshCw,
  Calendar, Users, TrendingUp, Bed,
  ChevronUp, ChevronDown, X,
} from 'lucide-react';

// ─── Utilitaires ──────────────────────────────────────────────────────────────
const fmt      = (n) => Number(n || 0).toLocaleString('fr-FR');
const fmtDate  = (s) => {
  if (!s) return '—';
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
};
const fmtShort = (s) => {
  if (!s) return '—';
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' });
};
const todayStr = () => new Date().toISOString().split('T')[0];

// ─── Périodes disponibles ─────────────────────────────────────────────────────
const PERIODS = [
  { key: 'all',        label: 'Tout' },
  { key: 'year',       label: 'Cette année' },
  { key: '3months',    label: '3 derniers mois' },
  { key: 'month',      label: 'Ce mois' },
  { key: 'last_month', label: 'Mois dernier' },
  { key: 'custom',     label: 'Personnalisé' },
];

const getPeriodRange = (period) => {
  const now = new Date();
  const y   = now.getFullYear();
  const m   = now.getMonth();

  if (period === 'month') {
    return { from: `${y}-${String(m + 1).padStart(2, '0')}-01`, to: '' };
  }
  if (period === 'last_month') {
    const lm   = m === 0 ? 11 : m - 1;
    const ly   = m === 0 ? y - 1 : y;
    const last = new Date(ly, lm + 1, 0).getDate();
    const mm   = String(lm + 1).padStart(2, '0');
    return { from: `${ly}-${mm}-01`, to: `${ly}-${mm}-${String(last).padStart(2, '0')}` };
  }
  if (period === '3months') {
    const d = new Date(y, m - 2, 1);
    return { from: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`, to: '' };
  }
  if (period === 'year') {
    return { from: `${y}-01-01`, to: '' };
  }
  return { from: '', to: '' };
};

// ─── Carte statistique ────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className="bg-white border border-black/5 p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <div className={`w-9 h-9 flex items-center justify-center ${accent ? 'bg-gold/15' : 'bg-gray-100'}`}>
          <Icon size={15} className={accent ? 'text-gold' : 'text-gray-400'} />
        </div>
        <span className="text-[11px] tracking-[2px] uppercase text-gray-400 font-jost">{label}</span>
      </div>
      <div className="font-cormorant text-dark leading-none" style={{ fontSize: '30px' }}>{value}</div>
      <div className="text-[12px] text-gray-400 font-jost">{sub}</div>
    </div>
  );
}

// ─── Dashboard principal ──────────────────────────────────────────────────────
export default function AdminDashboard({ session }) {
  const [reservations, setReservations] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [filterRoom,   setFilterRoom]   = useState('');
  const [filterMode,   setFilterMode]   = useState('');
  const [sortField,    setSortField]    = useState('created_at');
  const [sortDir,      setSortDir]      = useState('desc');
  const [period,       setPeriod]       = useState('month');
  const [dateFrom,     setDateFrom]     = useState('');
  const [dateTo,       setDateTo]       = useState('');

  // ── Chargement ──────────────────────────────────────────────────────────
  const fetchReservations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order(sortField, { ascending: sortDir === 'asc' });
    if (!error) setReservations(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchReservations(); }, [sortField, sortDir]);

  // ── Temps réel ──────────────────────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel('reservations_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reservations' }, () => {
        fetchReservations();
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  // ── Filtres ──────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q     = search.toLowerCase().trim();
    const range = (period !== 'all' && period !== 'custom') ? getPeriodRange(period) : null;

    return reservations.filter(r => {
      const rDate = r.created_at?.slice(0, 10) || '';

      if (range) {
        if (range.from && rDate < range.from) return false;
        if (range.to   && rDate > range.to)   return false;
      }
      if (period === 'custom') {
        if (dateFrom && rDate < dateFrom) return false;
        if (dateTo   && rDate > dateTo)   return false;
      }
      if (q) {
        const hit =
          r.name?.toLowerCase().includes(q)  ||
          r.phone?.includes(q)               ||
          r.email?.toLowerCase().includes(q);
        if (!hit) return false;
      }
      if (filterRoom && r.room_label   !== filterRoom) return false;
      if (filterMode && r.payment_mode !== filterMode) return false;
      return true;
    });
  }, [reservations, search, filterRoom, filterMode, period, dateFrom, dateTo]);

  // ── Stats (sur les données filtrées) ────────────────────────────────────
  const today = todayStr();
  const stats = useMemo(() => {
    const prod    = filtered.filter(r => r.payment_mode !== 'sandbox');
    const revenue = prod.reduce((s, r) => s + (r.total_price || 0), 0);
    const coming  = filtered.filter(r => r.checkin >= today).length;
    const sandbox = filtered.filter(r => r.payment_mode === 'sandbox').length;
    return { total: filtered.length, revenue, coming, sandbox };
  }, [filtered, today]);

  const roomTypes = useMemo(
    () => [...new Set(reservations.map(r => r.room_label).filter(Boolean))],
    [reservations]
  );

  // ── Tri ──────────────────────────────────────────────────────────────────
  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };
  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />;
  };

  // ── Reset filtres ────────────────────────────────────────────────────────
  const hasFilters = search || filterRoom || filterMode || period !== 'all' || dateFrom || dateTo;
  const resetFilters = () => {
    setSearch('');
    setFilterRoom('');
    setFilterMode('');
    setPeriod('all');
    setDateFrom('');
    setDateTo('');
  };

  // ── Export CSV ───────────────────────────────────────────────────────────
  const exportCSV = () => {
    const headers = [
      'Date réservation', 'Client', 'Email', 'Téléphone', 'Chambre',
      'Arrivée', 'Départ', 'Nuits', 'Personnes', 'Montant FCFA', 'Mode',
    ];
    const rows = filtered.map(r => [
      new Date(r.created_at).toLocaleDateString('fr-FR'),
      r.name, r.email || '', r.phone || '',
      r.room_label, r.checkin, r.checkout,
      r.nights, r.persons, r.total_price, r.payment_mode,
    ]);
    const csv = [headers, ...rows]
      .map(row => row.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `reservations-royal-hotel-${todayStr()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const periodLabel = PERIODS.find(p => p.key === period)?.label || '';
  const logout      = () => supabase.auth.signOut();

  // ────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f4f3f1] font-jost">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="bg-dark text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-5">
          <div>
            <span className="text-gold text-[10px] tracking-[5px] uppercase block">Royal Hotel</span>
            <h1 className="font-cormorant text-[22px] font-light leading-tight">Tableau de bord</h1>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-white/30 tracking-[1px] uppercase">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Temps réel
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/35 text-[12px] hidden md:block">{session.user.email}</span>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-white/40 hover:text-white
                       text-[11px] tracking-[2px] uppercase transition-colors duration-200"
          >
            <LogOut size={14} />
            <span className="hidden sm:block">Déconnexion</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Stats ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={Bed}
            label="Réservations"
            value={stats.total}
            sub={period === 'all' ? 'Toutes périodes' : periodLabel}
            accent
          />
          <StatCard
            icon={TrendingUp}
            label="Revenus (prod.)"
            value={`${fmt(stats.revenue)} FCFA`}
            sub="Hors sandbox"
            accent
          />
          <StatCard
            icon={Calendar}
            label="Check-ins à venir"
            value={stats.coming}
            sub="Date d'arrivée future"
          />
          <StatCard
            icon={Users}
            label="Tests sandbox"
            value={stats.sandbox}
            sub="Réservations de test"
          />
        </div>

        {/* ── Bloc filtres ──────────────────────────────────────────────── */}
        <div className="bg-white border border-black/5 mb-0.5">

          {/* Onglets période */}
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {PERIODS.map(p => (
              <button
                key={p.key}
                onClick={() => {
                  setPeriod(p.key);
                  if (p.key !== 'custom') { setDateFrom(''); setDateTo(''); }
                }}
                className={`flex-shrink-0 px-5 py-3.5 text-[11px] tracking-[1.5px] uppercase font-jost
                           transition-all duration-200 border-b-2 whitespace-nowrap ${
                  period === p.key
                    ? 'border-gold text-gold bg-gold/5'
                    : 'border-transparent text-gray-400 hover:text-dark hover:bg-gray-50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Sélecteur de dates personnalisées */}
          {period === 'custom' && (
            <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-gold/3 border-b border-gold/15">
              <div className="flex items-center gap-2">
                <span className="text-[11px] tracking-[1px] uppercase text-gray-400 font-jost">Du</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)}
                  className="text-[13px] border border-gray-200 px-3 py-2 outline-none
                             focus:border-gold/50 bg-white transition-colors"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] tracking-[1px] uppercase text-gray-400 font-jost">au</span>
                <input
                  type="date"
                  value={dateTo}
                  min={dateFrom}
                  onChange={e => setDateTo(e.target.value)}
                  className="text-[13px] border border-gray-200 px-3 py-2 outline-none
                             focus:border-gold/50 bg-white transition-colors"
                />
              </div>
              {(dateFrom || dateTo) && (
                <button
                  onClick={() => { setDateFrom(''); setDateTo(''); }}
                  className="text-[11px] text-gray-400 hover:text-dark flex items-center gap-1 transition-colors"
                >
                  <X size={12} /> Effacer les dates
                </button>
              )}
            </div>
          )}

          {/* Recherche + filtres secondaires */}
          <div className="flex flex-wrap gap-3 items-center p-4">

            {/* Recherche */}
            <div className="relative flex-1 min-w-[200px]">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: '#aaa' }} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Nom, téléphone, email…"
                className="w-full pl-9 pr-4 py-2.5 text-[13px] border border-gray-200 outline-none
                           focus:border-gold/50 transition-colors duration-200"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Filtre chambre */}
            <select
              value={filterRoom}
              onChange={e => setFilterRoom(e.target.value)}
              className="px-3 py-2.5 text-[13px] border border-gray-200 bg-white outline-none
                         focus:border-gold/50 transition-colors duration-200"
            >
              <option value="">Toutes les chambres</option>
              {roomTypes.map(r => <option key={r} value={r}>{r}</option>)}
            </select>

            {/* Filtre mode paiement */}
            <select
              value={filterMode}
              onChange={e => setFilterMode(e.target.value)}
              className="px-3 py-2.5 text-[13px] border border-gray-200 bg-white outline-none
                         focus:border-gold/50 transition-colors duration-200"
            >
              <option value="">Tous les modes</option>
              <option value="production">✓ Production</option>
              <option value="sandbox">🧪 Sandbox</option>
            </select>

            {/* Rafraîchir */}
            <button
              onClick={fetchReservations}
              title="Rafraîchir"
              className="p-2.5 text-gray-400 hover:text-dark border border-gray-200
                         hover:border-gray-300 transition-colors duration-200"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>

            {/* Export CSV */}
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 bg-dark text-white px-4 py-2.5
                         text-[11px] tracking-[2px] uppercase hover:bg-dark/80 transition-colors"
            >
              <Download size={13} />
              Exporter CSV
            </button>
          </div>
        </div>

        {/* Résumé + reset */}
        <div className="flex items-center gap-3 text-[12px] text-gray-400 tracking-[0.5px] px-1 py-2 mb-1">
          <span>
            {filtered.length} réservation{filtered.length > 1 ? 's' : ''}
            {period !== 'all' && <span className="ml-1 text-gray-300">· {periodLabel}</span>}
          </span>
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="text-gold hover:text-gold/70 transition-colors flex items-center gap-1 ml-2"
            >
              <X size={12} /> Réinitialiser tout
            </button>
          )}
        </div>

        {/* ── Tableau ──────────────────────────────────────────────────── */}
        <div className="bg-white border border-black/5 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-7 h-7 border-2 border-gold/25 border-t-gold rounded-full animate-spin" />
              <p className="text-gray-400 text-[13px] tracking-[1px]">Chargement des réservations…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center flex flex-col items-center gap-3">
              <span className="text-5xl opacity-20">📋</span>
              <p className="text-gray-400 text-[14px]">Aucune réservation pour cette période</p>
              {hasFilters && (
                <button onClick={resetFilters} className="text-gold text-[13px] hover:underline mt-1">
                  Effacer les filtres
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="bg-dark text-white/50">
                    {[
                      { key: 'created_at',    label: 'Date' },
                      { key: 'name',          label: 'Client' },
                      { key: 'room_label',    label: 'Chambre' },
                      { key: 'checkin',       label: 'Séjour' },
                      { key: 'nights',        label: 'Nuits' },
                      { key: 'persons',       label: 'Pers.' },
                      { key: 'total_price',   label: 'Montant' },
                      { key: 'payment_mode',  label: 'Mode' },
                    ].map(({ key, label }) => (
                      <th
                        key={key}
                        onClick={() => toggleSort(key)}
                        className="text-left px-4 py-4 text-[10px] tracking-[2px] uppercase font-normal
                                   whitespace-nowrap cursor-pointer hover:text-white/80 transition-colors select-none"
                      >
                        <span className="flex items-center gap-1">
                          {label}
                          <SortIcon field={key} />
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr
                      key={r.id}
                      className={`border-b border-gray-50 hover:bg-gold/5 transition-colors duration-100
                                  ${i % 2 === 1 ? 'bg-gray-50/60' : ''}`}
                    >
                      {/* Date */}
                      <td className="px-4 py-4 text-gray-400 whitespace-nowrap">
                        <div>{fmtShort(r.created_at?.slice(0, 10))}</div>
                        <div className="text-[11px] text-gray-300 mt-0.5">
                          {new Date(r.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Client */}
                      <td className="px-4 py-4">
                        <div className="font-medium text-dark">{r.name}</div>
                        <div className="text-gray-400 text-[12px] mt-0.5">{r.phone}</div>
                        {r.email && <div className="text-gray-300 text-[11px]">{r.email}</div>}
                      </td>

                      {/* Chambre */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`text-[11px] px-2.5 py-1 tracking-[1px] ${
                          r.room_label === 'Chambre Test'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-gold/10 text-gold'
                        }`}>
                          {r.room_label}
                        </span>
                      </td>

                      {/* Séjour */}
                      <td className="px-4 py-4 whitespace-nowrap text-gray-600">
                        <div>{fmtDate(r.checkin)}</div>
                        <div className="text-gray-400 text-[12px] mt-0.5">→ {fmtDate(r.checkout)}</div>
                      </td>

                      {/* Nuits */}
                      <td className="px-4 py-4 text-center font-medium text-dark">{r.nights}</td>

                      {/* Personnes */}
                      <td className="px-4 py-4 text-center text-gray-500">{r.persons}</td>

                      {/* Montant */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="font-cormorant text-gold" style={{ fontSize: '20px' }}>
                          {fmt(r.total_price)}
                        </span>
                        <span className="text-gray-400 text-[10px] ml-1">FCFA</span>
                      </td>

                      {/* Mode */}
                      <td className="px-4 py-4">
                        <span className={`text-[10px] tracking-[1px] uppercase px-2.5 py-1 ${
                          r.payment_mode === 'sandbox'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-green-50 text-green-700'
                        }`}>
                          {r.payment_mode === 'sandbox' ? '🧪 Test' : '✓ Prod'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pied de page */}
        <div className="text-center mt-8">
          <p className="text-gray-300 text-[11px] tracking-[1px]">
            Royal Hotel · Données sécurisées par Supabase
          </p>
        </div>
      </div>
    </div>
  );
}

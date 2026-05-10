// sections/Gallery.jsx — Galerie avec pagination dynamique + lightbox bandeau miniatures
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, Camera } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { PaginationPageDefault } from '../ui/Pagination';
import { IMAGES } from '../../data/constants';

const IMAGES_PER_PAGE = 12; // 3 col × 4 lignes (desktop)

// Répartit N images dans K colonnes — jamais de trous, hauteurs naturelles
function buildColumns(images, colCount) {
  const cols = Array.from({ length: colCount }, () => []);
  images.forEach((src, i) => cols[i % colCount].push({ src, idx: i }));
  return cols;
}

// Nombre de colonnes selon la largeur d'écran
function useColumnCount() {
  const [cols, setCols] = useState(3);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setCols(w < 640 ? 2 : w < 1024 ? 3 : 4);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return cols;
}

export default function Gallery() {
  const allImages  = IMAGES.gallery;
  const totalPages = Math.ceil(allImages.length / IMAGES_PER_PAGE);

  const [currentPage, setCurrentPage] = useState(1);
  const [direction,   setDirection]   = useState(1);   // 1 = avant, -1 = arrière
  const [lightbox,    setLightbox]    = useState(null); // index global de l'image
  const [lbDir,       setLbDir]       = useState(1);

  const colCount  = useColumnCount();
  const sectionRef = useRef(null);
  const thumbsRef  = useRef(null);
  const touchX     = useRef(null);

  // Images de la page courante
  const pageImages = useMemo(() => {
    const start = (currentPage - 1) * IMAGES_PER_PAGE;
    return allImages.slice(start, start + IMAGES_PER_PAGE);
  }, [allImages, currentPage]);

  // Colonnes de la page courante (index globaux préservés)
  const columns = useMemo(() => {
    const startIdx = (currentPage - 1) * IMAGES_PER_PAGE;
    const cols = Array.from({ length: colCount }, () => []);
    pageImages.forEach((src, localI) => {
      cols[localI % colCount].push({ src, idx: startIdx + localI });
    });
    return cols;
  }, [pageImages, colCount, currentPage]);

  // ── Changement de page ────────────────────────────────────────────────────
  const goToPage = useCallback((page) => {
    const clamped = Math.max(1, Math.min(totalPages, page));
    setDirection(clamped >= currentPage ? 1 : -1);
    setCurrentPage(clamped);
    // Scroll doux jusqu'au début de la galerie
    setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }, [currentPage, totalPages]);

  // ── Lightbox ──────────────────────────────────────────────────────────────
  const openLightbox = useCallback((globalIdx) => {
    setLbDir(1);
    setLightbox(globalIdx);
  }, []);

  const navigateLightbox = useCallback((dir) => {
    setLbDir(dir);
    setLightbox(i => {
      const next = (i + dir + allImages.length) % allImages.length;
      // Auto-scroll bandeau de miniatures
      setTimeout(() => {
        thumbsRef.current
          ?.querySelector(`[data-idx="${next}"]`)
          ?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }, 50);
      return next;
    });
  }, [allImages.length]);

  // Clavier
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape')     setLightbox(null);
      if (e.key === 'ArrowRight') navigateLightbox(1);
      if (e.key === 'ArrowLeft')  navigateLightbox(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, navigateLightbox]);

  // Centrer bandeau quand lightbox ouvre
  useEffect(() => {
    if (lightbox === null) return;
    setTimeout(() => {
      thumbsRef.current
        ?.querySelector(`[data-idx="${lightbox}"]`)
        ?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }, 120);
  }, [lightbox]);

  // Swipe mobile (lightbox)
  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchX.current === null) return;
    const diff = touchX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 45) navigateLightbox(diff > 0 ? 1 : -1);
    touchX.current = null;
  };

  // ── Animations ────────────────────────────────────────────────────────────
  const pageVariants = {
    enter:  (d) => ({ opacity: 0, x: d > 0 ? 30 : -30 }),
    center: { opacity: 1, x: 0,
              transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
    exit:   (d) => ({ opacity: 0, x: d > 0 ? -30 : 30,
                      transition: { duration: 0.25 } }),
  };

  const imgLightboxVariants = {
    enter:  (d) => ({ opacity: 0, x: d > 0 ? 60 : -60, scale: 0.97 }),
    center: { opacity: 1, x: 0, scale: 1,
              transition: { duration: 0.28, ease: [0.25, 0.1, 0.25, 1] } },
    exit:   (d) => ({ opacity: 0, x: d > 0 ? -60 : 60, scale: 0.97,
                      transition: { duration: 0.2 } }),
  };

  return (
    <section id="galerie" ref={sectionRef} className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

        <SectionHeader label="Nos espaces" title="Galerie Photos" />

        {/* Info bar */}
        <div className="flex items-center justify-center gap-3 mb-10 -mt-4">
          <Camera size={13} className="text-gold" />
          <span className="text-muted text-[11px] font-jost tracking-[3px] uppercase">
            {allImages.length} photos · page {currentPage}/{totalPages} · cliquez pour agrandir
          </span>
        </div>

        {/* ── Grille animée par page ── */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentPage}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex gap-2 sm:gap-3 items-start"
            >
              {columns.map((col, ci) => (
                <div key={ci} className="flex-1 flex flex-col gap-2 sm:gap-3">
                  {col.map(({ src, idx }, itemIdx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.45,
                        delay: Math.min(itemIdx * 0.06, 0.3),
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                      onClick={() => openLightbox(idx)}
                      className="relative overflow-hidden cursor-pointer group rounded-sm"
                    >
                      <img
                        src={src}
                        alt={`Photo hôtel ${idx + 1}`}
                        loading="lazy"
                        className="w-full block transition-transform duration-700
                                   group-hover:scale-110"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60
                                      via-black/10 to-transparent opacity-0
                                      group-hover:opacity-100 transition-all duration-400" />

                      {/* Icône zoom */}
                      <div className="absolute inset-0 flex items-center justify-center
                                      opacity-0 group-hover:opacity-100 transition-all duration-400">
                        <div className="w-11 h-11 rounded-full border border-white/70
                                        bg-black/25 backdrop-blur-sm flex items-center justify-center
                                        scale-75 group-hover:scale-100 transition-transform duration-300">
                          <ZoomIn size={16} className="text-white" />
                        </div>
                      </div>

                      {/* Numéro */}
                      <span className="absolute bottom-2 right-2.5 opacity-0
                                       group-hover:opacity-100 transition-opacity duration-300
                                       text-white/70 text-[9px] font-jost tracking-[1px]">
                        {idx + 1}/{allImages.length}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Pagination dynamique ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 flex flex-col items-center gap-4"
        >
          <PaginationPageDefault
            page={currentPage}
            onPageChange={goToPage}
            totalPages={totalPages}
          />

          <p className="text-muted/50 text-[10px] font-jost tracking-[2px] uppercase">
            {(currentPage - 1) * IMAGES_PER_PAGE + 1}–
            {Math.min(currentPage * IMAGES_PER_PAGE, allImages.length)}{' '}
            sur {allImages.length} photos
          </p>
        </motion.div>

      </div>

      {/* ════════════════════════════════════════════════
          LIGHTBOX FULLSCREEN
      ════════════════════════════════════════════════ */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9000] flex flex-col bg-black/97"
            style={{ backdropFilter: 'blur(6px)' }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* ── Barre supérieure ── */}
            <div className="flex items-center justify-between px-5 py-3.5 shrink-0
                            border-b border-white/8 bg-black/40">
              <div className="flex items-center gap-3">
                <span className="font-cormorant text-gold text-lg tracking-[4px] uppercase">
                  Royal Hotel
                </span>
                <span className="hidden sm:inline text-white/20 text-[10px] font-jost tracking-[2px]">
                  · Galerie Photos
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-white/35 text-sm font-jost tracking-widest">
                  {lightbox + 1} / {allImages.length}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setLightbox(null)}
                  className="w-9 h-9 rounded-full bg-white/8 hover:bg-white/20
                             border border-white/15 flex items-center justify-center
                             text-white transition-all duration-200 cursor-pointer"
                  aria-label="Fermer"
                >
                  <X size={17} />
                </motion.button>
              </div>
            </div>

            {/* ── Image principale ── */}
            <div className="flex-1 flex items-center justify-center relative
                            overflow-hidden min-h-0 px-14 sm:px-20 py-4">
              <AnimatePresence mode="wait" custom={lbDir}>
                <motion.div
                  key={lightbox}
                  custom={lbDir}
                  variants={imgLightboxVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="flex items-center justify-center w-full h-full"
                >
                  <img
                    src={allImages[lightbox]}
                    alt={`Photo ${lightbox + 1}`}
                    className="max-w-full max-h-full object-contain rounded-sm shadow-2xl"
                    style={{ maxHeight: 'calc(100vh - 200px)' }}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Flèche gauche */}
              <motion.button
                whileHover={{ scale: 1.1, x: -3 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigateLightbox(-1)}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2
                           w-11 h-11 rounded-full bg-white/8 hover:bg-white/20
                           border border-white/15 flex items-center justify-center
                           text-white transition-all duration-200 z-10 cursor-pointer"
                aria-label="Image précédente"
              >
                <ChevronLeft size={22} />
              </motion.button>

              {/* Flèche droite */}
              <motion.button
                whileHover={{ scale: 1.1, x: 3 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigateLightbox(1)}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2
                           w-11 h-11 rounded-full bg-white/8 hover:bg-white/20
                           border border-white/15 flex items-center justify-center
                           text-white transition-all duration-200 z-10 cursor-pointer"
                aria-label="Image suivante"
              >
                <ChevronRight size={22} />
              </motion.button>
            </div>

            {/* ── Bandeau miniatures + pagination lightbox ── */}
            <div className="shrink-0 border-t border-white/8 bg-black/50 py-3">

              {/* Barre de progression */}
              <div className="mx-auto w-40 h-0.5 bg-white/10 rounded-full overflow-hidden mb-3">
                <motion.div
                  className="h-full bg-gold rounded-full"
                  animate={{ width: `${((lightbox + 1) / allImages.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Miniatures scrollables */}
              <div
                ref={thumbsRef}
                className="flex gap-1.5 overflow-x-auto px-4 pb-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {allImages.map((src, i) => (
                  <motion.button
                    key={i}
                    data-idx={i}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => {
                      setLbDir(i > lightbox ? 1 : -1);
                      setLightbox(i);
                    }}
                    className={`
                      shrink-0 rounded-sm overflow-hidden border-2 cursor-pointer
                      transition-all duration-200 focus:outline-none
                      ${i === lightbox
                        ? 'border-gold opacity-100 shadow-lg shadow-gold/30'
                        : 'border-transparent opacity-35 hover:opacity-70'}
                    `}
                    style={{ width: 48, height: 36 }}
                    aria-label={`Photo ${i + 1}`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </motion.button>
                ))}
              </div>

              {/* Infos bas */}
              <div className="flex items-center justify-between px-4 mt-2.5">
                <span className="text-white/20 text-[9px] font-jost tracking-[2px] uppercase hidden sm:block">
                  ← → clavier · glissez sur mobile · Échap pour fermer
                </span>
                <span className="text-white/20 text-[9px] font-jost tracking-[2px] uppercase sm:hidden">
                  Glissez ou utilisez les flèches
                </span>
                {/* Mini-pagination dans le lightbox */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => navigateLightbox(-1)}
                    className="text-white/30 hover:text-gold text-xs font-jost
                               bg-transparent border-none cursor-pointer transition-colors"
                  >
                    Précédente
                  </button>
                  <span className="text-white/15 text-xs">·</span>
                  <button
                    onClick={() => navigateLightbox(1)}
                    className="text-white/30 hover:text-gold text-xs font-jost
                               bg-transparent border-none cursor-pointer transition-colors"
                  >
                    Suivante
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

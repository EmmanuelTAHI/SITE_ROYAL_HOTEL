// sections/Gallery.jsx — Galerie 8 images/page, pagination fluide sans scroll-to-top
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { IMAGES } from '../../data/constants';

const IMAGES_PER_PAGE = 8;

export default function Gallery() {
  const [lightbox, setLightbox]     = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection]   = useState(1); // 1=forward, -1=backward
  const gridRef                     = useRef(null);

  const images      = IMAGES.gallery;
  const totalPages  = Math.ceil(images.length / IMAGES_PER_PAGE);
  const startIdx    = currentPage * IMAGES_PER_PAGE;
  const visibleImages = images.slice(startIdx, startIdx + IMAGES_PER_PAGE);

  const goToPage = useCallback((p) => {
    const next = ((p % totalPages) + totalPages) % totalPages;
    setDirection(next > currentPage ? 1 : -1);
    setCurrentPage(next);
  }, [currentPage, totalPages]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape')     setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox(i => (i + 1) % images.length);
      if (e.key === 'ArrowLeft')  setLightbox(i => (i - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, images.length]);

  const prev = useCallback(() => setLightbox(i => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setLightbox(i => (i + 1) % images.length), [images.length]);

  // Slide variants for page transition (stays in place, no scroll)
  const slideVariants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? 40 : -40 }),
    center: {
      opacity: 1, x: 0,
      transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
    },
    exit: (d) => ({
      opacity: 0, x: d > 0 ? -40 : 40,
      transition: { duration: 0.3 },
    }),
  };

  return (
    <section id="galerie" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <SectionHeader label="Nos espaces" title="Galerie Photos" />

        {/* ── Grille animée (AnimatePresence pour le slide) ─────────── */}
        <div className="relative overflow-hidden" ref={gridRef}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentPage}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[220px] sm:auto-rows-[260px]"
            >
              {visibleImages.map((src, i) => {
                const globalIdx = startIdx + i;
                // Large spanning cells for visual interest
                const isWide = i === 0 || i === 5;
                return (
                  <div
                    key={`${currentPage}-${i}`}
                    onClick={() => setLightbox(globalIdx)}
                    className={`relative overflow-hidden cursor-pointer group rounded-lg
                      ${isWide ? 'col-span-2' : 'col-span-1'}`}
                  >
                    <img
                      src={src}
                      alt={`Photo de l'hôtel ${globalIdx + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover block transition-transform duration-700
                                 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent
                                    opacity-0 group-hover:opacity-100 transition-all duration-400" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ZoomIn
                        size={30}
                        className="text-white opacity-0 group-hover:opacity-100 scale-75
                                   group-hover:scale-100 transition-all duration-400"
                      />
                    </div>
                    {/* Numéro de la photo */}
                    <span className="absolute bottom-3 right-3 text-white/50 text-[9px]
                                     tracking-[2px] font-jost opacity-0 group-hover:opacity-100
                                     transition-opacity duration-300">
                      {globalIdx + 1} / {images.length}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Pagination ──────────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-6 mt-10">
          <p className="text-center text-[11px] tracking-[3px] uppercase text-muted font-jost font-light">
            Cliquez sur une image pour l'agrandir
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-5">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => goToPage(currentPage - 1)}
                className="w-10 h-10 flex items-center justify-center border border-gold/30 text-gold
                           hover:bg-gold hover:text-white transition-all duration-300"
                aria-label="Page précédente"
              >
                <ChevronLeft size={18} />
              </motion.button>

              <div className="flex gap-2 items-center">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => goToPage(i)}
                    className={`transition-all duration-300 flex items-center justify-center font-jost text-xs
                      ${i === currentPage
                        ? 'w-9 h-9 bg-gold text-white shadow-lg shadow-gold/20'
                        : 'w-8 h-8 border border-gold/30 text-gold hover:bg-gold/10'}`}
                    aria-label={`Page ${i + 1}`}
                  >
                    {i + 1}
                  </motion.button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => goToPage(currentPage + 1)}
                className="w-10 h-10 flex items-center justify-center border border-gold/30 text-gold
                           hover:bg-gold hover:text-white transition-all duration-300"
                aria-label="Page suivante"
              >
                <ChevronRight size={18} />
              </motion.button>
            </div>
          )}

          {/* Indicateur de page */}
          <p className="text-[10px] tracking-[3px] uppercase text-muted/60 font-jost">
            Page {currentPage + 1} sur {totalPages} · {images.length} photos
          </p>
        </div>
      </div>

      {/* ── Lightbox ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 bg-black/92 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center"
            >
              <img
                src={images[lightbox]}
                alt={`Photo ${lightbox + 1}`}
                className="w-full h-full object-contain rounded-lg"
              />

              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 bg-white/15 hover:bg-white/30 p-2.5 rounded-full
                           transition-colors duration-300 text-white z-10 border border-white/20"
                aria-label="Fermer"
              >
                <X size={24} />
              </button>

              {images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30
                               p-3 rounded-full transition-colors duration-300 text-white z-10
                               border border-white/20"
                    aria-label="Image précédente"
                  >
                    <ChevronLeft size={26} />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30
                               p-3 rounded-full transition-colors duration-300 text-white z-10
                               border border-white/20"
                    aria-label="Image suivante"
                  >
                    <ChevronRight size={26} />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/15
                              border border-white/20 px-5 py-2 rounded-full
                              text-white text-sm font-jost z-10 tracking-widest">
                {lightbox + 1} / {images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

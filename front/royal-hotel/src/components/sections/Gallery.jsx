// sections/Gallery.jsx
// Galerie masonry avec pagination - 6 images par page
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { staggerContainerVariants, cardVariants } from '../../hooks/useScrollAnimation';
import { IMAGES } from '../../data/constants';

const IMAGES_PER_PAGE = 6;

export default function Gallery() {
  const [lightbox, setLightbox]           = useState(null);
  const [imageDimensions, setImageDimensions] = useState({});
  const [currentPage, setCurrentPage]     = useState(0);

  const images     = IMAGES.gallery;
  const totalPages = Math.ceil(images.length / IMAGES_PER_PAGE);
  const startIdx   = currentPage * IMAGES_PER_PAGE;
  const visibleImages = images.slice(startIdx, startIdx + IMAGES_PER_PAGE);

  // Recharger les dimensions à chaque changement de page
  useEffect(() => {
    setImageDimensions({});          // ← reset impératif avant de charger la nouvelle page
    let cancelled = false;
    const dims = {};
    let count = 0;

    const pageImages = images.slice(currentPage * IMAGES_PER_PAGE, (currentPage + 1) * IMAGES_PER_PAGE);

    pageImages.forEach((src, idx) => {
      const img = new Image();
      img.onload = () => {
        if (cancelled) return;
        dims[idx] = {
          width:      img.naturalWidth,
          height:     img.naturalHeight,
          isPortrait: img.naturalHeight > img.naturalWidth,
        };
        count++;
        if (count === pageImages.length) {
          setImageDimensions({ ...dims });
        }
      };
      img.onerror = () => {
        if (cancelled) return;
        count++;
        if (count === pageImages.length) setImageDimensions({ ...dims });
      };
      img.src = src;
    });

    return () => { cancelled = true; };
  }, [currentPage, images]);

  const getImageClass = useCallback((idx) => {
    const d = imageDimensions[idx];
    if (!d) return 'col-span-1';
    return d.isPortrait || idx % 3 !== 0 ? 'col-span-1' : 'lg:col-span-2';
  }, [imageDimensions]);

  // Navigation lightbox au clavier
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape')      setLightbox(null);
      if (e.key === 'ArrowRight')  setLightbox(i => (i + 1) % images.length);
      if (e.key === 'ArrowLeft')   setLightbox(i => (i - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, images.length]);

  const prev = useCallback(() => setLightbox(i => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setLightbox(i => (i + 1) % images.length), [images.length]);

  const goToPage = (p) => {
    setCurrentPage(p);
    // Remonter au début de la section pour que whileInView se redéclenche
    document.getElementById('galerie')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="galerie" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <SectionHeader label="Nos espaces" title="Galerie Photos" />

        {/* ── Grille masonry ──────────────────────────────────────────────
            key={currentPage} force le remontage complet à chaque changement
            de page → whileInView se redéclenche et les images animent bien.
        */}
        <motion.div
          key={currentPage}
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[280px] sm:auto-rows-[320px]"
        >
          {visibleImages.map((src, i) => {
            const globalIdx = startIdx + i;
            return (
              <motion.div
                key={`${currentPage}-${i}`}
                variants={cardVariants}
                onClick={() => setLightbox(globalIdx)}
                className={`relative overflow-hidden cursor-pointer group rounded-lg
                  col-span-1 ${getImageClass(i)}`}
              >
                <img
                  src={src}
                  alt={`Photo de l'hôtel ${globalIdx + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover block transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent
                                group-hover:from-black/80 transition-all duration-400" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ZoomIn
                    size={32}
                    className="text-white opacity-0 group-hover:opacity-100 scale-75
                               group-hover:scale-100 transition-all duration-400"
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Pagination ─────────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-6 mt-12">
          <p className="text-center text-[11px] tracking-[3px] uppercase text-muted font-jost font-light">
            Cliquez sur une image pour l'agrandir
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-6">
              <button
                onClick={() => goToPage((currentPage - 1 + totalPages) % totalPages)}
                className="w-10 h-10 flex items-center justify-center border border-gold/30 text-gold
                           hover:bg-gold hover:text-white transition-all duration-300"
                aria-label="Page précédente"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(i)}
                    className={`w-8 h-8 flex items-center justify-center text-xs font-jost tracking-wide
                                transition-all duration-300 ${
                      i === currentPage
                        ? 'bg-gold text-white'
                        : 'border border-gold/30 text-gold hover:bg-gold/10'
                    }`}
                    aria-label={`Page ${i + 1}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => goToPage((currentPage + 1) % totalPages)}
                className="w-10 h-10 flex items-center justify-center border border-gold/30 text-gold
                           hover:bg-gold hover:text-white transition-all duration-300"
                aria-label="Page suivante"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
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
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full h-full max-w-4xl max-h-[90vh] flex items-center justify-center"
            >
              <img
                src={images[lightbox]}
                alt={`Photo ${lightbox + 1}`}
                className="w-full h-full object-contain rounded-lg"
              />

              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 p-2 rounded-full
                           transition-colors duration-300 text-white z-10"
                aria-label="Fermer"
              >
                <X size={28} />
              </button>

              {images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40
                               p-3 rounded-full transition-colors duration-300 text-white z-10"
                    aria-label="Image précédente"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40
                               p-3 rounded-full transition-colors duration-300 text-white z-10"
                    aria-label="Image suivante"
                  >
                    <ChevronRight size={28} />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 px-4 py-2 rounded-full
                              text-white text-sm font-jost z-10">
                {lightbox + 1} / {images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// sections/Gallery.jsx
// Galerie masonry avec pagination - 6 images par page
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { staggerContainerVariants, cardVariants } from '../../hooks/useScrollAnimation';
import { IMAGES } from '../../data/constants';

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const images = IMAGES.gallery;
  
  // Pagination
  const imagesPerPage = 6;
  const totalPages = Math.ceil(images.length / imagesPerPage);
  const startIdx = currentPage * imagesPerPage;
  const visibleImages = images.slice(startIdx, startIdx + imagesPerPage);

  // Charger les dimensions des images
  useEffect(() => {
    const loadedDimensions = {};
    let loadedCount = 0;

    visibleImages.forEach((src, idx) => {
      const img = new Image();
      img.onload = () => {
        loadedDimensions[idx] = {
          width: img.naturalWidth,
          height: img.naturalHeight,
          isPortrait: img.naturalHeight > img.naturalWidth,
        };
        loadedCount++;
        if (loadedCount === visibleImages.length) {
          setImageDimensions(loadedDimensions);
        }
      };
      img.src = src;
    });
  }, [visibleImages]);

  // Determiner les classes de colonne based on orientation
  const getImageClass = useCallback((idx) => {
    const dims = imageDimensions[idx];
    if (!dims) return 'col-span-1';
    
    if (dims.isPortrait) {
      return 'col-span-1';
    } else {
      return idx % 3 === 0 ? 'col-span-2' : 'col-span-1';
    }
  }, [imageDimensions]);

  // Fermer lightbox avec Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox(i => i === null ? null : (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setLightbox(i => i === null ? null : (i - 1 + images.length) % images.length);
    };
    if (lightbox !== null) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, images.length]);

  const prev = useCallback(() => setLightbox(i => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setLightbox(i => (i + 1) % images.length), [images.length]);
  
  // Pagination
  const handlePrevPage = () => {
    setCurrentPage((p) => (p - 1 + totalPages) % totalPages);
  };
  const handleNextPage = () => {
    setCurrentPage((p) => (p + 1) % totalPages);
  };

  return (
    <section id="galerie" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <SectionHeader label="Nos espaces" title="Galerie Photos" />

        {/* -- Masonry Grid -- */}
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[280px] sm:auto-rows-[320px]"
        >
          {visibleImages.map((src, i) => {
            const globalIdx = startIdx + i;
            return (
              <motion.div
                key={globalIdx}
                variants={cardVariants}
                onClick={() => setLightbox(globalIdx)}
                className={`relative overflow-hidden cursor-pointer group rounded-lg
                  ${getImageClass(i)} ${imageDimensions[i]?.isPortrait ? 'sm:col-span-1' : 'sm:col-span-1 lg:col-span-2'}`}
              >
                <img
                  src={src}
                  alt={`Photo de l'hotel ${globalIdx + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover block transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent
                                group-hover:from-black/80 transition-all duration-400" />
                
                {/* Zoom icon */}
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

        {/* -- Pagination Controls -- */}
        <div className="flex flex-col items-center gap-6 mt-12">
          <p className="text-center text-[11px] tracking-[3px] uppercase text-muted font-jost font-light">
            Cliquez sur une image pour l'agrandir
          </p>
          
          {totalPages > 1 && (
            <div className="flex items-center gap-6">
              <button
                onClick={handlePrevPage}
                className="w-10 h-10 flex items-center justify-center border border-gold/30 text-gold
                           hover:bg-gold hover:text-white transition-all duration-300"
                aria-label="Page precedente"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-8 h-8 flex items-center justify-center text-xs font-jost tracking-wide transition-all duration-300
                      ${i === currentPage
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
                onClick={handleNextPage}
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

      {/* -- Lightbox Modal -- */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          >
            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full h-full max-w-4xl max-h-[90vh] flex items-center justify-center"
            >
              <img
                src={images[lightbox]}
                alt={`Photo ${lightbox + 1}`}
                className="w-full h-full object-contain rounded-lg"
              />

              {/* Close Button */}
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 p-2 rounded-full
                           transition-colors duration-300 text-white z-10"
                aria-label="Fermer"
              >
                <X size={28} />
              </button>

              {/* Navigation Buttons */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 
                               p-3 rounded-full transition-colors duration-300 text-white z-10"
                    aria-label="Image precedente"
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

              {/* Counter */}
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

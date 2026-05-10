// ui/Pagination.jsx — Composant de pagination réutilisable (API compatible Origin UI)
// Usage: <PaginationPageDefault page={currentPage} onPageChange={setPage} totalPages={n} />
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

// ─── Calcul des pages à afficher (avec ellipsis) ─────────────────────────────
function getPageRange(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, '…', total];
  }

  if (current >= total - 3) {
    return [1, '…', total - 4, total - 3, total - 2, total - 1, total];
  }

  return [1, '…', current - 1, current, current + 1, '…', total];
}

// ─── Bouton page ──────────────────────────────────────────────────────────────
function PageButton({ page, isActive, onClick, disabled = false }) {
  if (page === '…') {
    return (
      <span
        className="w-10 h-10 flex items-center justify-center
                   text-muted text-sm font-jost select-none"
      >
        <MoreHorizontal size={16} />
      </span>
    );
  }

  return (
    <motion.button
      whileHover={!isActive && !disabled ? { scale: 1.08, y: -1 } : {}}
      whileTap={!disabled ? { scale: 0.94 } : {}}
      onClick={() => !disabled && !isActive && onClick(page)}
      disabled={disabled || isActive}
      aria-label={`Page ${page}`}
      aria-current={isActive ? 'page' : undefined}
      className={`
        relative w-10 h-10 flex items-center justify-center
        text-sm font-jost transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50
        ${isActive
          ? 'bg-gold text-dark font-medium shadow-gold/30 shadow-md cursor-default'
          : disabled
            ? 'text-muted/40 cursor-not-allowed'
            : 'text-muted hover:text-dark hover:bg-gold/10 border border-transparent hover:border-gold/25 cursor-pointer'
        }
      `}
    >
      {isActive && (
        <motion.span
          layoutId="pagination-active"
          className="absolute inset-0 bg-gold"
          style={{ borderRadius: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
      <span className="relative z-10">{page}</span>
    </motion.button>
  );
}

// ─── Bouton navigation (prev / next) ─────────────────────────────────────────
function NavButton({ direction, onClick, disabled }) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.08, x: direction === 'prev' ? -2 : 2 } : {}}
      whileTap={!disabled ? { scale: 0.94 } : {}}
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Page précédente' : 'Page suivante'}
      className={`
        w-10 h-10 flex items-center justify-center
        border transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50
        ${disabled
          ? 'border-gold/10 text-muted/30 cursor-not-allowed'
          : 'border-gold/25 text-muted hover:border-gold hover:text-gold hover:bg-gold/5 cursor-pointer'
        }
      `}
    >
      <Icon size={16} />
    </motion.button>
  );
}

// ─── Composant principal (API Origin UI) ──────────────────────────────────────
export function PaginationPageDefault({ page, onPageChange, totalPages = 1 }) {
  if (totalPages <= 1) return null;

  const pages = getPageRange(page, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1 select-none"
    >
      {/* Précédent */}
      <NavButton
        direction="prev"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      />

      {/* Pages */}
      <div className="flex items-center gap-1 mx-1">
        {pages.map((p, i) => (
          <PageButton
            key={`${p}-${i}`}
            page={p}
            isActive={p === page}
            onClick={onPageChange}
          />
        ))}
      </div>

      {/* Suivant */}
      <NavButton
        direction="next"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      />
    </nav>
  );
}

// Export par défaut + named (compatibilité)
export default { PaginationPageDefault };

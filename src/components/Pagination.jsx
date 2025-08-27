import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // Si il n'y a qu'une page (ou moins), on n'affiche rien
  if (totalPages <= 1) {
    return null;
  }

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Générer les numéros de page
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between mt-4 px-2 py-1 border-t border-slate-200">
      <div className="text-sm text-slate-600">
        Page <span className="font-medium">{currentPage}</span> sur{" "}
        <span className="font-medium">{totalPages}</span>
      </div>
      <nav className="flex items-center gap-2">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-3 py-1 flex items-center gap-1 rounded-lg border bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
          Précédent
        </button>

        {/* Optionnel : Afficher les numéros de page */}
        <div className="hidden md:flex items-center gap-1">
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => onPageChange(number)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                currentPage === number
                  ? "bg-indigo-600 text-white"
                  : "bg-white hover:bg-slate-100"
              }`}
            >
              {number}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-3 py-1 flex items-center gap-1 rounded-lg border bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Suivant
          <ChevronRight size={16} />
        </button>
      </nav>
    </div>
  );
}

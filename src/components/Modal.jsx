import React from "react";

export default function Modal({
  open,
  onClose,
  children,
  title = "",
  sizeClass = "w-[720px] max-w-[95vw] p-6",
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={`bg-white rounded-2xl shadow-xl ${sizeClass} z-10`}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold">{title}</div>
          <button className="text-slate-500" onClick={onClose}>
            Fermer
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

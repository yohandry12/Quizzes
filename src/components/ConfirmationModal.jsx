import React from "react";
import Modal from "./Modal";
import { AlertTriangle, Trash2 } from "lucide-react";

export default function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  title,
  children,
}) {
  return (
    <Modal open={open} onClose={onClose} sizeClass="w-[440px]" showHeader={false} showClose={false}>
      <div className="p-4 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        <div className="mt-3">
          <h3 className="text-lg font-semibold leading-6 text-slate-900">
            {title || "Confirmer la suppression"}
          </h3>
          <div className="mt-2">
            <p className="text-sm text-slate-500">{children}</p>
          </div>
        </div>
        <div className="mt-5 sm:mt-6 flex justify-center gap-3">
          <button
            type="button"
            className="px-4 py-2 rounded-lg border bg-white hover:bg-slate-50 text-slate-700 font-medium"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium"
            onClick={onConfirm}
          >
            <Trash2 size={16} />
            Confirmer
          </button>
        </div>
      </div>
    </Modal>
  );
}

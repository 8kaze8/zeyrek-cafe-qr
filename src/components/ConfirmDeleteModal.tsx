import React from "react";

interface ConfirmDeleteModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  open,
  onConfirm,
  onCancel,
  title = "Silme Onayı",
  description = "Bu işlemi yapmak istediğinize emin misiniz? Bu işlem geri alınamaz.",
}) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-2"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl bg-gray-900 shadow-2xl p-0 overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
          <p className="text-gray-300 mb-6">{description}</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors"
            >
              Vazgeç
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Evet, Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

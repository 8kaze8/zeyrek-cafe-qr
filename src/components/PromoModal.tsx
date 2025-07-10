import React from "react";

interface PromoModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  imageUrl?: string;
  variants?: Array<{ name: string; description?: string; imageUrl?: string }>;
  actionLabel?: string;
  onAction?: () => void;
}

export const PromoModal: React.FC<PromoModalProps> = ({
  open,
  onClose,
  title,
  description,
  imageUrl,
  variants,
  actionLabel,
  onAction,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      {/* Modal Container */}
      <div
        className="relative w-full max-w-lg max-h-[90vh] transform transition-all duration-300 ease-out scale-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-50 w-8 h-8 bg-gray-900/90 hover:bg-gray-800 text-white/80 hover:text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/10"
          aria-label="Kapat"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 4L12 12M12 4L4 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
        {/* Modal Content */}
        <div className="relative bg-gray-900/95 rounded-2xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-sm flex flex-col max-h-[90vh]">
          {/* Image */}
          {imageUrl && (
            <div className="relative aspect-[4/3] overflow-hidden bg-black/20 flex-shrink-0 rounded-t-2xl">
              {/* Koyu overlay */}
              <div className="absolute inset-0 bg-black/40" />
              {/* Alt kenara yumuşak gradient */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover rounded-t-2xl"
                draggable={false}
              />
            </div>
          )}
          {/* Content */}
          <div className="relative px-4 py-8 sm:px-8 sm:py-10 flex flex-col items-center overflow-y-auto flex-1">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 mt-2 text-center leading-tight">
              {title}
            </h3>
            <p className="text-gray-200 text-base sm:text-lg leading-relaxed text-center mb-6 max-w-xl">
              {description}
            </p>
            {variants && variants.length > 0 && (
              <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-stretch mb-8">
                {variants.map((variant, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-white/5 rounded-xl p-4 flex flex-col items-center border border-white/5 min-w-[120px] max-w-[220px] mx-auto"
                  >
                    {variant.imageUrl && (
                      <img
                        src={variant.imageUrl}
                        alt={variant.name}
                        className="w-20 h-20 object-cover rounded-full mb-2"
                      />
                    )}
                    <span className="text-lg font-semibold text-white mb-1 text-center">
                      {variant.name}
                    </span>
                    {variant.description && (
                      <span className="text-gray-300 text-sm text-center block">
                        {variant.description}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            {actionLabel && onAction && (
              <div className="mt-2 sm:mt-4 flex justify-center w-full">
                <button
                  onClick={onAction}
                  className="px-6 py-3 rounded-xl bg-[#4fa3e3] hover:bg-[#357ab8] text-white font-semibold text-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4fa3e3]/30 w-full max-w-xs"
                >
                  {actionLabel}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

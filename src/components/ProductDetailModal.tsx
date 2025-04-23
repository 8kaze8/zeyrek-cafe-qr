import React, { useEffect } from "react";
import type { Product, Language } from "../types/menu";
import translations from "../../translations.json";
import clsx from "clsx";

interface ProductDetailModalProps {
  product: Product;
  selectedLanguage: Language;
  onClose: () => void;
}

const formatPrice = (price: number, language: Language): string => {
  const formattedPrice = Math.round(price).toString();
  if (language === "ar") {
    const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return formattedPrice
      .split("")
      .map((digit) => arabicNumbers[parseInt(digit)] || digit)
      .join("");
  }
  return formattedPrice;
};

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  selectedLanguage,
  onClose,
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const isRTL = selectedLanguage === "ar";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-lg transform transition-all duration-300 ease-out scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={clsx(
            "absolute -top-2 z-50 w-8 h-8 bg-gray-900/90 hover:bg-gray-800 text-white/80 hover:text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/10",
            isRTL ? "-left-2" : "-right-2"
          )}
          aria-label={translations.close_button[selectedLanguage]}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="pointer-events-none"
          >
            <path
              d="M4 4L12 12M12 4L4 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Modal Content */}
        <div className="relative bg-gray-900/95 rounded-2xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-sm">
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden bg-black/20">
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/40" />
            <img
              src={
                product.image_url ||
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
              }
              alt={product[`name_${selectedLanguage}`] || ""}
              className="w-full h-full object-contain transform transition-transform duration-700 hover:scale-110"
            />
          </div>

          {/* Content */}
          <div className="relative p-6">
            {/* Price Tag */}
            <div
              className={clsx("absolute -top-12", isRTL ? "right-6" : "left-6")}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-md opacity-20" />
                <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 px-6 py-2 rounded-xl shadow-lg">
                  <span
                    className={clsx(
                      "text-white text-xl font-bold tracking-wider block w-full",
                      isRTL && "text-right"
                    )}
                  >
                    {isRTL
                      ? `${formatPrice(product.price, selectedLanguage)}₺`
                      : `₺${formatPrice(product.price, selectedLanguage)}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Title */}
            <h3
              className={clsx(
                "text-2xl sm:text-3xl font-bold text-white mb-4 mt-2",
                isRTL && "text-right"
              )}
            >
              {product[`name_${selectedLanguage}`]}
            </h3>

            {/* Description */}
            {product[`description_${selectedLanguage}`] && (
              <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/5">
                <p
                  className={clsx(
                    "text-gray-200 text-base sm:text-lg leading-relaxed",
                    isRTL && "text-right"
                  )}
                >
                  {product[`description_${selectedLanguage}`]}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { Product } from "../types/menu";
import type { Language } from "../types/menu";
import { ProductForm } from "./ProductForm";
import { Category } from "../types/menu";
import translations from "../../translations.json";
import { ProductDetailModal } from "./ProductDetailModal";
import clsx from "clsx";

// Arapça rakam dönüşümü için yardımcı fonksiyon
const convertToArabicNumerals = (num: number): string => {
  const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return num
    .toString()
    .split("")
    .map((digit) => {
      if (digit === ".") return "٫"; // Arapça ondalık ayracı
      return arabicNumbers[parseInt(digit)] || digit;
    })
    .join("");
};

// Fiyat formatlama fonksiyonu
const formatPrice = (price: number, language: Language): string => {
  const formattedPrice = price.toFixed(2);
  if (language === "ar") {
    return convertToArabicNumerals(parseFloat(formattedPrice));
  }
  return formattedPrice;
};

interface ProductListProps {
  products: Product[];
  selectedLanguage: Language;
  categories?: Category[];
  onProductEditSuccess?: () => void;
  mode?: "admin" | "user";
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  selectedLanguage,
  categories = [],
  onProductEditSuccess,
  mode = "user",
}) => {
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(
    null
  );
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [detailModalOpen, setDetailModalOpen] = React.useState(false);

  const isRTL = selectedLanguage === "ar";

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    if (mode === "admin") {
      setEditModalOpen(true);
    } else {
      setDetailModalOpen(true);
    }
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedProduct(null);
    if (onProductEditSuccess) onProductEditSuccess();
  };

  const handleDetailModalClose = () => {
    setDetailModalOpen(false);
    setSelectedProduct(null);
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-[#2a4c7d]/15 backdrop-blur-sm rounded-2xl p-8 border border-[#4fa3e3]/30">
          <p className="text-lg text-[#4fa3e3]">
            {translations.empty_state[selectedLanguage]}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => handleProductClick(product)}
            className={clsx(
              "relative bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer",
              mode === "admin" &&
                !(product.is_active ?? true) &&
                "opacity-50 border border-gray-600"
            )}
          >
            {mode === "admin" && !(product.is_active ?? true) && (
              <div className="absolute top-2 right-2 bg-gray-900 text-gray-400 px-2 py-1 rounded text-xs">
                {translations.inactive_label[selectedLanguage]}
              </div>
            )}
            <div className="aspect-[4/3] relative">
              <img
                src={
                  product.image_url ||
                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
                }
                alt={product[`name_${selectedLanguage}`] || ""}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a4c7d] via-[#2a4c7d]/70 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h3
                className={clsx(
                  "text-xl font-semibold text-white mb-2",
                  isRTL && "text-right"
                )}
              >
                {product[`name_${selectedLanguage}`]}
              </h3>
              {product[`description_${selectedLanguage}`] && (
                <p
                  className={clsx(
                    "text-[#4fa3e3] text-sm mb-3 line-clamp-2",
                    isRTL && "text-right"
                  )}
                >
                  {product[`description_${selectedLanguage}`]}
                </p>
              )}
              <div className="flex">
                <span
                  className={clsx(
                    "text-2xl font-bold text-white",
                    isRTL ? "ml-auto" : ""
                  )}
                >
                  {isRTL
                    ? `${formatPrice(product.price, selectedLanguage)}₺`
                    : `₺${formatPrice(product.price, selectedLanguage)}`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Admin Edit Modal */}
      {mode === "admin" && editModalOpen && selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-2"
          onClick={handleEditModalClose}
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-gray-900 shadow-2xl p-0 overflow-hidden animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleEditModalClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors rounded-full w-9 h-9 flex items-center justify-center z-10"
              aria-label={translations.close_button[selectedLanguage]}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 6L16 16M16 6L6 16"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <ProductForm
              categories={categories}
              onSuccess={handleEditModalClose}
              editMode={true}
              initialData={selectedProduct}
              productId={selectedProduct.id}
            />
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {mode === "user" && detailModalOpen && selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          selectedLanguage={selectedLanguage}
          onClose={handleDetailModalClose}
        />
      )}
    </>
  );
};

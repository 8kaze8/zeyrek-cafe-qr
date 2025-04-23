import React from "react";
import { Product } from "../types/menu";
import type { Language } from "../types/menu";
import { ProductForm } from "./ProductForm";
import { Category } from "../types/menu";
import translations from "../../translations.json";

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

interface ProductModalProps {
  product: Product;
  selectedLanguage: Language;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  selectedLanguage,
  onClose,
}) => {
  // ESC tuşu için event listener
  React.useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Overflow ve event listener'ı ekle
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscKey);

    // Cleanup
    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  // Modal dışına tıklama
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6"
      onClick={handleBackdropClick}
    >
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#23283b] to-[#1a1f2e] shadow-2xl overflow-hidden animate-fadeIn border border-white/10"
        onClick={e => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 transition-colors rounded-full w-10 h-10 flex items-center justify-center shadow-lg z-10 backdrop-blur-sm cursor-pointer"
          aria-label={translations.close_button[selectedLanguage]}
        >
          <div className="pointer-events-none">
            <svg
              width="20"
              height="20"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="scale-90"
            >
              <path
                d="M6 6L16 16M16 6L6 16"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </button>

        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
          <img
            src={
              product.image_url ||
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
            }
            alt={product[`name_${selectedLanguage}`] || ""}
            className="w-full h-full object-contain relative z-10"
          />
        </div>
        <div className="relative px-6 pb-6 pt-4">
          <div className="absolute -top-12 right-6 z-10">
            <div className="bg-[#4fa3e3] text-white px-6 py-2 rounded-2xl shadow-lg text-xl font-bold">
              ₺{formatPrice(product.price, selectedLanguage)}
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 mt-2">
            {product[`name_${selectedLanguage}`]}
          </h3>
          {product[`description_${selectedLanguage}`] && (
            <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-[#f7e7d3] text-base sm:text-lg leading-relaxed whitespace-pre-line">
                {product[`description_${selectedLanguage}`]}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => handleProductClick(product)}
            className={`relative bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer ${
              mode === "admin" && !(product.is_active ?? true)
                ? "opacity-50 border border-gray-600"
                : ""
            }`}
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
              <h3 className="text-xl font-semibold text-white mb-2">
                {product[`name_${selectedLanguage}`]}
              </h3>
              {product[`description_${selectedLanguage}`] && (
                <p className="text-[#4fa3e3] text-sm mb-3 line-clamp-2">
                  {product[`description_${selectedLanguage}`]}
                </p>
              )}
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-white">
                  ₺{formatPrice(product.price, selectedLanguage)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
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
      {mode === "user" && detailModalOpen && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          selectedLanguage={selectedLanguage}
          onClose={handleDetailModalClose}
        />
      )}
    </>
  );
};

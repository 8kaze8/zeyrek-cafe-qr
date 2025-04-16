import React from "react";
import { Product } from "../types/menu";
import type { Language } from "../types/menu";

interface ProductListProps {
  products: Product[];
  selectedLanguage: Language;
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
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-[#2a4c7d]/60 backdrop-blur-sm px-2"
    onClick={onClose}
  >
    <div
      className="relative w-full max-w-md rounded-3xl bg-[#23283b] shadow-2xl p-0 overflow-hidden animate-fadeIn border-2 border-[#4fa3e3]/40"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-[#4fa3e3] bg-white/80 hover:bg-[#4fa3e3] hover:text-white transition-colors rounded-full w-9 h-9 flex items-center justify-center shadow-md z-10"
        aria-label="Kapat"
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
      <img
        src={
          product.image_url ||
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
        }
        alt={product[`name_${selectedLanguage}`]}
        className="w-full h-48 object-cover sm:h-56 md:h-64 bg-[#2a4c7d]"
      />
      <div className="p-5 sm:p-7">
        <h3 className="text-2xl font-bold text-[#4fa3e3] mb-2 text-center drop-shadow-sm">
          {product[`name_${selectedLanguage}`]}
        </h3>
        {product[`description_${selectedLanguage}`] && (
          <p className="text-[#f7e7d3] text-base mb-5 whitespace-pre-line text-center">
            {product[`description_${selectedLanguage}`]}
          </p>
        )}
        <div className="flex justify-center">
          <span className="inline-block text-2xl font-bold text-[#23283b] bg-[#4fa3e3] px-6 py-2 rounded-2xl shadow-md">
            ₺{product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  </div>
);

export const ProductList: React.FC<ProductListProps> = ({
  products,
  selectedLanguage,
}) => {
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(
    null
  );

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-[#2a4c7d]/15 backdrop-blur-sm rounded-2xl p-8 border border-[#4fa3e3]/30">
          <p className="text-lg text-[#4fa3e3]">
            Bu kategoride henüz ürün bulunmamaktadır
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
            className="group relative bg-[#2a4c7d]/15 rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-500 backdrop-blur-sm border border-[#4fa3e3]/30 cursor-pointer"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="aspect-[4/3] relative">
              <img
                src={
                  product.image_url ||
                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
                }
                alt={product[`name_${selectedLanguage}`]}
                className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a4c7d] via-[#2a4c7d]/70 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h3 className="text-xl font-semibold text-white mb-2">
                {product[`name_${selectedLanguage}`]}
              </h3>
              {product[`description_${selectedLanguage}`] && (
                <p className="text-[#4fa3e3] text-sm mb-3 line-clamp-2 group-hover:text-white/90 transition-colors duration-300">
                  {product[`description_${selectedLanguage}`]}
                </p>
              )}
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-white">
                  ₺{product.price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          selectedLanguage={selectedLanguage}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
};

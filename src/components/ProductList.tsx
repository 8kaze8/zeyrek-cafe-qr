import React from 'react';
import { Product } from '../types/menu';
import type { Language } from '../types/menu';

interface ProductListProps {
  products: Product[];
  selectedLanguage: Language;
}

export const ProductList: React.FC<ProductListProps> = ({ products, selectedLanguage }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-[#2a304d]/20 backdrop-blur-sm rounded-2xl p-8 border border-[#2a304d]/50">
          <p className="text-lg text-[#8892b0]">Bu kategoride henüz ürün bulunmamaktadır</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <div
          key={product.id}
          className="group relative bg-[#2a304d]/20 rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-500 backdrop-blur-sm border border-[#2a304d]/50"
        >
          <div className="aspect-[4/3] relative">
            <img
              src={product.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
              alt={product[`name_${selectedLanguage}`]}
              className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f35] via-[#1a1f35]/70 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-6">
            <h3 className="text-xl font-semibold text-white mb-2">
              {product[`name_${selectedLanguage}`]}
            </h3>
            {product[`description_${selectedLanguage}`] && (
              <p className="text-[#8892b0] text-sm mb-3 line-clamp-2 group-hover:text-white/90 transition-colors duration-300">
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
  );
}
import React from "react";
import { Category } from "../types/menu";
import clsx from "clsx";
import type { Language } from "../types/menu";

interface CategoryListProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
  selectedLanguage: Language;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedLanguage,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={clsx(
            "group flex items-center gap-4 p-4 rounded-2xl bg-[#23283b] border border-[#2a4c7d]/30 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer relative overflow-hidden",
            selectedCategory === category.id && "ring-2 ring-[#4fa3e3]"
          )}
        >
          {category.image_url ? (
            <img
              src={category.image_url}
              alt={category[`name_${selectedLanguage}`]}
              className="w-16 h-16 object-cover rounded-xl border border-[#2a4c7d]/40 bg-[#2a4c7d]/10"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-[#2a4c7d]/10 flex items-center justify-center text-[#4fa3e3] text-2xl font-bold border border-[#2a4c7d]/20">
              {category[`name_${selectedLanguage}`]?.[0] || "?"}
            </div>
          )}
          <div className="flex-1 text-left">
            <div className="text-lg font-semibold text-white mb-1 group-hover:text-[#4fa3e3] transition-colors">
              {category[`name_${selectedLanguage}`]}
            </div>
            <div className="text-sm text-[#4fa3e3] opacity-80">
              Sıra: {category.order}
            </div>
          </div>
          <span className="ml-2 text-xs text-[#4fa3e3] bg-[#2a4c7d]/20 px-2 py-1 rounded-lg">
            Düzenle
          </span>
        </button>
      ))}
    </div>
  );
};

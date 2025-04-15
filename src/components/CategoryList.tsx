import React from 'react';
import { Category } from '../types/menu';
import clsx from 'clsx';
import type { Language } from '../types/menu';

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
    <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={clsx(
            'px-6 py-2.5 rounded-xl whitespace-nowrap transition-all duration-300',
            'backdrop-blur-sm font-medium',
            selectedCategory === category.id
              ? 'bg-[#2a304d] text-white shadow-lg'
              : 'bg-[#2a304d]/30 text-[#8892b0] hover:bg-[#2a304d]/50 hover:text-white'
          )}
        >
          {category[`name_${selectedLanguage}`]}
        </button>
      ))}
    </div>
  );
}
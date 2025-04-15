import { useState, useEffect } from 'react';
import { CategoryList } from '../components/CategoryList';
import { ProductList } from '../components/ProductList';
import { LanguageSelector } from '../components/LanguageSelector';
import { fetchCategories, fetchProducts } from '../lib/firebase-admin';
import type { Category, Product, Language } from '../types/menu';
import toast from 'react-hot-toast';
import { Utensils } from 'lucide-react';

export function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('tr');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedCategories, fetchedProducts] = await Promise.all([
          fetchCategories(),
          fetchProducts()
        ]);
        setCategories(fetchedCategories);
        setProducts(fetchedProducts);
        
        if (fetchedCategories.length > 0) {
          setSelectedCategory(fetchedCategories[0].id);
        }
      } catch (error) {
        toast.error('Menü yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter(product => product.category_id === selectedCategory)
    : products;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a2339] to-[#451a2b] p-6 space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#2a304d]/50 rounded w-32"></div>
          <div className="h-12 bg-[#2a304d]/50 rounded-full"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-[#2a304d]/50 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a2339] to-[#451a2b]">
      {/* Hero Section with smoother transition */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-5"
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1f35]/80 via-[#2a2339]/90 to-[#451a2b]/80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 [text-shadow:_0_4px_12px_rgb(0_0_0_/_50%)]">
              Zeyrek Cafe
            </h1>
            <p className="text-lg text-[#8892b0] max-w-2xl mx-auto font-light tracking-wide">
              Eşsiz lezzetlerin ve keyifli anların adresi
            </p>
          </div>
        </div>
      </div>

      {/* Menu Content with consistent styling */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-16 relative z-10">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#2a304d]/50 rounded-xl backdrop-blur-sm">
              <Utensils className="w-5 h-5 text-[#8892b0]" />
            </div>
            <h2 className="text-2xl font-semibold text-white">
              Menümüz
            </h2>
          </div>
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
        </div>

        <div className="space-y-12">
          <div className="bg-[#2a304d]/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#2a304d]/50">
            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedLanguage={selectedLanguage}
            />
          </div>

          <ProductList
            products={filteredProducts}
            selectedLanguage={selectedLanguage}
          />
        </div>
      </div>
    </div>
  );
}
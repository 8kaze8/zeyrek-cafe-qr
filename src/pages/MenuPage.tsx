import { useState, useEffect } from "react";
import { CategoryList } from "../components/CategoryList";
import { ProductList } from "../components/ProductList";
import { LanguageSelector } from "../components/LanguageSelector";
import { fetchCategories, fetchProducts } from "../lib/firebase-admin";
import type { Category, Product, Language } from "../types/menu";
import toast from "react-hot-toast";
import { Utensils } from "lucide-react";
import logo from "../assets/logo/zeyrek-cafe-logo.svg";

export function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("tr");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedCategories, fetchedProducts] = await Promise.all([
          fetchCategories(),
          fetchProducts(),
        ]);
        setCategories(fetchedCategories);
        setProducts(fetchedProducts);

        if (fetchedCategories.length > 0) {
          setSelectedCategory(fetchedCategories[0].id);
        }
      } catch (error) {
        toast.error("Menü yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category_id === selectedCategory)
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
    <div className="min-h-screen flex flex-col items-center bg-[#6d2323] bg-gradient-to-b from-[#6d2323] to-[#3a1010] px-2">
      <div className="w-full flex flex-col items-center pt-8 pb-4">
        <img
          src={logo}
          alt="Zeyrek Cafe Logo"
          className="w-32 h-32 sm:w-44 sm:h-44 object-contain mb-2 drop-shadow-xl"
          style={{ maxWidth: 200 }}
        />
        <p className="text-base sm:text-lg font-medium text-[#f7e7d3] mb-2 text-center px-2 mt-2">
          Eşsiz lezzetlerin ve keyifli anların adresi
        </p>
      </div>

      <div className="w-full max-w-2xl mx-auto px-0 sm:px-4 -mt-2 pb-10 relative z-10">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-3 mb-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 bg-[#2a4c7d]/60 rounded-xl backdrop-blur-sm">
              <Utensils className="w-5 h-5 text-[#4fa3e3]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#4fa3e3] whitespace-nowrap">
              Menümüz
            </h2>
          </div>
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
        </div>

        <div className="space-y-8">
          <div className="bg-[#2a4c7d]/15 backdrop-blur-sm rounded-2xl p-3 sm:p-6 shadow-lg border border-[#4fa3e3]/30">
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

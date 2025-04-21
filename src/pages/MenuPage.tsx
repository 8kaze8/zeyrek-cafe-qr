import { useState, useEffect } from "react";
import { CategoryList } from "../components/CategoryList";
import { ProductList } from "../components/ProductList";
import { LanguageSelector } from "../components/LanguageSelector";
import { fetchCategories, fetchProducts } from "../lib/firebase-admin";
import type { Category, Product, Language } from "../types/menu";
import toast from "react-hot-toast";
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
    ? products.filter(
        (product) =>
          product.category_id === selectedCategory &&
          (product.is_active ?? true)
      )
    : products.filter((product) => product.is_active ?? true);

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
    <div className="min-h-screen flex flex-col items-center bg-[#6d2323] relative overflow-hidden">
      {/* Modern Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6d2323] via-[#541b1b] to-[#3a1010]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(43,16,16,0.4),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_-20%,rgba(255,255,255,0.1),transparent_25%)]" />
      </div>

      {/* Subtle Light Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-[#8b2929]/20 to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-[500px] bg-gradient-to-tl from-[#2a4c7d]/10 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative w-full min-h-screen flex flex-col items-center">
        {/* Header Section */}
        <div className="relative w-full flex flex-col items-center pt-8 pb-4 px-2">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-br from-[#f7e7d3]/10 to-[#4fa3e3]/5 rounded-full blur-xl" />
            <img
              src={logo}
              alt="Zeyrek Cafe Logo"
              className="w-32 h-32 sm:w-44 sm:h-44 object-contain drop-shadow-2xl relative"
              style={{ maxWidth: 200 }}
            />
          </div>
          <p className="text-base sm:text-lg font-medium text-[#f7e7d3] mb-2 text-center px-2 mt-6 max-w-md mx-auto leading-relaxed tracking-wide">
            Eşsiz lezzetlerin ve keyifli anların adresi
          </p>
        </div>

        {/* Menu Section */}
        <div className="relative w-full max-w-2xl mx-auto px-4 sm:px-6 pb-12 z-10">
          {/* Menu Header */}
          <div className="flex flex-col sm:flex-row items-center sm:justify-end gap-4 mb-8">
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          </div>

          {/* Categories and Products */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-[#2a4c7d]/30 to-[#2a4c7d]/20 backdrop-blur-sm rounded-2xl p-1.5 shadow-lg border border-white/10 overflow-hidden">
              <CategoryList
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                selectedLanguage={selectedLanguage}
                variant="horizontal"
                showEditLabel={false}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#6d2323]/30 to-[#6d2323] pointer-events-none" />
              <ProductList
                products={filteredProducts}
                selectedLanguage={selectedLanguage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

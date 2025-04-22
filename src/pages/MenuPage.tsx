import { useState, useEffect } from "react";
import { CategoryList } from "../components/CategoryList";
import { ProductList } from "../components/ProductList";
import { LanguageSelector } from "../components/LanguageSelector";
import { fetchCategories, fetchProducts } from "../lib/firebase-admin";
import type { Category, Product, Language } from "../types/menu";
import toast from "react-hot-toast";
import logo from "../assets/logo/zeyrek-cafe-logo.svg";
import backgroundImage from "../assets/background/arkaplan.png";

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
    <div className="min-h-screen flex flex-col items-center relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 min-h-full w-full bg-repeat-y bg-[length:100%_auto] sm:bg-cover bg-top"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          minHeight: "100%",
          height: "auto",
        }}
      >
        <div className="absolute inset-0 min-h-full bg-black/10 h-full" />
      </div>

      {/* Content Container */}
      <div className="relative w-full min-h-screen flex flex-col items-center z-10 px-2 sm:px-4">
        {/* Header Section */}
        <div className="relative w-full flex flex-col items-center pt-4 sm:pt-8 pb-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-br from-[#f7e7d3]/5 to-[#4fa3e3]/5 rounded-full blur-xl" />
            <img
              src={logo}
              alt="Zeyrek Cafe Logo"
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 object-contain drop-shadow-2xl relative"
              style={{ maxWidth: "100%" }}
            />
          </div>
          <p className="text-sm sm:text-base md:text-lg font-medium text-[#f7e7d3] mb-2 text-center mt-4 sm:mt-6 max-w-md mx-auto leading-relaxed tracking-wide drop-shadow-lg">
            Eşsiz lezzetlerin ve keyifli anların adresi
          </p>
        </div>

        {/* Menu Section */}
        <div className="relative w-full max-w-2xl mx-auto px-0 sm:px-4 pb-8 sm:pb-12">
          {/* Menu Header */}
          <div className="flex flex-col sm:flex-row items-center sm:justify-end gap-2 sm:gap-4 mb-4 sm:mb-8">
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          </div>

          {/* Categories and Products */}
          <div className="space-y-4 sm:space-y-8">
            <div className="bg-gradient-to-br from-[#2a4c7d]/20 to-[#2a4c7d]/10 backdrop-blur-[2px] rounded-xl sm:rounded-2xl p-1 sm:p-1.5 shadow-lg border border-white/10 overflow-hidden mx-1 sm:mx-0">
              <CategoryList
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                selectedLanguage={selectedLanguage}
                variant="horizontal"
                showEditLabel={false}
              />
            </div>

            <div className="relative px-1 sm:px-0">
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

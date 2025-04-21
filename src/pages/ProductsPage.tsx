import { useState, useEffect } from "react";
import { ProductList } from "../components/ProductList";
import { ProductForm } from "../components/ProductForm";
import { Layout } from "../components/Layout";
import {
  fetchProducts,
  fetchCategories,
  updateAllProductsToActive,
} from "../lib/firebase-admin";
import type { Product, Category, Language } from "../types/menu";
import toast from "react-hot-toast";
import { CategoryList } from "../components/CategoryList";

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage] = useState<Language>("tr");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [addModalOpen, setAddModalOpen] = useState(false);

  const loadData = async () => {
    try {
      const [fetchedProducts, fetchedCategories] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ]);
      setProducts(fetchedProducts);
      setCategories(fetchedCategories);
      if (!selectedCategory && fetchedCategories.length > 0) {
        setSelectedCategory(fetchedCategories[0]);
      }
    } catch (error) {
      toast.error("Veriler yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await updateAllProductsToActive();
      await fetchProducts(); // Refresh the products list
    };
    init();
  }, []);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category_id === selectedCategory.id)
    : products;

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-6">Ürünler</h1>
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-64 bg-gray-700 rounded-lg"></div>
              <div className="h-64 bg-gray-700 rounded-lg"></div>
            </div>
          ) : (
            <>
              <CategoryList
                categories={categories}
                selectedCategory={selectedCategory?.id || null}
                onSelectCategory={(id) => {
                  const cat = categories.find((c) => c.id === id) || null;
                  setSelectedCategory(cat);
                }}
                selectedLanguage={selectedLanguage}
                showEditLabel={false}
                variant="vertical"
              />
              <div className="mt-8">
                <ProductList
                  products={filteredProducts}
                  selectedLanguage={selectedLanguage}
                  categories={categories}
                  onProductEditSuccess={loadData}
                  mode="admin"
                />
              </div>
            </>
          )}
        </div>
      </div>
      {/* Floating Action Button */}
      <button
        onClick={() => setAddModalOpen(true)}
        className="fixed bottom-8 right-8 z-50 bg-[#4fa3e3] hover:bg-[#357ab8] text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl text-4xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#4fa3e3]/30"
        aria-label="Yeni Ürün Ekle"
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
      {/* Add Modal */}
      {addModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-2"
          onClick={() => setAddModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-gray-900 shadow-2xl p-0 overflow-hidden animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setAddModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors rounded-full w-9 h-9 flex items-center justify-center z-10"
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
            <ProductForm
              categories={categories}
              onSuccess={() => {
                setAddModalOpen(false);
                loadData();
              }}
            />
          </div>
        </div>
      )}
    </Layout>
  );
}

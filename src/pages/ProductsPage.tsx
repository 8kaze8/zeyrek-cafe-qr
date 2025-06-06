import { useState, useEffect } from "react";
import { ProductForm } from "../components/ProductForm";
import { Layout } from "../components/Layout";
import { fetchProducts, fetchCategories } from "../lib/firebase-admin";
import type { Product, Category, Language } from "../types/menu";
import toast from "react-hot-toast";

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedLanguage] = useState<Language>("tr");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category_id === selectedCategory.id)
    : products;

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedProduct(null);
    loadData();
  };

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Sol Sidebar - Kategoriler */}
        <div className="lg:w-72 lg:min-w-72 bg-[#1a1f2e] p-4 lg:space-y-4 overflow-x-auto lg:overflow-x-hidden">
          {/* Mobile için yatay scroll */}
          <div className="flex lg:flex-col gap-3">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all shrink-0 lg:shrink 
                  ${
                    selectedCategory?.id === category.id
                      ? "bg-[#2a4c7d] text-white"
                      : "bg-[#23283b] text-gray-400 hover:bg-[#2a4c7d]/50"
                  }`}
              >
                {category.image_url && (
                  <img
                    src={category.image_url}
                    alt={category[`name_${selectedLanguage}`] ?? ""}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {category[`name_${selectedLanguage}`]}
                  </div>
                  <div className="text-sm text-[#4fa3e3] hidden lg:block">
                    Sıra: {category.order}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sağ Taraf - Ürünler */}
        <div className="flex-1 p-4 lg:p-6 bg-[#151923] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className={`relative bg-[#23283b] rounded-2xl overflow-hidden shadow-lg transition-all hover:shadow-xl cursor-pointer 
                  ${!(product.is_active ?? true) ? "opacity-50" : ""}`}
              >
                <div className="aspect-[4/3] relative">
                  <img
                    src={product.image_url || "https://via.placeholder.com/300"}
                    alt={product[`name_${selectedLanguage}`] ?? ""}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-4">
                  <h3 className="text-base lg:text-xl font-semibold text-white mb-2 line-clamp-2">
                    {product[`name_${selectedLanguage}`]}
                  </h3>
                  <p className="text-[#4fa3e3] text-base lg:text-lg font-bold">
                    ₺{product.price.toFixed(2)}
                  </p>
                  {!(product.is_active ?? true) && (
                    <div className="absolute top-3 right-3 bg-red-500/80 text-white px-2 py-1 rounded text-sm">
                      Pasif
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setAddModalOpen(true)}
        className="fixed bottom-4 lg:bottom-8 right-4 lg:right-8 z-50 bg-[#4fa3e3] hover:bg-[#357ab8] text-white rounded-full w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center shadow-2xl text-4xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#4fa3e3]/30"
        aria-label="Yeni Ürün Ekle"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lg:scale-125"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* Add Modal */}
      {addModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/40 backdrop-blur-sm p-0 lg:px-2"
          onClick={() => setAddModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-gray-900 shadow-2xl overflow-hidden animate-fadeIn rounded-t-3xl lg:rounded-3xl"
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

      {/* Edit Modal */}
      {editModalOpen && selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/40 backdrop-blur-sm p-0 lg:px-2"
          onClick={handleEditModalClose}
        >
          <div
            className="relative w-full max-w-md bg-gray-900 shadow-2xl overflow-hidden animate-fadeIn rounded-t-3xl lg:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleEditModalClose}
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
              onSuccess={handleEditModalClose}
              editMode={true}
              initialData={selectedProduct}
              productId={selectedProduct.id}
            />
          </div>
        </div>
      )}
    </Layout>
  );
}

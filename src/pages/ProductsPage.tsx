import React, { useState, useEffect } from 'react';
import { ProductList } from '../components/ProductList';
import { ProductForm } from '../components/ProductForm';
import { Layout } from '../components/Layout';
import { fetchProducts, fetchCategories } from '../lib/firebase-admin';
import type { Product, Category, Language } from '../types/menu';
import toast from 'react-hot-toast';

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage] = useState<Language>('tr');

  const loadData = async () => {
    try {
      const [fetchedProducts, fetchedCategories] = await Promise.all([
        fetchProducts(),
        fetchCategories()
      ]);
      setProducts(fetchedProducts);
      setCategories(fetchedCategories);
    } catch (error) {
      toast.error('Veriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
            <ProductList products={products} selectedLanguage={selectedLanguage} />
          )}
        </div>

        <ProductForm categories={categories} onSuccess={loadData} />
      </div>
    </Layout>
  );
}
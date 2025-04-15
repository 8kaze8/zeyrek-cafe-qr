import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { CategoryList } from '../components/CategoryList';
import { CategoryForm } from '../components/CategoryForm';
import { fetchCategories } from '../lib/firebase-admin';
import type { Language, Category } from '../types/menu';
import toast from 'react-hot-toast';

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLanguage] = useState<Language>('tr');

  const loadCategories = async () => {
    try {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      toast.error('Kategoriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-6">Kategoriler</h1>
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-gray-700 rounded-full w-1/4"></div>
              <div className="h-12 bg-gray-700 rounded-lg w-full"></div>
            </div>
          ) : (
            <CategoryList 
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedLanguage={selectedLanguage}
            />
          )}
        </div>

        <CategoryForm onSuccess={loadCategories} />
      </div>
    </Layout>
  );
}
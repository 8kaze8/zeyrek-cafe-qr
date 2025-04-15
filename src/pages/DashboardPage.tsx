import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { fetchCategories, fetchProducts } from '../lib/firebase-admin';
import toast from 'react-hot-toast';

export const DashboardPage = () => {
  const [stats, setStats] = useState({
    categories: 0,
    products: 0,
    loading: true
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [categories, products] = await Promise.all([
          fetchCategories(),
          fetchProducts()
        ]);

        setStats({
          categories: categories.length,
          products: products.length,
          loading: false
        });
      } catch (error) {
        console.error('Error loading stats:', error);
        toast.error('İstatistikler yüklenirken bir hata oluştu');
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    loadStats();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Panel</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Hızlı İstatistikler</h2>
            <div className="space-y-4">
              {stats.loading ? (
                <>
                  <div className="animate-pulse">
                    <p className="text-gray-400 text-sm">Toplam Kategori</p>
                    <div className="h-8 bg-gray-700 rounded w-20 mt-1"></div>
                  </div>
                  <div className="animate-pulse">
                    <p className="text-gray-400 text-sm">Toplam Ürün</p>
                    <div className="h-8 bg-gray-700 rounded w-20 mt-1"></div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-gray-400 text-sm">Toplam Kategori</p>
                    <p className="text-2xl font-bold text-white">{stats.categories}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Toplam Ürün</p>
                    <p className="text-2xl font-bold text-white">{stats.products}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
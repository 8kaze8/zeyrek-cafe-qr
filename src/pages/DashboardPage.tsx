import { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { fetchCategories, fetchProducts } from "../lib/firebase-admin";
import toast from "react-hot-toast";
import {
  BarChart3,
  Coffee,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";

export const DashboardPage = () => {
  const [stats, setStats] = useState({
    categories: 0,
    products: 0,
    activeProducts: 0,
    mostPopularCategory: "",
    loading: true,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [categories, products] = await Promise.all([
          fetchCategories(),
          fetchProducts(),
        ]);

        // En çok ürüne sahip kategoriyi bul
        const categoryProductCounts = products.reduce((acc, product) => {
          acc[product.category_id] = (acc[product.category_id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const mostPopularCategoryId = Object.entries(
          categoryProductCounts
        ).sort(([, a], [, b]) => b - a)[0]?.[0];

        const mostPopularCategory = categories.find(
          (cat) => cat.id === mostPopularCategoryId
        );

        setStats({
          categories: categories.length,
          products: products.length,
          activeProducts: products.filter((p) => p.is_active ?? true).length,
          mostPopularCategory: mostPopularCategory?.name_tr || "",
          loading: false,
        });
      } catch (error) {
        console.error("Error loading stats:", error);
        toast.error("İstatistikler yüklenirken bir hata oluştu");
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    loadStats();
  }, []);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
  }: {
    title: string;
    value: string | number;
    icon: typeof Coffee;
    color: string;
  }) => (
    <div className="bg-[#1a1f2e] p-6 rounded-2xl border border-[#2a4c7d]/30">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Panel</h1>
          <div className="flex items-center gap-3 text-[#4fa3e3] bg-[#1a1f2e] px-4 py-2 rounded-xl border border-[#2a4c7d]/30">
            <BarChart3 className="w-5 h-5" />
            <span className="text-sm font-medium">Günlük İstatistikler</span>
          </div>
        </div>

        {stats.loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-[#1a1f2e] p-6 rounded-2xl border border-[#2a4c7d]/30"
              >
                <div className="h-10 w-10 bg-[#2a4c7d]/50 rounded-xl mb-4"></div>
                <div className="h-4 bg-[#2a4c7d]/50 rounded w-24 mb-2"></div>
                <div className="h-8 bg-[#2a4c7d]/50 rounded w-16"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Toplam Kategori"
              value={stats.categories}
              icon={Package}
              color="bg-gradient-to-br from-purple-500 to-purple-600"
            />
            <StatCard
              title="Toplam Ürün"
              value={stats.products}
              icon={ShoppingBag}
              color="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <StatCard
              title="Aktif Ürünler"
              value={stats.activeProducts}
              icon={TrendingUp}
              color="bg-gradient-to-br from-green-500 to-green-600"
            />
            <StatCard
              title="Pasif Ürünler"
              value={stats.products - stats.activeProducts}
              icon={Coffee}
              color="bg-gradient-to-br from-red-500 to-red-600"
            />
          </div>
        )}

        {/* Ek İstatistikler */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* En Popüler Kategori */}
          <div className="bg-[#1a1f2e] p-6 rounded-2xl border border-[#2a4c7d]/30">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#4fa3e3]" />
              En Popüler Kategori
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">
                  {stats.mostPopularCategory}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  En çok ürüne sahip kategori
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-[#4fa3e3] to-[#2a4c7d] rounded-2xl flex items-center justify-center">
                <Package className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Sistem Durumu */}
          <div className="bg-[#1a1f2e] p-6 rounded-2xl border border-[#2a4c7d]/30">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#4fa3e3]" />
              Sistem Durumu
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-gray-400">Menü Sistemi</p>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                  Aktif
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-400">QR Kod Sistemi</p>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                  Aktif
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

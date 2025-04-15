import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { addCategory } from '../lib/firebase-admin';

const categorySchema = z.object({
  name_tr: z.string().min(1, 'Kategori adı zorunludur'),
  name_en: z.string().optional(),
  name_ar: z.string().optional(),
  order: z.number().min(0, 'Sıra numarası 0 veya daha büyük olmalıdır'),
  image_url: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  onSuccess: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ onSuccess }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      order: 0,
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    const loadingToast = toast.loading('Kategori ekleniyor...');
    
    try {
      await addCategory(data);
      toast.success('Kategori başarıyla eklendi', { id: loadingToast });
      reset();
      onSuccess();
    } catch (error) {
      console.error('Kategori ekleme hatası:', error);
      toast.error('Kategori eklenirken bir hata oluştu', { id: loadingToast });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-gray-800 p-6 rounded-xl border border-gray-700">
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Yeni Kategori Ekle</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="name_tr" className="block text-sm font-medium text-gray-300">
              Kategori Adı (Türkçe)
            </label>
            <input
              type="text"
              {...register('name_tr')}
              className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700/50 text-white shadow-sm focus:border-red-500 focus:ring-red-500"
              placeholder="Örn: Ana Yemekler"
              disabled={isSubmitting}
            />
            {errors.name_tr && (
              <p className="mt-1 text-sm text-red-500">{errors.name_tr.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="order" className="block text-sm font-medium text-gray-300">
              Sıra Numarası
            </label>
            <input
              type="number"
              {...register('order', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700/50 text-white shadow-sm focus:border-red-500 focus:ring-red-500"
              placeholder="0"
              disabled={isSubmitting}
            />
            <p className="mt-1 text-sm text-gray-400">
              Kategorinin menüdeki sırası (0 en üstte gösterilir)
            </p>
            {errors.order && (
              <p className="mt-1 text-sm text-red-500">{errors.order.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="image_url" className="block text-sm font-medium text-gray-300">
              Resim URL (İsteğe bağlı)
            </label>
            <input
              type="text"
              {...register('image_url')}
              className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700/50 text-white shadow-sm focus:border-red-500 focus:ring-red-500"
              placeholder="https://example.com/image.jpg"
              disabled={isSubmitting}
            />
            {errors.image_url && (
              <p className="mt-1 text-sm text-red-500">{errors.image_url.message}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Ekleniyor...' : 'Kategori Ekle'}
        </button>
      </div>
    </form>
  );
};
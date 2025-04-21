import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import {
  addProduct,
  uploadImageAndGetUrl,
  updateProduct,
  deleteProduct,
} from "../lib/firebase-admin";
import type { Category, Product } from "../types/menu";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

const productSchema = z.object({
  name_tr: z.string().min(1, "Ürün adı zorunludur"),
  name_en: z.string().nullable(),
  name_ar: z.string().nullable(),
  description_tr: z.string().nullable(),
  description_en: z.string().nullable(),
  description_ar: z.string().nullable(),
  category_id: z.string().min(1, "Kategori seçimi zorunludur"),
  price: z.number().min(0, "Fiyat 0 veya daha büyük olmalıdır"),
  order: z.number().min(0, "Sıra numarası 0 veya daha büyük olmalıdır"),
  image_url: z.string().nullable(),
  is_active: z.boolean().default(true),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  categories: Category[];
  onSuccess: () => void;
  editMode?: boolean;
  initialData?: Partial<Product>;
  productId?: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  categories,
  onSuccess,
  editMode = false,
  initialData,
  productId,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      ...initialData,
      order: initialData?.order ?? 0,
      price: initialData?.price ?? 0,
      is_active: initialData?.is_active ?? true,
      name_en: initialData?.name_en ?? null,
      name_ar: initialData?.name_ar ?? null,
      description_tr: initialData?.description_tr ?? null,
      description_en: initialData?.description_en ?? null,
      description_ar: initialData?.description_ar ?? null,
      image_url: initialData?.image_url ?? null,
    },
  });
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(
    initialData?.image_url || null
  );
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        order: initialData.order ?? 0,
        price: initialData.price ?? 0,
        is_active: initialData.is_active ?? true,
        name_en: initialData.name_en ?? null,
        name_ar: initialData.name_ar ?? null,
        description_tr: initialData.description_tr ?? null,
        description_en: initialData.description_en ?? null,
        description_ar: initialData.description_ar ?? null,
        image_url: initialData.image_url ?? null,
      });
      setPreviewUrl(initialData.image_url || null);
    }
  }, [initialData, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(initialData?.image_url || null);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    const loadingToast = toast.loading(
      editMode ? "Ürün güncelleniyor..." : "Ürün ekleniyor..."
    );
    try {
      let imageUrl = data.image_url;
      if (imageFile) {
        setUploading(true);
        imageUrl = await uploadImageAndGetUrl(imageFile, "products");
        setValue("image_url", imageUrl);
        setUploading(false);
      }
      if (editMode && productId) {
        await updateProduct(productId, {
          ...data,
          image_url: imageUrl,
          name_en: data.name_en || null,
          name_ar: data.name_ar || null,
          description_tr: data.description_tr || null,
          description_en: data.description_en || null,
          description_ar: data.description_ar || null,
          is_active: data.is_active,
        });
        toast.success("Ürün güncellendi", { id: loadingToast });
      } else {
        await addProduct({
          ...data,
          image_url: imageUrl,
          name_en: data.name_en || null,
          name_ar: data.name_ar || null,
          description_tr: data.description_tr || null,
          description_en: data.description_en || null,
          description_ar: data.description_ar || null,
          is_active: data.is_active,
        });
        toast.success("Ürün başarıyla eklendi", { id: loadingToast });
      }
      reset();
      setImageFile(null);
      setPreviewUrl(null);
      onSuccess();
    } catch (error) {
      setUploading(false);
      console.error(
        editMode ? "Ürün güncelleme hatası:" : "Ürün ekleme hatası:",
        error
      );
      toast.error(
        editMode
          ? "Ürün güncellenirken bir hata oluştu"
          : "Ürün eklenirken bir hata oluştu",
        { id: loadingToast }
      );
    }
  };

  const handleDelete = async () => {
    if (!productId) return;

    const loadingToast = toast.loading("Ürün siliniyor...");
    try {
      await deleteProduct(productId);
      toast.success("Ürün başarıyla silindi", { id: loadingToast });
      onSuccess();
    } catch (error) {
      console.error("Ürün silme hatası:", error);
      toast.error("Ürün silinirken bir hata oluştu", { id: loadingToast });
    }
    setDeleteModalOpen(false);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-gray-800 p-6 rounded-xl border border-gray-700"
      >
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            {editMode ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name_tr"
                className="block text-sm font-medium text-gray-300"
              >
                Ürün Adı (Türkçe)
              </label>
              <input
                type="text"
                {...register("name_tr")}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700/50 text-white shadow-sm focus:border-red-500 focus:ring-red-500"
                placeholder="Örn: Köfte"
                disabled={isSubmitting}
              />
              {errors.name_tr && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name_tr.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="category_id"
                className="block text-sm font-medium text-gray-300"
              >
                Kategori
              </label>
              <select
                {...register("category_id")}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700/50 text-white shadow-sm focus:border-red-500 focus:ring-red-500"
                disabled={isSubmitting}
              >
                <option value="">Kategori Seçin</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name_tr}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.category_id.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-300"
              >
                Fiyat (₺)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700/50 text-white shadow-sm focus:border-red-500 focus:ring-red-500"
                placeholder="0.00"
                disabled={isSubmitting}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="order"
                className="block text-sm font-medium text-gray-300"
              >
                Sıra Numarası
              </label>
              <input
                type="number"
                {...register("order", { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700/50 text-white shadow-sm focus:border-red-500 focus:ring-red-500"
                placeholder="0"
                disabled={isSubmitting}
              />
              {errors.order && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.order.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="description_tr"
                className="block text-sm font-medium text-gray-300"
              >
                Açıklama (Türkçe)
              </label>
              <textarea
                {...register("description_tr")}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700/50 text-white shadow-sm focus:border-red-500 focus:ring-red-500"
                placeholder="Ürün açıklaması..."
                disabled={isSubmitting}
              />
              {errors.description_tr && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description_tr.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="image_url"
                className="block text-sm font-medium text-gray-300"
              >
                Resim URL (İsteğe bağlı)
              </label>
              <input
                type="text"
                {...register("image_url")}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700/50 text-white shadow-sm focus:border-red-500 focus:ring-red-500"
                placeholder="https://example.com/image.jpg"
                disabled={isSubmitting || uploading}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2 block w-full text-sm text-gray-300 file:bg-gray-700 file:text-white file:rounded-md file:border-0 file:py-2 file:px-4 file:mr-2 file:cursor-pointer"
                disabled={isSubmitting || uploading}
              />
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Önizleme"
                  className="mt-2 w-24 h-24 object-cover rounded-md border border-gray-600"
                />
              )}
              {uploading && (
                <p className="mt-1 text-sm text-yellow-400">
                  Resim yükleniyor...
                </p>
              )}
              {errors.image_url && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.image_url.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center">
                <label className="relative inline-flex items-center">
                  <input
                    type="checkbox"
                    {...register("is_active")}
                    defaultChecked={true}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-300">
                    {watch("is_active") ? "Aktif" : "Pasif"}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? editMode
                ? "Güncelleniyor..."
                : "Ekleniyor..."
              : editMode
              ? "Kaydet"
              : "Ürün Ekle"}
          </button>
          {editMode && (
            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Sil
            </button>
          )}
        </div>
      </form>

      <ConfirmDeleteModal
        open={deleteModalOpen}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
        title="Ürünü Sil"
        description="Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
      />
    </>
  );
};

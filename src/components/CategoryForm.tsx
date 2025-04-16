import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import {
  addCategory,
  uploadImageAndGetUrl,
  updateCategory,
  deleteCategory,
} from "../lib/firebase-admin";
import type { Category } from "../types/menu";

const categorySchema = z.object({
  name_tr: z.string().min(1, "Kategori adı zorunludur"),
  name_en: z.string().optional(),
  name_ar: z.string().optional(),
  order: z.number().min(0, "Sıra numarası 0 veya daha büyük olmalıdır"),
  image_url: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  onSuccess: () => void;
  initialData?: Partial<Category>;
  editMode?: boolean;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  onSuccess,
  initialData,
  editMode,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData || { order: 0 },
  });
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(
    initialData?.image_url || null
  );

  React.useEffect(() => {
    if (initialData) {
      reset(initialData);
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

  const onSubmit = async (data: CategoryFormData) => {
    const loadingToast = toast.loading(
      editMode ? "Kategori güncelleniyor..." : "Kategori ekleniyor..."
    );
    try {
      let imageUrl = data.image_url;
      if (imageFile) {
        setUploading(true);
        imageUrl = await uploadImageAndGetUrl(imageFile, "categories");
        setValue("image_url", imageUrl);
        setUploading(false);
      }
      if (editMode && initialData && "id" in initialData && initialData.id) {
        await updateCategory(initialData.id, {
          ...data,
          image_url: imageUrl ?? "",
          name_en: data.name_en || "",
          name_ar: data.name_ar || "",
          order: typeof data.order === "number" ? data.order : 0,
        });
        toast.success("Kategori güncellendi", { id: loadingToast });
      } else {
        await addCategory({
          ...data,
          image_url: imageUrl,
          name_en: data.name_en || "",
          name_ar: data.name_ar || "",
        });
        toast.success("Kategori başarıyla eklendi", { id: loadingToast });
      }
      reset();
      setImageFile(null);
      setPreviewUrl(null);
      onSuccess();
    } catch (error) {
      setUploading(false);
      console.error("Kategori ekleme/güncelleme hatası:", error);
      toast.error("Kategori kaydedilirken bir hata oluştu", {
        id: loadingToast,
      });
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    if (!window.confirm("Bu kategoriyi silmek istediğinize emin misiniz?"))
      return;
    const loadingToast = toast.loading("Kategori siliniyor...");
    try {
      await deleteCategory(initialData.id);
      toast.success("Kategori silindi", { id: loadingToast });
      reset();
      setImageFile(null);
      setPreviewUrl(null);
      onSuccess();
    } catch (error) {
      toast.error("Kategori silinirken bir hata oluştu", { id: loadingToast });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-gray-800 p-6 rounded-xl border border-gray-700"
    >
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">
          {editMode ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label
              htmlFor="name_tr"
              className="block text-sm font-medium text-gray-300"
            >
              Kategori Adı (Türkçe)
            </label>
            <input
              type="text"
              {...register("name_tr")}
              className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700/50 text-white shadow-sm focus:border-red-500 focus:ring-red-500"
              placeholder="Örn: Ana Yemekler"
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
            <p className="mt-1 text-sm text-gray-400">
              Kategorinin menüdeki sırası (0 en üstte gösterilir)
            </p>
            {errors.order && (
              <p className="mt-1 text-sm text-red-500">
                {errors.order.message}
              </p>
            )}
          </div>

          <div>
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
        </div>
      </div>

      <div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4 mr-2" />
            {editMode
              ? isSubmitting
                ? "Güncelleniyor..."
                : "Kaydet"
              : isSubmitting
              ? "Ekleniyor..."
              : "Kategori Ekle"}
          </button>
          {editMode && (
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sil
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

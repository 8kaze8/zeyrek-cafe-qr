import React from "react";
import { Category } from "../types/menu";
import clsx from "clsx";
import type { Language } from "../types/menu";
import { deleteCategory } from "../lib/firebase-admin";
import toast from "react-hot-toast";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

interface CategoryListProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
  selectedLanguage: Language;
  showEditLabel?: boolean;
  variant?: "vertical" | "horizontal";
  showDeleteButton?: boolean;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedLanguage,
  showEditLabel = true,
  variant = "horizontal",
  showDeleteButton = false,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [categoryToDelete, setCategoryToDelete] = React.useState<string | null>(
    null
  );

  const handleDelete = async (categoryId: string) => {
    setDeleteModalOpen(true);
    setCategoryToDelete(categoryId);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete);
      toast.success("Kategori silindi");
      window.dispatchEvent(new CustomEvent("categoryDeleted"));
    } catch (error) {
      toast.error("Kategori silinirken bir hata oluştu");
    } finally {
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  if (variant === "vertical") {
    return (
      <>
        <div className="flex flex-col gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={clsx(
                "group flex items-center gap-4 p-4 rounded-2xl bg-[#23283b] border border-[#2a4c7d]/30 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer relative overflow-hidden",
                selectedCategory === category.id && "ring-2 ring-[#4fa3e3]"
              )}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  onSelectCategory(category.id);
              }}
            >
              {category.image_url ? (
                <img
                  src={category.image_url}
                  alt={category[`name_${selectedLanguage}`]}
                  className="w-16 h-16 object-cover rounded-xl border border-[#2a4c7d]/40 bg-[#2a4c7d]/10"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-[#2a4c7d]/10 flex items-center justify-center text-[#4fa3e3] text-2xl font-bold border border-[#2a4c7d]/20">
                  {category[`name_${selectedLanguage}`]?.[0] || "?"}
                </div>
              )}
              <div className="flex-1 text-left">
                <div className="text-lg font-semibold text-white mb-1 group-hover:text-[#4fa3e3] transition-colors">
                  {category[`name_${selectedLanguage}`]}
                </div>
                <div className="text-sm text-[#4fa3e3] opacity-80">
                  Sıra: {category.order}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-2">
                {showEditLabel && (
                  <button
                    type="button"
                    className="text-xs text-[#4fa3e3] bg-[#2a4c7d]/20 px-2 py-1 rounded-lg"
                    tabIndex={-1}
                  >
                    Düzenle
                  </button>
                )}
                {showDeleteButton && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(category.id);
                    }}
                    className="text-xs text-red-400 bg-[#2a4c7d]/20 px-2 py-1 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                    aria-label="Sil"
                    tabIndex={-1}
                  >
                    Sil
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <ConfirmDeleteModal
          open={deleteModalOpen}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          title="Kategoriyi Sil"
          description="Bu kategoriyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        />
      </>
    );
  }
  // horizontal (default)
  return (
    <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={clsx(
            "relative flex flex-col items-center justify-center rounded-xl transition-all duration-300 overflow-hidden group",
            "backdrop-blur-sm",
            selectedCategory === category.id
              ? "bg-gradient-to-br from-[#4fa3e3]/90 to-[#2a4c7d]/90 text-white shadow-lg ring-2 ring-[#4fa3e3]"
              : "bg-gradient-to-br from-[#2a4c7d]/40 to-[#2a4c7d]/30 text-[#4fa3e3] hover:from-[#2a4c7d]/50 hover:to-[#2a4c7d]/40"
          )}
          style={{ width: 120, height: 120 }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {category.image_url ? (
            <img
              src={category.image_url}
              alt={category[`name_${selectedLanguage}`]}
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity"
              draggable={false}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#2a4c7d]/60 to-[#2a4c7d]/40" />
          )}

          <div className="relative z-10 flex flex-col items-center justify-center p-3 h-full">
            <span className="text-base font-semibold text-center drop-shadow-md mb-1">
              {category[`name_${selectedLanguage}`]}
            </span>
            <div className="w-8 h-0.5 bg-current opacity-50 rounded-full" />
          </div>
        </button>
      ))}
    </div>
  );
};

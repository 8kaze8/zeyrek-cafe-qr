import {
  ref,
  push,
  update,
  remove,
  query,
  orderByChild,
  serverTimestamp,
  get,
  set,
} from "firebase/database";
import { db } from "./firebase";
import type { Category, Product } from "../types/menu";
import { storage } from "./firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const categoriesRef = ref(db, "categories");
    const snapshot = await get(query(categoriesRef, orderByChild("order")));

    if (!snapshot.exists()) {
      return [];
    }

    const categories: Category[] = [];
    snapshot.forEach((childSnapshot) => {
      categories.push({
        id: childSnapshot.key as string,
        ...childSnapshot.val(),
      });
    });

    return categories.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const addCategory = async (category: Omit<Category, "id">) => {
  try {
    const categoriesRef = ref(db, "categories");
    const newCategoryRef = push(categoriesRef);

    const categoryData = {
      name_tr: category.name_tr.trim(),
      name_en: (category.name_en || category.name_tr).trim(),
      name_ar: (category.name_ar || category.name_tr).trim(),
      order: Number(category.order) || 0,
      image_url: category.image_url?.trim() || null,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };

    await set(newCategoryRef, categoryData);
    return { id: newCategoryRef.key, ...categoryData };
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

export const updateCategory = async (
  categoryId: string,
  updates: Partial<Category>
) => {
  try {
    const categoryRef = ref(db, `categories/${categoryId}`);
    const updateData = {
      ...updates,
      updated_at: serverTimestamp(),
    };
    await set(categoryRef, updateData);
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteCategory = async (categoryId: string) => {
  try {
    const categoryRef = ref(db, `categories/${categoryId}`);
    await remove(categoryRef);
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

export const fetchProducts = async (
  categoryId?: string
): Promise<Product[]> => {
  try {
    const productsRef = ref(db, "products");
    const snapshot = await get(query(productsRef, orderByChild("order")));

    if (!snapshot.exists()) {
      return [];
    }

    const products: Product[] = [];
    snapshot.forEach((childSnapshot) => {
      const product = {
        id: childSnapshot.key as string,
        ...childSnapshot.val(),
      };
      if (!categoryId || product.category_id === categoryId) {
        products.push(product);
      }
    });

    return products.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const addProduct = async (product: Omit<Product, "id">) => {
  try {
    const productsRef = ref(db, "products");
    const newProductRef = push(productsRef);

    const productData = {
      name_tr: product.name_tr.trim(),
      name_en: (product.name_en || product.name_tr).trim(),
      name_ar: (product.name_ar || product.name_tr).trim(),
      description_tr: product.description_tr?.trim() || null,
      description_en: product.description_en?.trim() || null,
      description_ar: product.description_ar?.trim() || null,
      category_id: product.category_id,
      price: Number(product.price) || 0,
      order: Number(product.order) || 0,
      image_url: product.image_url?.trim() || null,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };

    await set(newProductRef, productData);
    return { id: newProductRef.key, ...productData };
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

export const updateProduct = async (
  productId: string,
  updates: Partial<Product>
) => {
  try {
    const productRef = ref(db, `products/${productId}`);
    const updateData = {
      ...updates,
      updated_at: serverTimestamp(),
    };
    await update(productRef, updateData);
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const productRef = ref(db, `products/${productId}`);
    await remove(productRef);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

/**
 * Uploads an image file to Firebase Storage and returns the download URL.
 * @param file The image file to upload
 * @param folder The folder in storage (e.g., 'categories' or 'products')
 * @returns The download URL of the uploaded image
 */
export const uploadImageAndGetUrl = async (
  file: File,
  folder: string
): Promise<string> => {
  const fileName = `${folder}/${Date.now()}_${file.name}`;
  const imageRef = storageRef(storage, fileName);
  await uploadBytes(imageRef, file);
  return getDownloadURL(imageRef);
};

export const updateAllProductsToActive = async () => {
  const productsRef = ref(db, "products");
  const snapshot = await get(productsRef);

  if (snapshot.exists()) {
    const updates: { [key: string]: any } = {};
    snapshot.forEach((child) => {
      const productData = child.val();
      updates[child.key as string] = {
        ...productData,
        is_active: true,
      };
    });
    await update(productsRef, updates);
  }
};

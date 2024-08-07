import { ref, type Ref } from "vue";

// Default import
import Category from "~/interfaces/Category.interface";
import Product from "~/interfaces/Product.interface";
import Shelves from "~/interfaces/Shelves.interface";

interface Database {
  products: { [key: string]: Product };
  categories: { [key: string]: Category };
  shelves: { [key: string]: Shelves };
}

export const useLocalDatabase = () => {
  const products: Ref<{ [key: string]: Product }> = ref({});
  const categories: Ref<{ [key: string]: Category }> = ref({});
  const shelves: Ref<{ [key: string]: Shelves }> = ref({});

  const loadDatabase = async () => {
    try {
      const response = await fetch("/api/database");
      const data: Database = await response.json();
      products.value = data.products || {};
      categories.value = data.categories || {};
      shelves.value = data.shelves || {};
    } catch (error) {
      console.error("Error loading database:", error);
    }
  };

  const getProductById = (id: string) => {
    return (
      products.value[id] ||
      Object.values(products.value).find((product) => product.sku === id) ||
      null
    );
  };

  return {
    loadDatabase,
    products,
    categories,
    shelves,
    getProductById,
  };
};

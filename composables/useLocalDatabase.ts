import { ref, type Ref } from "vue";

interface Product {
  name: string;
  description: string;
  image: string;
  categoryId: string;
  shelves: string[];
  price: number;
  sku: string;
  status: number;
  quantity: number;
  createdAt: string;
}

interface Database {
  products: { [key: string]: Product };
}

export const useLocalDatabase = () => {
  const products: Ref<{ [key: string]: Product }> = ref({});

  const loadDatabase = async () => {
    try {
      const response = await fetch("/api/database");
      const data = await response.json();
      products.value = data.products || [];
    } catch (error) {
      console.error("Error loading database:", error);
    }
  };
  const getProductById = (id: string): Product | undefined =>
    products.value[id];
  console.log(getProductById);
  return {
    loadDatabase,
    products,
    getProductById,
  };
};

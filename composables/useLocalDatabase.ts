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
      // Kiểm tra cấu trúc dữ liệu
      console.log("Raw data from API:", data);
      products.value = data.products || {};
      console.log("Loaded products:", products.value);
    } catch (error) {
      console.error("Error loading database:", error);
    }
  };
  const getProductById = (id: string) => {
    return products.value[id] || Object.values(products.value).find((product) => product.sku === id) || null;
  };
  
  
  
  
  
  return {
    loadDatabase,
    products,
    getProductById,
  };
};

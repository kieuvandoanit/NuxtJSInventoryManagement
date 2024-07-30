<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Admin Product Management</h1>
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search products..."
        class="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div class="overflow-x-auto">
      <table
        class="min-w-full bg-white border border-gray-200 rounded-lg shadow-md"
      >
        <thead class="bg-gray-100">
          <tr>
            <th class="p-3 text-left font-semibold text-gray-600">Name</th>
            <th class="p-3 text-left font-semibold text-gray-600">Price</th>
            <th class="p-3 text-left font-semibold text-gray-600">Image</th>
            <th class="p-3 text-left font-semibold text-gray-600">
              Description
            </th>
            <th class="p-3 text-left font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="product in filteredProducts"
            :key="product.id"
            class="border-b hover:bg-gray-200 focus:outline-none focus:ring cursor-pointer"
          >
            <td class="p-3">{{ product.name }}</td>
            <td class="p-3">${{ product.price }}</td>
            <td class="p-3">
              <img
                :src="product.img"
                alt="Product Image"
                class="w-20 h-20 object-cover"
              />
            </td>
            <td class="p-3">{{ product.description }}</td>
            <td class="p-3 flex space-x-2">
              <button
                @click="editProduct(product)"
                class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                @click="deleteProduct(product.id)"
                class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

const searchQuery = ref("");
const products = ref([
  {
    id: 1,
    name: "Product 1",
    img: "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-card-40-iphone15prohero-202309_FMT_WHH?wid=508&hei=472&fmt=p-jpg&qlt=95&.v=1693086369818",
    price: 10,
    description: "Description for product 1",
  },
  {
    id: 2,
    name: "Product 2",
    img: "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-card-40-iphone15prohero-202309_FMT_WHH?wid=508&hei=472&fmt=p-jpg&qlt=95&.v=1693086369818",
    price: 20,
    description: "Description for product 2",
  },
  {
    id: 3,
    name: "Product 3",
    img: "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-card-40-iphone15prohero-202309_FMT_WHH?wid=508&hei=472&fmt=p-jpg&qlt=95&.v=1693086369818",
    price: 30,
    description: "Description for product 3",
  },
]);

const filteredProducts = computed(() => {
  return products.value.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const editProduct = (product) => {
  console.log("Edit product:", product);
  // Implement edit functionality
};

const deleteProduct = (productId) => {
  products.value = products.value.filter((product) => product.id !== productId);
};
</script>

<style scoped>
/* Các kiểu tùy chỉnh có thể thêm vào đây nếu cần */
</style>

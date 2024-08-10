<template>
  <div class="container mx-auto p-4">
    <div class="mb-4 flex justify-between items-center">
      <h2 class="text-2xl font-semibold">Stock Check Report</h2>
      <div class="flex space-x-4">
        <input
          type="date"
          class="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <NuxtLink
          to="/products/create"
          class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
        >
          Create
        </NuxtLink>
      </div>
    </div>
    <div class="overflow-x-auto rounded-lg">
      <table
        class="min-w-full bg-white border border-gray-200 rounded-lg shadow-md"
      >
        <thead class="bg-gray-100">
          <tr>
            <th class="p-3 text-left font-semibold text-gray-600">SKU</th>
            <th class="p-3 text-left font-semibold text-gray-600">ID</th>
            <th class="p-3 text-left font-semibold text-gray-600">Image</th>
            <th class="p-3 text-left font-semibold text-gray-600">Item Name</th>
            <th class="p-3 text-left font-semibold text-gray-600">Quantity</th>
            <th class="p-3 text-left font-semibold text-gray-600">Location</th>
            <th class="p-3 text-left font-semibold text-gray-600">Price</th>
            <th class="p-3 text-left font-semibold text-gray-600">Badge</th>
            <th class="p-3 text-left font-semibold text-gray-600">Status</th>
            <th class="p-3 text-left font-semibold text-gray-600">
              Created At
            </th>
          </tr>
        </thead>
        <tbody>
          <template
            v-for="product in Object.values(products)"
            :key="product.productId"
          >
            <tr class="border-b border-gray-200 hover:bg-gray-50">
              <td class="p-3">{{ product.sku }}</td>
              <td class="p-3">{{ product.productId }}</td>
              <td class="p-3">
                <img
                  :src="product.image"
                  :alt="product.name"
                  class="w-32 h-32 object-cover"
                />
              </td>
              <td class="p-3 max-w-[200px] break-words">
                <NuxtLink
                  :to="`/products/${product.productId}`"
                  class="text-blue-500 hover:underline"
                >
                  {{ product.name }}
                </NuxtLink>
              </td>
              <td class="p-3">{{ product.quantity }}</td>
              <td class="p-3">{{ product.shelves.join(", ") }}</td>
              <td class="p-3">{{ product.price }}</td>
              <td class="p-3">{{ product.sku }}</td>
              <td
                class="p-3"
                :class="
                  product.status === 0 ? 'text-green-500' : 'text-red-500'
                "
              >
                {{ product.status === 0 ? "Available" : "Out of Stock" }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <UiPagination
        :loading="loading"
        :hasMore="hasMore"
        :currentPage="currentPage"
        @next-page="handleNextPage"
        @previous-page="handlePreviousPage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useFirebaseDatabase } from "~/composables/useFirebaseDatabase";
import type Product from "~/interfaces/Product.interface";

const { getItemsForPage } = useFirebaseDatabase();

const products = ref<Record<string, Product>>({});
const loading = ref(false);
const hasMore = ref(true);
const currentPage = ref(1);
const lastKey = ref<string | null>(null);
const pageLimit = 5; // Số lượng sản phẩm trên mỗi trang

const loadProducts = async () => {
  loading.value = true;
  try {
    const result = await getItemsForPage<Product>(
      "products",
      "createdAt",
      pageLimit,
      lastKey.value
    );

    // Cập nhật products object
    result.items.forEach((item) => {
      products.value[item.id] = item; // Sử dụng 'id' nếu bạn đã thêm 'id' vào dữ liệu
    });

    lastKey.value = result.lastKey as string | null;
    hasMore.value = result.items.length === pageLimit;

    // Log sản phẩm để kiểm tra
    console.log("Products loaded:", products.value);
  } catch (error) {
    console.error("Error loading products:", error);
  } finally {
    loading.value = false;
  }
};

const handleNextPage = async () => {
  if (hasMore.value && !loading.value) {
    currentPage.value++;
    await loadProducts();
  }
};

const handlePreviousPage = async () => {
  if (currentPage.value > 1 && !loading.value) {
    currentPage.value--;
    lastKey.value = null; // Reset lastKey to load from the beginning
    products.value = {}; // Clear current products
    await loadProducts();
  }
};

onMounted(async () => {
  await loadProducts();
});
</script>

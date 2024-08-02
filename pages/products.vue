<template>
  <div>
    <div class="container mx-auto p-4">
      <div class="mb-4 flex justify-between items-center">
        <h2 class="text-2xl font-semibold">Stock Check Report</h2>
        <input
          type="date"
          class="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div class="overflow-x-auto rounded-lg">
        <table
          class="min-w-full bg-white border border-gray-200 rounded-lg shadow-md"
        >
          <thead class="bg-gray-100">
            <tr>
              <th class="p-3 text-left font-semibold text-gray-600">
                Date Time
              </th>
              <th class="p-3 text-left font-semibold text-gray-600">Item</th>
              <th class="p-3 text-left font-semibold text-gray-600">Image</th>
              <th class="p-3 text-left font-semibold text-gray-600">
                Item name
              </th>
              <th class="p-3 text-left font-semibold text-gray-600">
                Scan Qty
              </th>
              <th class="p-3 text-left font-semibold text-gray-600">
                Location
              </th>
              <th class="p-3 text-left font-semibold text-gray-600">Price</th>
              <th class="p-3 text-left font-semibold text-gray-600">Badge</th>
              <th class="p-3 text-left font-semibold text-gray-600">Status</th>
              <th class="p-3 text-left font-semibold text-gray-600">
                Created at
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(product, id) in products"
              :key="id"
              @click="goToProductDetail(id)"
              class="cursor-pointer hover:bg-gray-200"
            >
              <td class="p-3">{{ product.sku }}</td>
              <td class="p-3">{{ id }}</td>
              <td class="p-3">
                <img
                  :src="product.image"
                  alt="Product Image"
                  class="w-32 h-32 object-cover"
                />
              </td>
              <td class="p-3 max-w-[200px] break-words">{{ product.name }}</td>
              <td class="p-3">{{ product.quantity }}</td>
              <td class="p-3">{{ product.shelves.join(",") }}</td>
              <td class="p-3">{{ product.price }}</td>
              <td class="p-3">{{ product.sku }}</td>
              <td class="p-3 text-green-500">
                {{ product.status === 0 ? "Available" : "Out of Stock" }}
              </td>
              <td class="p-3">{{ product.createdAt }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useLocalDatabase } from "~/composables/useLocalDatabase";
import { useRouter } from "vue-router";

const router = useRouter();
const { loadDatabase, products, getProductById } = useLocalDatabase();

const product = ref<Product | null>(null);
const productId = "PROD_0001";

onMounted(async () => {
  await loadDatabase();
  product.value = getProductById(productId) || null;
});
console.log(product.value);
const goToProductDetail = (id: string) => {
  router.push(`/products/${id}`);
};
</script>

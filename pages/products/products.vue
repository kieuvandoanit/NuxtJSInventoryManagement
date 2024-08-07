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
        <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
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
              <th class="p-3 text-left font-semibold text-gray-600">Created At</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="[id, product] in Object.entries(products)"
              :key="id"
            >
              <td class="p-3">{{ product.sku }}</td>
              <td class="p-3">{{ id }}</td>
              <td class="p-3">
                <img :src="product.image" alt="Product Image" class="w-32 h-32 object-cover" />
              </td>
              <td class="p-3 max-w-[200px] break-words">
                <NuxtLink :to="`/products/${id}`" class="text-blue-500 hover:underline">
                  {{ product.name }}
                </NuxtLink>
              </td>
              <td class="p-3">{{ product.quantity }}</td>
              <td class="p-3">{{ product.shelves.join(",") }}</td>
              <td class="p-3">{{ product.price }}</td>
              <td class="p-3">{{ product.sku }}</td>
              <td class="p-3 text-green-500">{{ product.status === 0 ? "Available" : "Out of Stock" }}</td>
              <td class="p-3">{{ product.createdAt }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useLocalDatabase } from '~/composables/useLocalDatabase';

const { loadDatabase, products } = useLocalDatabase();

onMounted(async () => {
  try {
    await loadDatabase();
    console.log('Loaded products:', products.value); // Debugging
  } catch (error) {
    console.error('Error loading products:', error);
  }
});
</script>

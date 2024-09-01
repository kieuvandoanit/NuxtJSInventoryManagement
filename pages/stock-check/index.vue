<template>
  <div class="relative shadow rounded overflow-hidden">
    <table class="w-full text-sm text-left rtl:text-right text-white-500">
      <thead class="text-xs text-white-700 uppercase bg-white">
        <tr>
          <th scope="col" class="px-6 py-3 w-[400px]"> Chiến dịch </th>
          <th scope="col" class="px-6 py-3"> Hành động </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in inventoryCheckList"
          :key="item.id"
          class="bg-white border-b bg-white-800 border-white-700 hover:bg-gray-100"
        >
          <th scope="row" class="flex items-center px-6 py-4 whitespace-nowrap text-black">
            <div class="font-normal text-white-500">
              {{ item.name }}
            </div>
          </th>
          <td class="px-6 py-4">
            <NuxtLink
              :to="`/stock-check/${item.id}`"
              type="button"
              class="font-medium text-blue-600 text-blue-500 hover:underline"
            >
              Chi tiết
            </NuxtLink>
          </td>
        </tr>
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
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useFirebaseDatabase } from '~/composables/useFirebaseDatabase';
import type { InventoryCheck } from '~/interfaces';

const { getItemsForPage } = useFirebaseDatabase();

const inventoryCheckList = ref<InventoryCheck[]>([]);
const loading = ref<boolean>(false);
const hasMore = ref<boolean>(false);
const currentPage = ref<number>(1);
const pageLimit: number = 5;

let nextPageKey: string | number | null | undefined = null;
let firstKeys: number[]  = []; // To track keys for each page

onMounted( async () => {
  await fetchItemForCurrentPage();
});

const fetchItemForCurrentPage = async () => {
  loading.value = true;
  try {
    const { items, nextPageKey: newKey } = await getItemsForPage<InventoryCheck>(
      "stockCheck/inventoryCheck/data",
      "createdAt",
      pageLimit,
      nextPageKey
    );

    inventoryCheckList.value = items;
    nextPageKey = newKey;

    // Update the first keys for previous navigation
    if (currentPage.value > firstKeys.length) {
      firstKeys.push(items[items.length - 1]?.createdAt || 0);
    }

    // Check if there's more data
    hasMore.value = newKey ? true : false;
  } catch (error) {
    console.error("Error fetching items for page:", error);
  } finally {
    loading.value = false;
  }
}

const handleNextPage = async () => {
  if (!hasMore.value) return;

  currentPage.value += 1;
  await fetchItemForCurrentPage();
};

const handlePreviousPage = async () => {
  if (currentPage.value === 1) return;

  currentPage.value -= 1;
  nextPageKey = firstKeys[currentPage.value - 2] || null;
  await fetchItemForCurrentPage();
};
</script>

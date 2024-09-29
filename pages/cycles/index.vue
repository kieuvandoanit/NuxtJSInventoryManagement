<template>
  <div class="container mx-auto p-4 bg-white">
    <!-- Create Button -->
    <div class="flex justify-end mb-4">
      <NuxtLink
        to="/cycles/create"
        class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
      >
        Thêm mới
      </NuxtLink>
    </div>

    <table class="w-full text-sm text-left rtl:text-right text-white-500">
      <thead class="text-xs text-white-700 uppercase bg-white">
        <tr>
          <th scope="col" class="px-6 py-3 text-center">Tên chiến dịch</th>
          <th scope="col" class="px-6 py-3 text-center">Trạng thái</th>
          <th scope="col" class="px-6 py-3 text-center">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in cycleList"
          :key="item.id"
          class="bg-white border-b bg-white-800 border-white-700 hover:bg-gray-100"
        >
          <td
            scope="row"
            class="flex items-center justify-center px-6 py-4 text-black"
          >
            {{ item.name }}
          </td>
          <td class="px-6 py-4 text-center">
            {{ item.status == 0 ? "Hoạt động" : item.status == 1 ? "Không hoạt động" : "Đầy" }}
          </td>
          <td class="px-6 py-4 text-center">
            <NuxtLink
              :to="`/cycles/${item.id}`"
              type="button"
              class="font-medium text-blue-600 text-blue-500 hover:underline"
            >
              Sửa
            </NuxtLink>
            <span class="mx-1">|</span>
            <span
              type="button"
              class="font-medium text-red-600 text-red-500 hover:underline"
              @click="deleteCycle(item.id)"
            >
              Xóa
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Component -->
    <UiPagination
      :loading="loading"
      :hasMore="hasMore"
      :currentPage="currentPage"
      @next-page="handleNextPage"
      @previous-page="handlePreviousPage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useFirebaseDatabase } from "~/composables/useFirebaseDatabase";
import type Cycle from "~/interfaces/Cycle.interface";

const { getItemsForPage, deleteData } = useFirebaseDatabase();

const cycleList = ref<Cycle[]>([]);
const loading = ref(false);
const pageLimit = 5;
const currentPage = ref(1);

let nextPageKey: string | number | null | undefined = null;
let firstKeys: number[] = []; // To track keys for each page
const hasMore = ref(true);

// Fetch item for the current page
const fetchItemForTheCurrentPage = async () => {
  loading.value = true;
  try {
    const { items, nextPageKey: newKey } = await getItemsForPage<Cycle>(
      "stockCheck/cycles/data",
      "createdAt",
      pageLimit,
      nextPageKey
    );

    cycleList.value = items;
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
};

onMounted(async () => {
  await fetchItemForTheCurrentPage();
});

const handleNextPage = async () => {
  if (!hasMore.value) return;

  currentPage.value += 1;
  await fetchItemForTheCurrentPage();
};

const handlePreviousPage = async () => {
  if (currentPage.value === 1) return;

  currentPage.value -= 1;
  nextPageKey = firstKeys[currentPage.value - 2] || null;
  await fetchItemForTheCurrentPage();
};

const deleteCycle = async (cycleId: string|undefined) => {
  if (cycleId) {
    await deleteData(`stockCheck/cycles/data/${cycleId}`);
    await fetchItemForTheCurrentPage();

    // Delete in inventoryCheck
    await deleteData(`stockCheck/inventoryCheck/data/${cycleId}`);
  }
}
</script>

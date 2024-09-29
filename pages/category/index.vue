<template>
  <div class="relative shadow rounded overflow-hidden">
    <!-- Header Section -->
    <div class="flex items-center justify-end space-y-4 py-4 bg-white">
      <!-- Add Category Button -->
        <NuxtLink
          to="/category/create"
          class="border item-center p-2 rounded-lg mr-2 bg-emerald-500 text-white hover:bg-emerald-700"
        >
         Tạo mới 
        </NuxtLink>
    </div>

    <!-- Categories Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-white">
          <tr>
            <th scope="col" class="px-6 py-3">Tên Danh Mục</th>
            <th scope="col" class="px-6 py-3">Mã Danh Mục</th>
            <th scope="col" class="px-6 py-3">Trạng Thái</th>
            <th scope="col" class="px-6 py-3">Mô tả</th>
            <th scope="col" class="px-6 py-3">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="category in categories"
            :key="category.id"
            class="bg-white border-b hover:bg-gray-100"
          >
            <td class="px-6 py-4">
              <NuxtLink
                class="text-blue-500 hover:underline"
                :to="`/category/${category.id}`"
              >
                {{ category.name }}
              </NuxtLink>
            </td>
            <td class="px-6 py-4">{{ category.id }}</td>
            <td class="px-6 py-4">
              <span
                :class="{
                  'text-green-500': category.status === 0,
                  'text-red-500': category.status !== 0,
                }"
              >
              {{ category.status === 0 ? "Hoạt động" : category.status === 1 ? "Không hoạt động" : category.status === 2 ? "Tạm dừng" : "Không xác định" }}
            </span>
            </td>
            <td class="px-6 py-4">{{ category.description }}</td>
            <td class="px-6 py-4">
              <NuxtLink
                :to="`/category/${category.id}`"
                class="font-medium text-blue-600 hover:underline"
              >
                Sửa
              </NuxtLink>
              <span class="mx-1">|</span>
              <span
                class="font-medium text-red-600 hover:underline cursor-pointer"
                @click="deleteCatergory(category.id)"
              >
                Xóa
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center mt-6">
      <UiPagination
        :loading="loading"
        :hasMore="hasMore"
        :currentPage="currentPage"
        @next-page="handleNextPage"
        @previous-page="handlePreviousPage"
        class="w-full"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
    middleware: 'auth'
});
import { ref, onMounted } from "vue";
import { useFirebaseDatabase } from "~/composables/useFirebaseDatabase";
import type Category from "~/interfaces/Category.interface";

const { getItemsForPage,deleteData } = useFirebaseDatabase();

const categories = ref<Category[]>([]);
const loading = ref(false);
const pageLimit = 5;
const currentPage = ref(1);

let lastKey: string | number | null | undefined = null;
let firstKeys: number[] = [];
const hasMore = ref(true);

const fetchCategoryForTheCurrentPage = async () => {
  loading.value = true;
  try {
    const { items, nextPageKey: newLastKey } = await getItemsForPage<Category>(
      "stockCheck/categories/data",
      "createdAt",
      pageLimit,
      lastKey
    );
    categories.value = items;
    lastKey = newLastKey;

    // If there are no items, handle it gracefully
    if (items.length > 0 && currentPage.value > firstKeys.length) {
      firstKeys.push(items[items.length - 1]?.createdAt || 0);
    }
    hasMore.value = items.length === pageLimit;
  } catch (error) {
    console.error("Error fetching categories for page:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchCategoryForTheCurrentPage();
});

const handleNextPage = async () => {
  if (!hasMore.value || loading.value) {
    console.error("Cannot go to next page. Either loading or no more data.");
    return;
  }

  currentPage.value += 1;
  await fetchCategoryForTheCurrentPage();
};

const handlePreviousPage = async () => {
  if (currentPage.value <= 1 || loading.value) {
    console.error(
      "Cannot go to previous page. Either loading or already on the first page."
    );
    return;
  }
  currentPage.value -= 1;
  lastKey = firstKeys[currentPage.value - 2] || null;
  await fetchCategoryForTheCurrentPage();
};

const deleteCatergory = async (catID: string|undefined) => {
  if (catID) {
    await deleteData(`stockCheck/categories/data/${catID}`);
    await fetchCategoryForTheCurrentPage();
  }
}
</script>

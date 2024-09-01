<template>
  <div class="relative shadow rounded overflow-hidden">
    <!-- Header Section -->
    <div class="flex items-center justify-between flex-wrap space-y-4 py-4 bg-white">
      <!-- Search Bar -->
      <div class="relative ml-2">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            class="w-4 h-4 text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="text"
          id="table-search-categories"
          class="block pb-2 pt-2 ps-10 text-sm border rounded-lg w-80 bg-gray-50 border-gray-600 focus:border-blue-500"
          autocomplete="off"
          placeholder="Search categories"
        />
      </div>
      <!-- Add Category Button -->
      <div>
        <NuxtLink
          to="/category/create"
          class="border item-center p-2 rounded-lg mr-2 bg-emerald-500 text-white hover:bg-emerald-700"
        >
          Add Category
        </NuxtLink>
      </div>
    </div>

    <!-- Categories Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th scope="col" class="px-6 py-3">Name</th>
            <th scope="col" class="px-6 py-3">ID</th>
            <th scope="col" class="px-6 py-3">Status</th>
            <th scope="col" class="px-6 py-3">Description</th>
            <th scope="col" class="px-6 py-3">Actions</th>
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
                {{ category.status === 0 ? "Available" : "Not Available" }}
              </span>
            </td>
            <td class="px-6 py-4">{{ category.description }}</td>
            <td class="px-6 py-4">
              <NuxtLink
                :to="`/category/${category.id}`"
                class="font-medium text-blue-600 hover:underline"
              >
                Edit
              </NuxtLink>
              <span class="mx-1">|</span>
              <span
                class="font-medium text-red-600 hover:underline cursor-pointer"
                @click="deleteCatergory(category.id)"
              >
                Delete
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
  console.log("Fetching categories for page:", currentPage.value);
  console.log("Last key before fetch:", lastKey);
  try {
    const { items, nextPageKey: newLastKey } = await getItemsForPage<Category>(
      "stockCheck/categories/data",
      "createdAt",
      pageLimit,
      lastKey
    );

    console.log("Fetched items:", items);
    console.log("New last key:", newLastKey);
    categories.value = items;
    lastKey = newLastKey;

    // If there are no items, handle it gracefully
    if (items.length > 0 && currentPage.value > firstKeys.length) {
      firstKeys.push(items[items.length - 1]?.createdAt || 0);
    }

    hasMore.value = items.length === pageLimit;
    console.log("Has more:", hasMore.value);
    console.log("Current page:", currentPage.value);
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
    console.log("Cannot go to next page. Either loading or no more data.");
    return;
  }

  console.log("Next page clicked.");
  currentPage.value += 1;
  console.log("Moving to page:", currentPage.value);
  await fetchCategoryForTheCurrentPage();
};

const handlePreviousPage = async () => {
  if (currentPage.value <= 1 || loading.value) {
    console.log(
      "Cannot go to previous page. Either loading or already on the first page."
    );
    return;
  }

  console.log("Previous page clicked.");
  currentPage.value -= 1;
  lastKey = firstKeys[currentPage.value - 2] || null;
  console.log("Moving to page:", currentPage.value);
  console.log("Setting last key to:", lastKey);
  await fetchCategoryForTheCurrentPage();
};


const deleteCatergory = async (catID: string|undefined) => {
  if (catID) {
    await deleteData(`stockCheck/categories/data/${catID}`);
    await fetchCategoryForTheCurrentPage();
  }
}
</script>

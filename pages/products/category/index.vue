<template>
  <div class="container mx-auto px-4">
    <!-- Create Button -->
    <div class="flex justify-end mb-4">
      <NuxtLink
        to="/category/create"
        class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
      >
        Create Category
      </NuxtLink>
    </div>

    <!-- Category Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="category in categories"
        :key="category.categoryId"
        class="p-4 border rounded-md shadow-md"
      >
        <NuxtLink
          class="text-blue-500 hover:underline"
          :to="`/category/${category.id}`"
        >
          <h2 class="text-xl font-bold">{{ category.name }}</h2>
        </NuxtLink>
        <h2 class="text-xl font-bold">{{ category.categoryId }}</h2>
        <h3 class="text-sm text-gray-600">{{ category.categoryId }}</h3>
        <p
          class="text-sm font-semibold"
          :class="{
            'text-green-500': category.status === 0,
            'text-red-500': category.status !== 0,
          }"
        >
          {{ category.status === 0 ? "Available" : "Not Available" }}
        </p>
        <p class="mt-2 text-gray-700">{{ category.description }}</p>
      </div>
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
import { ref, onMounted } from "vue";
import { useFirebaseDatabase } from "~/composables/useFirebaseDatabase";
import type Category from "~/interfaces/Category.interface";

const { getItemsForPage } = useFirebaseDatabase();

const categories = ref<Category[]>([]);
const loading = ref(false);
const pageLimit = 20;
const currentPage = ref(1);

let lastKey: string | number | null | undefined = null;
let firstKeys: number[] = [];
const hasMore = ref(true);

const fetchCategoryForTheCurrentPage = async () => {
  loading.value = true;
  console.log("Fetching categories for page:", currentPage.value);
  console.log("Last key before fetch:", lastKey);

  try {
    const { items, lastKey: newLastKey } = await getItemsForPage<Category>(
      "categories",
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
</script>

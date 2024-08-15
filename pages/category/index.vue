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
        <h2 class="text-xl font-bold">{{ category.name }}</h2>
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

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useFirebaseDatabase } from "~/composables/useFirebaseDatabase";
import type Category from "~/interfaces/Category.interface";

const { getItemsForPage } = useFirebaseDatabase();

const categories = ref<Category[]>([]);
const loading = ref(false);
const hasMore = ref(true);
const currentPage = ref(1);

const pageKeys = ref<(string | number | null)[]>([null]);
const pageLimit = 10;

const loadCategory = async (isNextPage: boolean = true) => {
  loading.value = true;
  try {
    const lastKey = pageKeys.value[currentPage.value - 1] ?? null;
    const result = await getItemsForPage<Category>(
      "categories",
      "createdAt",
      pageLimit,
      lastKey
    );

    if (isNextPage) {
      categories.value = [...categories.value, ...result.items];
    } else {
      categories.value = result.items;
    }

    // Update pageKeys for next page navigation
    if (isNextPage) {
      const nextLastKey: string | number | null = result.lastKey ?? null;
      pageKeys.value[currentPage.value] = nextLastKey;
    }

    // Check if there are more items to load
    hasMore.value = result.items.length === pageLimit;
  } catch (error) {
    console.error("Error loading categories:", error);
  } finally {
    loading.value = false;
  }
};

const handleNextPage = async () => {
  if (hasMore.value && !loading.value) {
    currentPage.value++;
    await loadCategory(true);
  }
};

const handlePreviousPage = async () => {
  if (currentPage.value > 1 && !loading.value) {
    currentPage.value--;
    await loadCategory(false);
  }
};

onMounted(async () => {
  await loadCategory();
});
</script>

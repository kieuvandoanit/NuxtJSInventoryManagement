<template>
  <div class="container mx-auto p-4">
    <!-- Create Button -->
    <div class="flex justify-end mb-4">
      <NuxtLink
        to="/shelves/create"
        class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
      >
        Create
      </NuxtLink>
    </div>

    <!-- Shelves Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="(shelf, key) in shelves"
        :key="key"
        class="p-4 border rounded-md shadow-md cursor-pointer"
      >
        <h2 class="text-xl font-bold">{{ key }} - {{ shelf.id }}</h2>
        <p>{{ shelf.description }}</p>
        <p><strong>Location:</strong> {{ shelf.location }}</p>
        <p>
          <strong>Created At:</strong>
          {{ new Date(shelf.createdAt).toLocaleDateString() }}
        </p>
        <p
          class="text-sm font-semibold"
          :class="{
            'text-green-500': shelf.status === 0,
            'text-red-500': shelf.status !== 0,
          }"
        >
          {{ shelf.status === 0 ? "Available" : "Not Available" }}
        </p>
      </div>
    </div>

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
import type Shelves from "~/interfaces/Shelves.interface";

const { getItemsForPage } = useFirebaseDatabase();

const shelves = ref<Shelves[]>([]);
const loading = ref(false);
const hasMore = ref(true);
const currentPage = ref(1);

const pageKeys = ref<(string | number | null)[]>([null]);
const pageLimit = 6;

const loashelf = async (isNextPage: boolean = true) => {
  loading.value = true;
  try {
    const lastKey = pageKeys.value[currentPage.value - 1] ?? null;
    const result = await getItemsForPage<Shelves>(
      "shelves",
      "createdAt",
      pageLimit,
      lastKey
    );
    console.log("Fetched result:", result);
    shelves.value = result.items;
    if (isNextPage) {
      const nextLastKey: string | number | null = result.lastKey ?? null;
      pageKeys.value[currentPage.value] = nextLastKey;
    }

    hasMore.value = result.items.length === pageLimit;

    console.log("Products loaded:", shelves.value); // Đầu ra debug
  } catch (error) {
    console.error("Error loading products:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loashelf();
});

const handleNextPage = async () => {
  if (hasMore.value && !loading.value) {
    currentPage.value++;
    await loashelf(true);
  }
};

const handlePreviousPage = async () => {
  if (currentPage.value > 1 && !loading.value) {
    currentPage.value--;
    await loashelf(false);
  }
};

function loadDatabase() {
  throw new Error("Function not implemented.");
}
</script>

<style scoped>
/* Add any additional styling here if needed */
</style>

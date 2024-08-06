<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div
      v-for="(category, key) in categories"
      :key="key"
      class="p-4 border rounded-md shadow-md cursor-pointer	"
      
    >
      <h2 class="text-xl font-bold">{{ category.name }}</h2>
      <h3 class="text-sm font-bold">{{ key }}</h3>

      <p
        class="text-sm font-semibold"
        :class="{
          'text-green-500': category.status === 0,
          'text-red-500': category.status !== 0,
        }"
      >
        {{ category.status === 0 ? "Available" : "Not Available" }}
      </p>
      <p>{{ category.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useLocalDatabase } from "~/composables/useLocalDatabase";

const { loadDatabase, categories } = useLocalDatabase();

onMounted(async () => {
  try {
    await loadDatabase(); // Load both products and categories
    console.log("Loaded categories:", categories.value); // Debugging
  } catch (error) {
    console.error("Error loading categories:", error);
  }
});
</script>

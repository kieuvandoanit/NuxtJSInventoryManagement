<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div
      v-for="(shelf, key) in shelves"
      :key="key"
      class="p-4 border rounded-md shadow-md cursor-pointer"
    >
      <h2 class="text-xl font-bold">{{ key }} - {{ shelf.name }}</h2>
      <p>{{ shelf.description }}</p>
      <p><strong>Location:</strong> {{ shelf.location }}</p>
      <p><strong>Created At:</strong> {{ new Date(shelf.createdAt).toLocaleDateString() }}</p>
      <p
        class="text-sm font-semibold"
        :class="{
          'text-green-500': shelf.status === 0,
          'text-red-500': shelf.status !== 0
        }"
      >
        {{ shelf.status === 0 ? 'Available' : 'Not Available' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useLocalDatabase } from '~/composables/useLocalDatabase';

const { loadDatabase, shelves } = useLocalDatabase();

onMounted(async () => {
  try {
    await loadDatabase();
    console.log('Loaded shelves:', shelves.value);
  } catch (error) {
    console.error('Error loading shelves:', error);
  }
});
</script>
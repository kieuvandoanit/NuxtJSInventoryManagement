<template>
  <div class="max-w-lg mx-auto mt-8">
    <h1 class="text-2xl font-bold mb-6">Create New Category</h1>
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label for="name" class="block text-gray-700">Category Name</label>
        <input
          v-model="category.name"
          type="text"
          id="name"
          class="mt-2 p-2 border rounded w-full"
          required
        />
      </div>
      <div class="mb-4">
        <label for="description" class="block text-gray-700">Description</label>
        <textarea
          v-model="category.description"
          id="description"
          class="mt-2 p-2 border rounded w-full"
          required
        ></textarea>
      </div>
      <div class="mb-4">
        <label for="status" class="block text-gray-700">Status</label>
        <select
          v-model="category.status"
          id="status"
          class="mt-2 p-2 border rounded w-full"
        >
          <option :value="0">Available</option>
          <option :value="1">Not Available</option>
        </select>
      </div>
      <button
        type="submit"
        class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
      >
        Create Category
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useFirebaseDatabase } from "~/composables/useFirebaseDatabase";
import type Category from "~/interfaces/Category.interface";

const { create } = useFirebaseDatabase();

const category = ref<Category>({
  categoryId: "", // This will be generated automatically
  name: "",
  description: "",
  status: 0,
});

const handleSubmit = async () => {
  try {
    // Generate a new category ID
    const newCategoryId = await generateCategoryId();
    category.value.categoryId = newCategoryId;

    // Save the category to Firebase
    await create("categories", newCategoryId, category.value);
    alert("Category created successfully!");
  } catch (error) {
    console.error("Error creating category:", error);
    alert("Error creating category.");
  }
};

// Function to generate the new category ID
const generateCategoryId = async (): Promise<string> => {
  const lastCategory = await getLastCategory();
  const lastCategoryId = lastCategory ? lastCategory.categoryId : "CATE_0000";
  const nextCategoryId = `CATE_${String(
    parseInt(lastCategoryId.split("_")[1]) + 1
  ).padStart(4, "0")}`;
  return nextCategoryId;
};

// Function to get the last created category (for ID generation)
const getLastCategory = async (): Promise<Category | null> => {
  const result = await getItemsForPage<Category>("categories", "categoryId", 1);
  return result.items.length > 0 ? result.items[0] : null;
};
</script>
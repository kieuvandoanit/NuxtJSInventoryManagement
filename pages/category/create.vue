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
import { v4 as uuidv4 } from "uuid";

const { create } = useFirebaseDatabase();

const category = ref<Category>({
  categoryId: "", // This will be generated automatically
  name: "",
  description: "",
  status: 0,
  createdAt: currentUnixTimestamp(),
});

const handleSubmit = async () => {
  try {
    // Generate a new category ID using uuidv4
    const newCategoryId = `CATE_${uuidv4()}`;
    category.value.categoryId = newCategoryId;
    console.log(newCategoryId);
    // Save the category to Firebase
    const success = await create(`categories/${newCategoryId}`, category.value);
    if (success) {
      alert("Category created successfully!");
      category.value = { categoryId: "", name: "", description: "", status: 0 }; // Reset form
    } else {
      alert("Error creating category.");
    }
  } catch (error) {
    console.error("Error creating category:", error);
    alert("Error creating category.");
  }
};
</script>

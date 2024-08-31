<template>
  <div class="container mx-auto p-6">
    <!-- Category Detail Card -->
    <div
      v-if="category"
      class="bg-white p-6 border border-gray-200 rounded-lg shadow-md"
    >
      <h1 class="text-3xl font-semibold mb-4">{{ category.name }}</h1>
      <p class="text-lg mb-2"><strong>ID:</strong> {{ category.categoryId }}</p>
      <p class="text-lg mb-4">
        <strong>Description:</strong> {{ category.description }}
      </p>
      <p class="text-lg mb-4">
        <strong>Created At:</strong> {{ category.createdAt }}
      </p>
      <p class="text-lg mb-4">
        <strong>Status:</strong>
        <span
          :class="{
            'text-green-500': category.status === 0,
            'text-red-500': category.status !== 0,
          }"
        >
          {{ category.status === 0 ? "Available" : "Not Available" }}
        </span>
      </p>

      <!-- Edit Button -->
      <button
        @click="isEditing = !isEditing"
        class="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition duration-300 mb-4 mr-3"
      >
        {{ isEditing ? "Cancel" : "Edit" }}
      </button>

      <!-- Edit Form -->
      <div v-if="isEditing">
        <form @submit.prevent="saveChanges">
          <div class="mb-4">
            <label for="name" class="block text-lg font-medium mb-2"
              >Name</label
            >
            <input
              id="name"
              v-model="editedCategory.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="mb-4">
            <label for="description" class="block text-lg font-medium mb-2"
              >Description</label
            >
            <textarea
              id="description"
              v-model="editedCategory.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div class="mb-4">
            <label for="status" class="block text-lg font-medium mb-2"
              >Status</label
            >
            <select
              id="status"
              v-model="editedCategory.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option :value="0">Available</option>
              <option :value="1">Not Available</option>
            </select>
          </div>
          <button
            type="submit"
            class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Save Changes
          </button>
        </form>
      </div>

      <!-- Back Button -->
      <NuxtLink
        to="/category"
        class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 mt-4"
      >
        Back to Categories
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-else class="flex items-center justify-center h-64">
      <p class="text-gray-500 text-lg">Loading category data...</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useFirebaseDatabase } from "~/composables/useFirebaseDatabase";
import type Category from "~/interfaces/Category.interface";

const { getCategoryById, updateData } = useFirebaseDatabase();
const route = useRoute();
const category = ref<Category | null>(null);
const isEditing = ref(false);
const editedCategory = ref<Category | null>(null);

onMounted(async () => {
  try {
    const categoryId = String(route.params.id);
    console.log("Fetching category with ID:", categoryId);

    const fetchedCategory = await getCategoryById(categoryId);
    console.log("Fetched category:", fetchedCategory);

    if (fetchedCategory) {
      category.value = fetchedCategory;
      editedCategory.value = { ...fetchedCategory };
    } else {
      console.error("Category not found in the database.");
    }
  } catch (error) {
    console.error("Error loading category:", error);
  }
});

const saveChanges = async () => {
  if (editedCategory.value) {
    try {
      // Check if any changes have been made
      const hasChanged =
        JSON.stringify(editedCategory.value) !== JSON.stringify(category.value);

      if (hasChanged) {
        const categoryId = String(route.params.id);
        editedCategory.value.updatedAt = new Date().toISOString();

        const updateSuccess = await updateData(
          `categories/${categoryId}`,
          editedCategory.value
        );

        if (updateSuccess) {
          // Update the category with the new data
          category.value = { ...editedCategory.value };
          alert("Category details updated successfully!");
        } else {
          alert("Failed to update category details.");
        }

        // Disable editing mode after save
        isEditing.value = false;
      } else {
        alert("No changes detected.");
        // Disable editing mode if no changes were detected
        isEditing.value = false;
      }
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Error updating category.");
      // Disable editing mode if an error occurred
      isEditing.value = false;
    }
  }
};
</script>

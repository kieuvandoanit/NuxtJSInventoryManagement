<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Shelf Details</h1>
    <div v-if="shelf">
      <p><strong>ID:</strong> {{ shelf.shelveId }}</p>
      <p><strong>Name:</strong> {{ shelf.name }}</p>
      <p><strong>Description:</strong> {{ shelf.description }}</p>
      <p><strong>Location:</strong> {{ shelf.location }}</p>
      <p>
        <strong>Created At:</strong>
        {{ new Date(shelf.createdAt).toLocaleString() }}
      </p>
      <p
        :class="{
          'text-green-500': shelf.status === 0,
          'text-red-500': shelf.status !== 0,
        }"
      >
        <strong>Status:</strong>
        {{ shelf.status === 0 ? "Available" : "Not Available" }}
      </p>

      <!-- Edit Button -->
      <div class="mt-4">
        <button
          @click="isEditing = !isEditing"
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Edit
        </button>
      </div>

      <!-- Edit Form -->
      <div v-if="isEditing" class="mt-4">
        <h2 class="text-xl font-bold mb-4">Edit Shelf</h2>
        <form @submit.prevent="saveChanges">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium mb-2"
              >Name</label
            >
            <input
              v-model="editedShelf.name"
              type="text"
              id="name"
              class="border border-gray-300 rounded-md p-2 w-full"
              required
            />
          </div>
          <div class="mb-4">
            <label for="description" class="block text-sm font-medium mb-2"
              >Description</label
            >
            <textarea
              v-model="editedShelf.description"
              id="description"
              rows="4"
              class="border border-gray-300 rounded-md p-2 w-full"
              required
            ></textarea>
          </div>
          <div class="mb-4">
            <label for="location" class="block text-sm font-medium mb-2"
              >Location</label
            >
            <input
              v-model="editedShelf.location"
              type="text"
              id="location"
              class="border border-gray-300 rounded-md p-2 w-full"
              required
            />
          </div>
          <div class="mb-4">
            <label for="status" class="block text-sm font-medium mb-2"
              >Status</label
            >
            <select
              v-model="editedShelf.status"
              id="status"
              class="border border-gray-300 rounded-md p-2 w-full"
              required
            >
              <option value="0">Available</option>
              <option value="1">Not Available</option>
            </select>
          </div>
          <button
            type="submit"
            class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Save Changes
          </button>
          <button
            @click="disableEditing"
            type="button"
            class="inline-block bg-gray-500 text-white py-2 px-4 rounded-lg text-center hover:bg-gray-600 transition ml-4"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
    <div v-else>
      <p>Shelf not found.</p>
    </div>
    <div class="mt-4">
      <NuxtLink
        to="/shelves"
        class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
      >
        Back to Shelves
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useFirebaseDatabase } from "~/composables/useFirebaseDatabase";
import type Shelves from "~/interfaces/Shelves.interface";

const { getShelveById, updateData } = useFirebaseDatabase();
const route = useRoute();
const shelf = ref<Shelves | null>(null);
const originalshelf = ref<Shelves | null>(null);
const isEditing = ref(false);
const editedShelf = ref<Shelves | null>(null);
const successMessage = ref<string | null>(null);

onMounted(async () => {
  try {
    const shelveId = String(route.params.id);
    console.log("Fetching shelf with ID:", shelveId);

    const fetchedShelf = await getShelveById(shelveId);

    if (fetchedShelf) {
      console.log("Shelf found:", fetchedShelf);
      shelf.value = fetchedShelf;
      editedShelf.value = { ...fetchedShelf };
    } else {
      console.error("Shelf not found in the database.");
    }
  } catch (error) {
    console.error("Error loading shelf:", error);
  }
});

const saveChanges = async () => {
  if (shelf.value) {
    try {
      const hasChanged =
        JSON.stringify(shelf.value) !== JSON.stringify(originalshelf.value);

      if (hasChanged) {
        const shelveId = String(route.params.id);
        shelf.value.updatedAt = new Date().toISOString();

        const updateSuccess = await updateData(
          `shelves/${shelveId}`,
          shelf.value
        );

        if (updateSuccess) {
          successMessage.value = "Product details updated successfully!";
          originalshelf.value = JSON.parse(JSON.stringify(shelf.value));
        } else {
          successMessage.value = "Failed to update product details.";
        }

        setTimeout(() => {
          successMessage.value = null;
        }, 5000);
      } else {
        successMessage.value = "No changes detected.";
        setTimeout(() => {
          successMessage.value = null;
        }, 5000);
      }

      disableEditing();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  }
};

const disableEditing = () => {
  isEditing.value = false;
  if (shelf.value) {
    editedShelf.value = { ...shelf.value };
  }
};
</script>

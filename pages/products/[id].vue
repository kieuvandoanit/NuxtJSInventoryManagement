<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="container mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h1 class="text-4xl font-bold mb-6 text-gray-800">Product Details</h1>
      <div v-if="product" class="space-y-6">
        <div class="flex flex-col items-center">
          <img
            :src="product.image"
            alt="Product Image"
            class="w-64 h-64 object-cover rounded-lg shadow-md"
          />
          <p v-if="successMessage" class="text-green-500 font-semibold mt-4">
            {{ successMessage }}
          </p>

          <h2 class="text-3xl font-semibold mt-4 text-gray-900">
            {{ product.name }}
          </h2>
        </div>
        <div v-if="!editing" class="space-y-4">
          <p>
            <strong class="font-medium text-gray-700">Product ID:</strong>
            {{ route.params.id }}
          </p>
          <p>
            <strong class="font-medium text-gray-700">Description:</strong>
            {{ product.description }}
          </p>
          <p>
            <strong class="font-medium text-gray-700">Price:</strong>
            ${{ product.price.toLocaleString() }}
          </p>
          <p>
            <strong class="font-medium text-gray-700">Quantity:</strong>
            {{ product.quantity }}
          </p>
          <p>
            <strong class="font-medium text-gray-700">Location:</strong>
            {{ product.shelves.join(", ") }}
          </p>
          <p>
            <strong class="font-medium text-gray-700">Status:</strong>
            <span
              :class="product.status === 0 ? 'text-green-500' : 'text-red-500'"
            >
              {{ product.status === 0 ? "Available" : "Out of Stock" }}
            </span>
          </p>
          <p>
            <strong class="font-medium text-gray-700">Created At:</strong>
            {{ new Date(product.createdAt).toLocaleDateString() }}
          </p>
          <button
            @click="enableEditing"
            class="inline-block bg-green-500 text-white py-2 px-4 rounded-lg text-center hover:bg-green-600 transition"
          >
            Edit
          </button>
        </div>
        <div v-else class="space-y-4">
          <form @submit.prevent="saveChanges">
            <div class="mb-4">
              <label for="description" class="block text-gray-700"
                >Description:</label
              >
              <textarea
                id="description"
                v-model="product.description"
                rows="3"
                class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              ></textarea>
            </div>
            <div class="mb-4">
              <label for="price" class="block text-gray-700">Price:</label>
              <input
                id="price"
                type="number"
                v-model.number="product.price"
                class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div class="mb-4">
              <label for="quantity" class="block text-gray-700"
                >Quantity:</label
              >
              <input
                id="quantity"
                type="number"
                v-model.number="product.quantity"
                class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div class="mb-4">
              <label for="shelves" class="block text-gray-700">Location:</label>
              <input
                id="shelves"
                type="text"
                v-model="product.shelves"
                class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              type="submit"
              class="inline-block bg-blue-500 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-600 transition"
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
        <NuxtLink
          to="/products/products"
          class="inline-block bg-blue-500 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-600 transition"
        >
          Back to Products
        </NuxtLink>
      </div>
      <p v-else class="text-center text-gray-500">Loading product...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useFirebaseDatabase } from "~/composables/useFirebaseDatabase";
import { useRoute } from "vue-router";
import type Product from "~/interfaces/Product.interface";

const route = useRoute();
const { getOnce, updateData, getProductById } = useFirebaseDatabase();
const product = ref<Product | null>(null);
const editing = ref(false);
const successMessage = ref<string | null>(null);
const originalProduct = ref<Product | null>(null);

onMounted(async () => {
  try {
    // Ensure route.params.id is a string
    const productId = String(route.params.id);

    // Fetch product by ID
    const fetchedProduct = await getProductById(productId);
    console.log(fetchedProduct);
    if (fetchedProduct) {
      product.value = fetchedProduct;
      originalProduct.value = JSON.parse(JSON.stringify(fetchedProduct)); // Create a deep copy
    } else {
      console.error("Product not found.");
    }
  } catch (error) {
    console.error("Error loading product:", error);
  }
});

const enableEditing = () => {
  editing.value = true;
};

const disableEditing = () => {
  editing.value = false;
};

const saveChanges = async () => {
  if (product.value) {
    try {
      const hasChanged =
        JSON.stringify(product.value) !== JSON.stringify(originalProduct.value);

      if (hasChanged) {
        const productId = String(route.params.id);
        const updateSuccess = await updateData(
          `products/${productId}`,
          product.value
        );

        if (updateSuccess) {
          successMessage.value = "Product details updated successfully!";
          originalProduct.value = JSON.parse(JSON.stringify(product.value)); // Update original data
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
</script>

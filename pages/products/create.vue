<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-semibold mb-4">Create New Product</h2>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block mb-1 font-medium">Product Name</label>
        <input
          v-model="formData.name"
          type="text"
          class="border rounded-lg p-2 w-full"
          required
        />
      </div>

      <div>
        <label class="block mb-1 font-medium">SKU</label>
        <input
          v-model="formData.sku"
          type="text"
          class="border rounded-lg p-2 w-full"
          required
        />
      </div>

      <div>
        <label class="block mb-1 font-medium">Image URL</label>
        <input
          v-model="formData.image"
          type="text"
          class="border rounded-lg p-2 w-full"
          required
        />
      </div>

      <div>
        <label class="block mb-1 font-medium">Description</label>
        <textarea
          v-model="formData.description"
          class="border rounded-lg p-2 w-full"
          required
        ></textarea>
      </div>

      <div>
        <label class="block mb-1 font-medium">Price</label>
        <input
          v-model="formData.price"
          type="number"
          class="border rounded-lg p-2 w-full"
          required
        />
      </div>

      <div>
        <label class="block mb-1 font-medium">Quantity</label>
        <input
          v-model="formData.quantity"
          type="number"
          class="border rounded-lg p-2 w-full"
          required
        />
      </div>

      <div>
        <label class="block mb-1 font-medium">Shelves</label>
        <input
          v-model="formData.shelves"
          type="text"
          class="border rounded-lg p-2 w-full"
          required
          placeholder="Comma-separated values"
        />
      </div>

      <div>
        <label class="block mb-1 font-medium">Status</label>
        <select
          v-model="formData.status"
          class="border rounded-lg p-2 w-full"
          required
        >
          <option value="0">Available</option>
          <option value="1">Out of Stock</option>
        </select>
      </div>

      <div>
        <button
          type="submit"
          class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
        >
          Create Product
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useFirebaseDatabase } from "~/composables/useFirebaseDatabase";
import { useRouter } from "vue-router";

const router = useRouter();
const { create } = useFirebaseDatabase();

const formData = ref({
  name: "",
  sku: "",
  image: "",
  description: "",
  price: 0,
  quantity: 0,
  shelves: "",
  status: 0,
  createdAt: new Date().toISOString(),
  categoryId: "CATE_0005", // Tùy chọn
});

const handleSubmit = async () => {
  const productId = `PROD_${Date.now()}`; // Tạo ID ngẫu nhiên cho sản phẩm mới
  const productData = {
    ...formData.value,
    shelves: formData.value.shelves.split(",").map((shelf) => shelf.trim()), // Tách các giá trị "Shelves"
  };

  const success = await create(`products/${productId}`, productData);

  if (success) {
    alert("Product created successfully!");
    router.push("/products/products"); // Điều hướng trở lại danh sách sản phẩm
  } else {
    alert("Failed to create product.");
  }
};
</script>

<style scoped>
.container {
  max-width: 640px;
}
</style>

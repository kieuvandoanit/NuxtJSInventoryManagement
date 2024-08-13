<template>
  <div class="max-w-4xl mx-auto p-8">
    <h1 class="text-2xl font-bold mb-6">Create New Shelve</h1>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="flex flex-col">
        <label for="name" class="text-lg font-medium mb-2">Name</label>
        <input
          v-model="shelve.name"
          type="text"
          id="name"
          class="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>

      <div class="flex flex-col">
        <label for="description" class="text-lg font-medium mb-2"
          >Description</label
        >
        <textarea
          v-model="shelve.description"
          id="description"
          rows="4"
          class="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        ></textarea>
      </div>

      <div class="flex flex-col">
        <label for="location" class="text-lg font-medium mb-2">Location</label>
        <input
          v-model="shelve.location"
          type="text"
          id="location"
          class="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>

      <div class="flex flex-col">
        <label for="status" class="text-lg font-medium mb-2">Status</label>
        <select
          v-model="shelve.status"
          id="status"
          class="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        >
          <option value="0">Available</option>
          <option value="1">Not Available</option>
        </select>
      </div>

      <div class="flex justify-end">
        <button
          type="submit"
          class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
        >
          Create Shelve
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useFirebaseDatabase } from "~/composables/useFirebaseDatabase";
import type Shelves from "~/interfaces/Shelves.interface";

// Khởi tạo đối tượng shelve với các giá trị mặc định
const { create } = useFirebaseDatabase();
const shelve = ref<Shelves>({
  shelveId: "",
  name: "",
  description: "",
  location: "",
  status: 0,
  createdAt: new Date().toISOString(),
});

const handleSubmit = async () => {
  try {
    // Tạo một shelveId mới
    const newShelveId = `SHEL_${Date.now()}`;
    shelve.value.shelveId = newShelveId;

    // Chuẩn hóa dữ liệu để không chứa giá trị undefined
    const preparedData: Partial<Shelves> = { ...shelve.value };
    Object.keys(preparedData).forEach((key) => {
      if (preparedData[key as keyof Shelves] === undefined) {
        // Nếu kiểu dữ liệu của thuộc tính không cho phép null,
        // có thể gán giá trị mặc định hoặc bỏ qua
        preparedData[key as keyof Shelves] = shelve.value[
          key as keyof Shelves
        ] as Shelves[keyof Shelves];
      }
    });

    // Tạo shelve trong cơ sở dữ liệu
    const createResult = await create(
      `shelves/${newShelveId}`,
      newShelveId,
      preparedData
    );
    if (createResult) {
      alert("Shelve created successfully!");
      // Xóa dữ liệu sau khi tạo thành công (tùy chọn)
      shelve.value = {
        shelveId: "",
        name: "",
        description: "",
        location: "",
        status: 0,
        createdAt: new Date().toISOString(),
      };
    } else {
      alert("Failed to create shelve.");
    }
  } catch (error) {
    console.error("Error creating shelve:", error);
    alert("An error occurred while creating the shelve.");
  }
};
</script>

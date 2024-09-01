<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4">
      {{ shelfId ? "Chỉnh sửa" : "Thêm" }} kệ hàng
    </h2>
    <form @submit.prevent="submitForm">
      <div class="relative z-0 w-full mb-5 group">
        <input
          v-model="form.name"
          type="text"
          id="name"
          autocomplete="false"
          class="block py-2.5 px-0 w-full text-sm text-black text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=""
          required
        />
        <label
          for="name"
          class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >Tên</label
        >
      </div>

      <div class="relative z-0 w-full mb-5 group">
        <input
          v-model="form.description"
          type="text"
          id="description"
          autocomplete="false"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
        />
        <label
          for="description"
          class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >Mô tả</label
        >
      </div>

      <div class="relative z-0 w-full mb-6 group">
        <select
          v-model="form.status"
          id="status"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          required
        >
          <option value="0"> Hoạt động </option>
          <option value="1"> Không hoạt động </option>
          <option value="2"> Đầy </option>
        </select>
        <label
          for="status"
          class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >Trạng thái</label
        >
      </div>
      <div class="flex items-center justify-center">
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Xác nhận
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
// Define middleware
definePageMeta({
    middleware: 'auth'
});

import { reactive } from "vue";
import { v4 as uuidv4 } from "uuid";
import { useFirebaseDatabase } from "~/composables/useFirebaseDatabase";
import { getCurrentUser } from "~/utils/index";
import type Shelves from "~/interfaces/Shelves.interface";

const { $toast } = useNuxtApp();
const { create, getAndListen, updateData } = useFirebaseDatabase();
const route = useRoute();

// Declare state
const shelfId = ref<string>("");
const shelf = ref<Shelves | null>(null);

const form = reactive<Shelves>({
  id: "",
  name: "",
  description: "",
  status: 0,
});

// Function to fetch data and populate the form
const populateForm = (data: Shelves | null) => {
  if (data) {
    Object.assign(form, data);
  }
};

onMounted(async () => {
  if (route.params.id && route.params.id !== "create") {
    shelfId.value = route.params.id as string;
  }

  // Case edit shelf
  if (shelfId.value) {
    // fetch current shelf value
    getAndListen<Shelves>(`stockCheck/shelves/data/${shelfId.value}`, (fetchedData) => {
      shelf.value = fetchedData;
      populateForm(fetchedData);
    });
  }
});

// Function to handle form submission
const submitForm = async () => {
  const id = shelfId.value ? shelfId.value : `SHEL_${uuidv4()}`; // Generate UUID
  const currentUser = getCurrentUser();

  let newShelf: Shelves = {
    id: id,
    name: form.name,
    description: form.description,
    status: form.status,
    createdAt: shelf.value
      ? shelf.value?.createdAt
      : currentUnixTimestamp(),
    createdBy: shelf.value ? shelf.value?.createdBy : currentUser?.id,
    updatedAt: currentUnixTimestamp(),
    updatedBy: currentUser?.id,
  };

  // Create/update shelf
  let result: boolean = false;
  if (shelf.value) {
    result = await updateData(`stockCheck/shelves/data/${id}`, newShelf);
  } else {
    result = await create(`stockCheck/shelves/data/${id}`, newShelf);
  }
  if (result) {
    let resultMessage = shelfId.value ? "Chỉnh sửa" : "Tạo mới";
    $toast.success(`${resultMessage} kệ hàng thành công!`);
    navigateTo("/shelves");
  }
};
</script>

<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4">
      {{ categoryId ? "Edit" : "create" }} Category
    </h2>
    <form @submit.prevent="submitForm">
      <div class="relative z-0 w-full mb-5 group">
        <input
          v-model="categoryId"
          type="text"
          id="id"
          autocomplete="false"
          class="block py-2.5 px-0 w-full text-sm text-black text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=""
          :readonly="!!categoryId" 
          :disabled="!!create"
        />
        <label
          for="id"
          class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >ID</label
        >
      </div>

      <div class="relative z-0 w-full mb-5 group">
        <input
          v-model="form.name"
          type="text"
          id="name"
          autocomplete="false"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
        />
        <label
          for="name"
          class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >Name</label
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
          class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >Description</label
        >
      </div>

      <div class="relative z-0 w-full mb-5 group">
        <input
          v-model="form.createdBy"
          type="text"
          id="createdBy"
          autocomplete="false"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
          readonly
        />
        <label
          for="createdBy"
          class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >Created By</label
        >
      </div>
      
      <div class="relative z-0 w-full mb-5 group">
        <select
          v-model="form.status"
          id="status"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          required
        >
          <option :value="CategoryStatus.ACTIVE">Active</option>
          <option :value="CategoryStatus.DISABLE">Disabled</option>
          <option :value="CategoryStatus.PAUSE">Paused</option>
        </select>
        <label
          for="status"
          class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >Status</label
        >
      </div>

      <div class="flex items-center justify-center">
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Xác Nhận
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

import { reactive, ref, onMounted } from "vue";
import { v4 as uuidv4 } from "uuid";
import type Category from "~/interfaces/Category.interface";
import { useFirebaseDatabase } from "~/composables/useFirebaseDatabase";
import { getCurrentUser, currentUnixTimestamp } from "~/utils/index";
import { CategoryStatus } from "~/interfaces/Category.interface";
import database from "~/server/api/database";
// import Id from "../employee/[id].vue";

const { $toast } = useNuxtApp();
const { create, getAndListen, updateData } = useFirebaseDatabase();
const route = useRoute();

// Declare state
const categoryId = ref<string>("");
const category = ref<Category | null>(null);
const form = reactive<Category>({
  id:"", 
  name: "",
  status: CategoryStatus.ACTIVE, 
  description: "",
  createdAt: currentUnixTimestamp(), 
  updatedAt: currentUnixTimestamp(), 
  createdBy: getCurrentUser()?.id || "",
  updatedBy: getCurrentUser()?.id || "",
});

// Function to fetch data and populate the form
const populateForm = (data: Category | null) => {
  if (data) {
    form.id = data.id;
    Object.assign(form, data);
  }
};

onMounted(async () => {
  if (route.params.id && route.params.id !== "create") {
    categoryId.value = route.params.id as string;
    console.log(categoryId.value);
  }
  if (categoryId.value) {
    getAndListen<Category>(`stockCheck/categories/data/${categoryId.value}`, (fetchedData) => {
      category.value = fetchedData;
      console.log(category.value);
      populateForm(fetchedData);
    });
  }
  console.log(`Fetching data from path: categories/data/${categoryId.value}`);

});

// Function to handle form submission
const submitForm = async () => {
  const id = categoryId.value ? categoryId.value : `CATE_${uuidv4()}`;
  form.id = id; 
  form.updatedAt = currentUnixTimestamp();
  form.updatedBy = getCurrentUser()?.id || "";

  let newCategory: Category = {
    id: id,
    name: form.name,
    description: form.description, // Added description field
    status: form.status, // Added status field
    createdAt: category.value
      ? category.value?.createdAt
      : currentUnixTimestamp(),
    createdBy: category.value ? category.value?.createdBy : getCurrentUser()?.id,
    updatedAt: currentUnixTimestamp(),
    updatedBy: getCurrentUser()?.id,
  };
  let result = false;
  if (categoryId.value) {
    result = await updateData(`stockCheck/categories/data/${id}`, newCategory);
  } else {
    form.createdAt = currentUnixTimestamp();
    form.createdBy = getCurrentUser()?.id || "";
    result = await create(`stockCheck/categories/data/${id}`, newCategory);
  }

  if (result) {
    let resultMessage = categoryId.value ? "Chỉnh sửa" : "Tạo mới";
    $toast.success(`${resultMessage}  thành công!`);
    navigateTo("/category");
  }
};
</script>

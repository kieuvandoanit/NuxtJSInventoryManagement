<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4">
      {{ cycleId ? "Chỉnh sửa" : "Tạo mới" }} chiến dịch
    </h2>
    <form @submit.prevent="submitForm">
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
          >Tên chiến dịch</label
        >
      </div>

      <div class="relative z-0 w-full mb-5 group">
        <select
          v-model="form.status"
          id="status"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          required
        >
          <option :value="CycleStatus.ENABLE">Hoạt động</option>
          <option :value="CycleStatus.DISABLE">Không hoạt động</option>
        </select>
        <label
          for="status"
          class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >Trạng Thái</label
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
import { useFirebaseDatabase } from "~/composables/useFirebaseDatabase";
import { getCurrentUser, currentUnixTimestamp } from "~/utils/index";
import { InventoryStatus } from "~/interfaces/InventoryCheck.interface";
import { CycleStatus } from "~/interfaces/Cycle.interface";
import type Cycle from "~/interfaces/Cycle.interface";

const { $toast } = useNuxtApp();
const { create, getAndListen, updateData } = useFirebaseDatabase();
const route = useRoute();

// Declare state
const cycleId = ref<string>("");
const cycle = ref<Cycle | null>(null);
const form = reactive<Cycle>({
  id:"", 
  name: "",
  status: CycleStatus.ENABLE,
  createdAt: currentUnixTimestamp(), 
  updatedAt: currentUnixTimestamp(), 
  createdBy:  "",
  updatedBy: getCurrentUser()?.id || "",
});

var inventoryCheckData : any = undefined;

// Function to fetch data and populate the form
const populateForm = (data: Cycle | null) => {
  if (data) {
    form.id = data.id;
    Object.assign(form, data);
  }
};

onMounted(async () => {
  if (route.params.id && route.params.id !== "create") {
    cycleId.value = route.params.id as string;
  }
  if (cycleId.value) {
    getAndListen<Cycle>(`stockCheck/cycles/data/${cycleId.value}`, (fetchedData) => {
      cycle.value = fetchedData;
      populateForm(fetchedData);
    });

    getAndListen<Cycle>(`stockCheck/inventoryCheck/data/${cycleId.value}`, (fetchedData) => {
      inventoryCheckData = fetchedData;
    });
  }
});

// Function to handle form submission
const submitForm = async () => {
  const id = cycleId.value ? cycleId.value : `CYCL_${uuidv4()}`;
  form.id = id;

  let newCycle: Cycle = {
    id: id,
    name: form.name,
    status: form.status, // Added status field
    createdAt: cycle.value
      ? cycle.value?.createdAt
      : currentUnixTimestamp(),
    createdBy: cycle.value ? cycle.value?.createdBy : getCurrentUser()?.id,
    updatedAt: currentUnixTimestamp(),
    updatedBy: getCurrentUser()?.id,
  };

  let result = false;

  if (cycleId.value) {
    result = await updateData(`stockCheck/cycles/data/${id}`, newCycle);

    // Update in inventoryCheck
    if (inventoryCheckData) {
      inventoryCheckData.name = form.name;
      await updateData(`stockCheck/inventoryCheck/data/${id}`, inventoryCheckData);
    }


  } else {
    result = await create(`stockCheck/cycles/data/${id}`, newCycle);
  }

  if (result) {
    let resultMessage = cycleId.value ? "Chỉnh sửa" : "Tạo mới";
    $toast.success(`${resultMessage} chiến dịch thành công!`);
    navigateTo("/cycles");
  }
};
</script>

<template>
  <div class="relative shadow rounded overflow-hidden">
    <div
      class="flex items-center justify-between flex-column flex-wrap space-y-4 py-4 bg-white bg-white-900"
    >
      <div class="relative ml-2">
        <div
          class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none"
        >
          <svg
            class="w-4 h-4 text-white-500 text-white-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="text"
          id="table-search-users"
          class="block pb-2 pt-2 ps-10 text-sm border rounded-lg w-80 bg-white-50 border-white-600 focus:border-blue-500"
          autocomplete="off"
          placeholder="Tìm kiếm nhân viên"
        />
      </div>
      <div>
        <NuxtLink
          to="/employee/create"
          class="border item-center p-2 rounded-lg mr-2 bg-emerald-500 text-white hover:bg-emerald-700"
        >
          Thêm nhân viên
        </NuxtLink>
      </div>
    </div>
    <table class="w-full text-sm text-left rtl:text-right text-white-500">
      <thead class="text-xs text-white-700 uppercase bg-white">
        <tr>
          <th scope="col" class="px-6 py-3">Tên</th>
          <th scope="col" class="px-6 py-3">Số điện thoại</th>
          <th scope="col" class="px-6 py-3">Email</th>
          <th scope="col" class="px-6 py-3">Vị trí</th>
          <th scope="col" class="px-6 py-3">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in employeesList"
          :key="item.id"
          class="bg-white border-b bg-white-800 border-white-700 hover:bg-gray-100"
        >
          <th
            scope="row"
            class="flex items-center px-6 py-4 whitespace-nowrap text-black"
          >
            <img
              class="w-10 h-10 rounded-full"
              :src="item.avatar"
              alt="Avatar"
            />
            <div class="ps-3">
              <div class="text-base font-semibold">
                {{ `${item.firstName} ${item.lastName}` }}
              </div>
              <div class="font-normal text-white-500">{{ item.loginCode }}</div>
            </div>
          </th>
          <td class="px-6 py-4">
            {{ item.phone }}
          </td>
          <td class="px-6 py-4">
            <div class="flex items-center">
              {{ item.email }}
            </div>
          </td>
          <td class="px-6 py-4">
            <div class="flex items-center">
              {{ item.position }}
            </div>
          </td>
          <td class="px-6 py-4">
            <NuxtLink
              :to="`/employee/${item.id}`"
              type="button"
              class="font-medium text-blue-600 text-blue-500 hover:underline"
            >
              Sửa
            </NuxtLink>
            <span class="mx-1">|</span>
            <span
              type="button"
              class="font-medium text-red-600 text-red-500 hover:underline"
              @click="deleteUser(item.id)"
            >
              Xóa
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <UiPagination
      :loading="loading"
      :hasMore="hasMore"
      :currentPage="currentPage"
      @next-page="handleNextPage"
      @previous-page="handlePreviousPage"
    />
  </div>
</template>
<script lang="ts" setup>
// Define middleware
definePageMeta({
    middleware: 'auth'
});

import { ref } from "vue";
import { useFirebaseDatabase  } from "~/composables/useFirebaseDatabase";
import type Employee from "~/interfaces/Employee.interface";

const { getItemsForPage, deleteData } = useFirebaseDatabase();

// Declare state
const employeesList = ref<Employee[]>([]);
const loading = ref(false);
const pageLimit = 5;
const currentPage = ref(1);

let nextPageKey: string | number | null | undefined = null;
let firstKeys: number[] = []; // To track keys for each page
const hasMore = ref(true);

// Fetch item for the current page
const fetchItemForTheCurrentPage = async () => {
  loading.value = true;
  try {
    const { items, nextPageKey: newKey } = await getItemsForPage<Employee>(
      "stockCheck/employees/data",
      "createdAt",
      pageLimit,
      nextPageKey
    );

    employeesList.value = items;
    nextPageKey = newKey;

    // Update the first keys for previous navigation
    if (currentPage.value > firstKeys.length) {
      firstKeys.push(items[items.length - 1]?.createdAt || 0);
    }

    // Check if there's more data
    hasMore.value = newKey ? true : false;
  } catch (error) {
    console.error("Error fetching items for page:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchItemForTheCurrentPage();
});

const handleNextPage = async () => {
  if (!hasMore.value) return;

  currentPage.value += 1;
  await fetchItemForTheCurrentPage();
};

const handlePreviousPage = async () => {
  if (currentPage.value === 1) return;

  currentPage.value -= 1;
  nextPageKey = firstKeys[currentPage.value - 2] || null;
  await fetchItemForTheCurrentPage();
};

const deleteUser = async (userId: string|undefined) => {
  if (userId) {
    await deleteData(`stockCheck/employees/data/${userId}`);
    await fetchItemForTheCurrentPage();
  }
}
</script>

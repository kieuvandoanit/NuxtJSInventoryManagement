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
          placeholder="Search for users"
        />
      </div>
      <div>
        <NuxtLink
          to="/employee/create"
          class="border item-center p-2 rounded-lg mr-2 bg-emerald-500 text-white hover:bg-emerald-700"
        >
          Create User
        </NuxtLink>
      </div>
    </div>
    <table class="w-full text-sm text-left rtl:text-right text-white-500">
      <thead class="text-xs text-white-700 uppercase bg-white">
        <tr>
          <th scope="col" class="px-6 py-3">Name</th>
          <th scope="col" class="px-6 py-3">Position</th>
          <th scope="col" class="px-6 py-3">Status</th>
          <th scope="col" class="px-6 py-3">Action</th>
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
              src="/public/avatar_1.jpg"
              alt="Jese image"
            />
            <div class="ps-3">
              <div class="text-base font-semibold">
                {{ `${item.firstName} ${item.lastName}` }}
              </div>
              <div class="font-normal text-white-500">{{ item.email }}</div>
            </div>
          </th>
          <td class="px-6 py-4">
            {{ getEnumKeyByValue(EmployeeRole, item.role) }}
          </td>
          <td class="px-6 py-4">
            <div class="flex items-center">
              <div class="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>
              {{ getEnumKeyByValue(EmployeeStatus, item.status) }}
            </div>
          </td>
          <td class="px-6 py-4">
            <NuxtLink
              :to="`/employee/${item.id}`"
              type="button"
              class="font-medium text-blue-600 text-blue-500 hover:underline"
            >
              Edit Employee
            </NuxtLink>
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
import { ref } from "vue";
import { useFirebaseDatabase } from "~/composables/useFirebaseDatabase";
import type Employee from "~/interfaces/Employee.interface";
import { EmployeeRole, EmployeeStatus } from "~/interfaces/Employee.interface";

const { getItemsForPage } = useFirebaseDatabase();

// Declare state
const employeesList = ref<Employee[]>([]);
const loading = ref(false);
const pageLimit = 3;
const currentPage = ref(1);

let lastKey: string | number | null | undefined = null;
let firstKeys: number[] = []; // To track keys for each page
const hasMore = ref(true);

// Fetch item for the current page
const fetchItemForTheCurrentPage = async () => {
  loading.value = true;
  try {
    const { items, lastKey: newLastKey } = await getItemsForPage<Employee>(
      "employees",
      "createdAt",
      pageLimit,
      lastKey
    );

    employeesList.value = items;
    lastKey = newLastKey;

    // Update the first keys for previous navigation
    if (currentPage.value > firstKeys.length) {
      firstKeys.push(items[items.length - 1]?.createdAt || 0);
    }

    // Check if there's more data
    hasMore.value = items.length === pageLimit;
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
  lastKey = firstKeys[currentPage.value - 2] || null;
  await fetchItemForTheCurrentPage();
};
</script>

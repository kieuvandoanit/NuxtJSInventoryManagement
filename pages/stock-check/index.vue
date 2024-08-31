<template>
  <div class="relative shadow rounded overflow-hidden">
    <table class="w-full text-sm text-left rtl:text-right text-white-500">
      <thead class="text-xs text-white-700 uppercase bg-white">
        <tr>
          <th scope="col" class="px-6 py-3 w-[400px]"> Name </th>
          <th scope="col" class="px-6 py-3 text-center"> Progress </th>
          <th scope="col" class="px-6 py-3"> Employees </th>
          <th scope="col" class="px-6 py-3"> Action </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in stockCheckList"
          :key="item.id"
          class="bg-white border-b bg-white-800 border-white-700 hover:bg-gray-100"
        >
          <th scope="row" class="flex items-center px-6 py-4 whitespace-nowrap text-black">
            <div class="font-normal text-white-500">
              {{ item.name }}
            </div>
          </th>
          <td class="px-6 py-4"> 
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-blue-500 rounded-full h-2" :style="`width: ${item.status}%;`"></div>
              <div class="text-center">{{ item.status }}%</div>
            </div>  
          </td>
          <td class="px-6 py-4">
            <div class="flex items-center">
              <span> {{ getEmployee(item.id) }} </span>
            </div>
          </td>
          <td class="px-6 py-4">
            <NuxtLink to="/stock-check/123" type="button"
              class="font-medium text-blue-600 text-blue-500 hover:underline"
            >
              Detail
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
import { ref } from 'vue';
import { ref as firebaseRef, onValue, query, orderByChild, startAfter, limitToFirst } from "firebase/database";
import type StockChecks from '~/interfaces/StockCheck.interface';
import { useFirebaseDatabase } from '~/composables/useFirebaseDatabase';
import type Employee from '~/interfaces/Employee.interface';
import type Product from '~/interfaces/Product.interface';
import { extractUniqueValueFromKey } from '~/utils/index';

const { getObjectsByIds } = useFirebaseDatabase();

const stockCheckList = ref<StockChecks[]>([]);
const employeeList = ref<Employee[]>([]);
const productList = ref<Product[]>([]);
const loading = ref<boolean>(false);
const hasMore = ref<boolean>(false);
const currentPage = ref<number>(1);
const pageLimit: number = 1;

let lastKey: string | number | null | undefined = null;
let firstKeys: number[]  = []; // To track keys for each page

const { $firebaseDB }: any = useNuxtApp();

onMounted( async () => {
  await getStockCheckList();
});

function getEmployee(stockCheckId: string | undefined) {
  let stockCheckData = stockCheckList.value.find((item) => {
    return item.id === stockCheckId;
  });

  let employeeID = extractUniqueValueFromKey(stockCheckData, 'employee');
  
  let employees = employeeList.value.filter((item) => {
    if (item?.id) {
      return employeeID.includes(item?.id);
    }
    return false;
  });

  return employees.map(item => item.lastName).join(', ');
}

const handleNextPage = async () => {
  if (!hasMore.value) return;

  loading.value = true;

  await getStockCheckList(lastKey);
  
  currentPage.value += 1;

  loading.value = false;
}

const handlePreviousPage = async () => {
  if (currentPage.value === 1) return;

  currentPage.value -= 1;

  lastKey = firstKeys[currentPage.value - 2] || null;
  await getStockCheckList(lastKey);
}

// Get stockCheck data with pagination
const getStockCheckList = async (startAfterValue: string | number | null = null) : Promise<any> => {
  const dbRef = firebaseRef($firebaseDB, '/inventoryChecks');
  const orderByField: keyof StockChecks = 'createdAt';

  let queryConstraints: any[] = [
    orderByChild(orderByField),
    limitToFirst(pageLimit)
  ];

  if (startAfterValue) {
    queryConstraints.push(startAfter(startAfterValue));
  }

  const queryDb = await query(dbRef, ...queryConstraints);

  try {
    onValue(queryDb, async (snapshot) => {
      const data: StockChecks[] = snapshot.val();

      if (data) {
        stockCheckList.value = Object.keys(data)
          .map((key: any) => ({ ...data[key] }))
          .sort((a, b) => {
            if (a[orderByField] && b[orderByField]) {
              return a[orderByField] > b[orderByField] ? 1 : -1;
            } else {
              return 0;
            }
          });

        const productIDs = extractUniqueValueFromKey(stockCheckList.value, 'product');
        const employeeIDs = extractUniqueValueFromKey(stockCheckList.value, 'employee');

        // Fetch all product and employee data
        productList.value = await getObjectsByIds('products', productIDs);
        employeeList.value = await getObjectsByIds('employees', employeeIDs);

        lastKey = stockCheckList.value.length > 0 ? stockCheckList.value[stockCheckList.value.length - 1][orderByField] : null;

        // Update the first keys for previous navigation
        if (currentPage.value > firstKeys.length) {
          firstKeys.push(lastKey || 0);
        }

        // Check has more page
        hasMore.value = stockCheckList.value.length === pageLimit;
      } else {
        hasMore.value = false;
      }
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

</script>

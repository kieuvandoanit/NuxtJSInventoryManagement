<template>
  <div class="relative shadow rounded overflow-hidden">
    <table class="w-full text-sm text-left rtl:text-right text-white-500">
      <thead class="text-xs text-white-700 uppercase bg-white">
        <tr>
          <th scope="col" class="px-6 py-3 w-[300px] text-center"> Chiến dịch </th>
          <th scope="col" class="px-6 py-3 w-[600px] text-center">Tiến độ</th>
          <th scope="col" class="px-6 py-3 w-[200px] text-center"> Trạng thái </th>
          <th scope="col" class="px-6 py-3 w-[200px] text-center"> Hành động </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in inventoryCheckList"
          :key="item.id"
          class="bg-white border-b bg-white-800 border-white-700 hover:bg-gray-100"
        >
          <td scope="row" class="flex items-center justify-center px-6 py-4 whitespace-nowrap text-black">
            <div class="font-normal text-white-500">
              {{ item.name }}
            </div>
          </td>
          <td class="">
            <div class='w-full  bg-gray-100 rounded-3xl h-3.5 '>
              <div class='bg-indigo-600 h-3.5 rounded-3xl text-xs text-white text-center'
                role='progressbar'
                aria-valuenow='50'
                aria-valuemin='0'
                aria-valuemax='100'
                :style="`width: ${item?.progress ? item?.progress : 0}%`">
                {{ item?.progress }}%
              </div>
            </div>
          </td>
          <td class="px-6 py-4 text-center">
            <span
              :class="{
                'text-green-500': item.status == 0,
                'text-red-500': item.status != 0,
              }"
            >
            {{ item.status == 0 ? "Hoạt động" : "Không hoạt động" }}
          </span>
          </td>
          <td class="px-6 py-4 text-center d-flex">
            <NuxtLink
              :to="`/stock-check/detail/${item.id}`"
              type="button"
              class="font-medium text-blue-600 text-blue-500 hover:underline"
            >
              Chi tiết
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
import { useFirebaseDatabase } from '~/composables/useFirebaseDatabase';
import type { InventoryCheck } from '~/interfaces';

const { getItemsForPage, getListProductWithConditionCreatedAt, deleteData } = useFirebaseDatabase();

const inventoryCheckList = ref<InventoryCheck[]>([]);
const loading = ref<boolean>(false);
const hasMore = ref<boolean>(false);
const currentPage = ref<number>(1);
const pageLimit: number = 5;

let nextPageKey: string | number | null | undefined = null;
let firstKeys: number[]  = []; // To track keys for each page

onMounted( async () => {
  await fetchItemForCurrentPage();
});

const fetchItemForCurrentPage = async () => {
  loading.value = true;
  try {
    const { items, nextPageKey: newKey } = await getItemsForPage<InventoryCheck>(
      "stockCheck/inventoryCheck/data",
      "createdAt",
      pageLimit,
      nextPageKey
    );

    inventoryCheckList.value = items;
    nextPageKey = newKey;

    // Update the first keys for previous navigation
    if (currentPage.value > firstKeys.length) {
      firstKeys.push(items[items.length - 1]?.createdAt || 0);
    }

    // Check if there's more data
    hasMore.value = newKey ? true : false;

    // Append progress status
    await appendProgressStatus();
  } catch (error) {
    console.error("Error fetching items for page:", error);
  } finally {
    loading.value = false;
  }
}

const handleNextPage = async () => {
  if (!hasMore.value) return;

  currentPage.value += 1;
  await fetchItemForCurrentPage();
};

const handlePreviousPage = async () => {
  if (currentPage.value === 1) return;

  currentPage.value -= 1;
  nextPageKey = firstKeys[currentPage.value - 2] || null;
  await fetchItemForCurrentPage();
};

const appendProgressStatus = async () => {
  await inventoryCheckList.value.forEach(async (campaignStockCheck) => {
    let updatedTime = campaignStockCheck.updatedAt;
  
    // count list product with condition createdAt <= updatedTime
    let listProducts: any = await getListProductWithConditionCreatedAt(updatedTime);
    let filteredProducts = Object.fromEntries(
      Object.entries(listProducts).filter(([key, value]) => value.quantity > 0)
    );
    let listProductWithQuantityZero = Object.fromEntries(
      Object.entries(listProducts).filter(([key, value]) => value.quantity == 0)
    );
    let listProductLength = Object.keys(filteredProducts ?? {}).length;

    // count list scanned
    let campaignStockCheckTemp: any = campaignStockCheck.data;
    let filteredScanProducts = Object.fromEntries(
      Object.entries(campaignStockCheckTemp).filter(([key, value]) => {
        return !Object.keys(listProductWithQuantityZero).includes(value.productId);
      })
    );

    let scannedLength = Object.keys(filteredScanProducts ?? {}).length;
    campaignStockCheck.progress = +((scannedLength / listProductLength) * 100).toFixed(0)
  });
}
</script>

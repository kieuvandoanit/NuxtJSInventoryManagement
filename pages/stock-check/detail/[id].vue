<template>
  <div class="relative shadow rounded overflow-hidden">

    <div class='w-full bg-gray-100 my-3'>
      <p class="px-6 py-4 font-bold">Tiến trình</p>
      <div :style="`width: 95%; margin: 0px auto;`">
        <div class='bg-indigo-600 h-[25px] rounded-3xl text-xs text-white flex items-center justify-center transition-all duration-500 ease-in-out'
          role='progressbar'
          aria-valuenow='50'
          aria-valuemin='0'
          aria-valuemax='100'
          :style="`width: ${getProgressStatus}%;`">
          {{ getProgressStatus }}%
        </div>
      </div>
    </div>
    <table class="w-full text-sm text-left rtl:text-right text-white-500">
      <thead class="text-xs text-white-700 uppercase bg-white">
        <tr>
          <th scope="col" class="px-6 py-3 text-center"> Thời gian </th>
          <th scope="col" class="px-6 py-3 text-center"> Mã sản phẩm </th>
          <th scope="col" class="px-6 py-3 text-center"> Tên sản phẩm </th>
          <th scope="col" class="px-6 py-3 text-center"> Thông tin </th>
          <th scope="col" class="px-6 py-3 text-center"> Kệ </th>
          <th scope="col" class="px-6 py-3 text-center"> Nhân viên </th>
          <th scope="col" class="px-6 py-3 text-center"> Số lượng thực tế </th>
          <th scope="col" class="px-6 py-3 text-center"> Số lượng </th>
          <th scope="col" class="px-6 py-3 text-center"> Trạng thái </th>
          <th scope="col" class="px-6 py-3 text-center"> Hành động </th>
        </tr>
      </thead>
      <tbody>
        <ScanRow
          v-for="item in scanCheckList"
          :key="item.id"
          :cycleId="inventoryCheckId"
          :scanCheck="item"
        />
      </tbody>
    </table>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type ScanCheck from '~/interfaces/InventoryCheck.interface';
import type { InventoryCheck } from '~/interfaces/InventoryCheck.interface';
import { useFirebaseDatabase } from "~/composables/useFirebaseDatabase";
import ScanRow from "../components/scanRow.vue";

const { getAndListen, getListProductWithConditionCreatedAt } = useFirebaseDatabase();

const inventoryCheck = ref<InventoryCheck | null>();
const route = useRoute();
const inventoryCheckId = ref<string>("");
let listProductNow = ref<any>();
const createdAtCycle = ref<number | undefined>(currentUnixTimestamp());

onMounted(async () => {
  if (route.params.id) {
    inventoryCheckId.value = route.params.id as string;
  }

  // get data
  await getAndListen<InventoryCheck>(
    `stockCheck/inventoryCheck/data/${inventoryCheckId.value}`,
    async (fetchedData) => {
      inventoryCheck.value = fetchedData;
      createdAtCycle.value = fetchedData?.createdAt;
      listProductNow.value = await getListProductWithConditionCreatedAt(createdAtCycle.value ?? currentUnixTimestamp());
    }
  )

  // progressStatus.value = await getProgressStatus.value;
});

const scanCheckList: ComputedRef<ScanCheck[]> = computed(() => {
  let rootData = inventoryCheck.value
  if ( rootData && rootData.data) {
    const checks = Object.values(rootData.data).flatMap(inventoryCheckData => {
      return inventoryCheckData;
    });
    return checks as ScanCheck[];
  }
  return [];
});

const getProgressStatus: ComputedRef<number> = computed(() => {
  if (listProductNow.value) {
    let filteredProducts = Object.fromEntries(
      Object.entries(listProductNow.value).filter(([key, value]) => value.quantity > 0)
    );
    let listProductWithQuantityZero = Object.fromEntries(
      Object.entries(listProductNow.value).filter(([key, value]) => value.quantity == 0)
    );
    let listProductLength = Object.keys(filteredProducts ?? {}).length;

    // count list scanned
    let campaignStockCheckTemp: any = inventoryCheck.value?.data;
    let filteredScanProducts = Object.fromEntries(
      Object.entries(campaignStockCheckTemp).filter(([key, value]) => {
        return !Object.keys(listProductWithQuantityZero).includes(value.productId);
      })
    );

    let scannedLength = Object.keys(filteredScanProducts ?? {}).length;
    return +((scannedLength / listProductLength) * 100).toFixed(0)
  } else {
    return 0;
  }
  
})
</script>

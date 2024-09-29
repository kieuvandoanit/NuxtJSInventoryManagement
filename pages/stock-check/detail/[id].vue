<template>
  <div class="relative shadow rounded overflow-hidden">
    <table class="w-full text-sm text-left rtl:text-right text-white-500">
      <thead class="text-xs text-white-700 uppercase bg-white">
        <tr>
          <th scope="col" class="px-6 py-3 text-center"> Thời gian </th>
          <th scope="col" class="px-6 py-3 text-center"> Mã sản phẩm </th>
          <th scope="col" class="px-6 py-3 text-center"> Tên sản phẩm </th>
          <th scope="col" class="px-6 py-3 text-center"> Kệ </th>
          <th scope="col" class="px-6 py-3 text-center"> Nhân viên </th>
          <th scope="col" class="px-6 py-3 text-center"> Số lượng thực tế </th>
          <th scope="col" class="px-6 py-3 text-center"> Số lượng </th>
          <th scope="col" class="px-6 py-3 text-center"> Trạng thái </th>
        </tr>
      </thead>
      <tbody>
        <ScanRow
          v-for="item in scanCheckList"
          :key="item.id"
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

const { getAndListen } = useFirebaseDatabase();

const inventoryCheck = ref<InventoryCheck | null>();
const route = useRoute();
const inventoryCheckId = ref<string>("");

onMounted(async () => {
  if (route.params.id) {
    inventoryCheckId.value = route.params.id as string;
  }

  // get data
  getAndListen<InventoryCheck>(
    `stockCheck/inventoryCheck/data/${inventoryCheckId.value}`,
    (fetchedData) => {
      inventoryCheck.value = fetchedData;
    }
  )
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
</script>

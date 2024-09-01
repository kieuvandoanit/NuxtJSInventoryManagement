<template>
  <tr
    class="bg-white border-b bg-white-800 border-white-700 hover:bg-gray-100"
  >
    <th scope="row" class="flex items-center px-6 py-4 whitespace-nowrap text-black">
      <div class="font-normal text-white-500">
        {{ convertTimestampToDateTime(scanCheck.date) }}
      </div>
    </th>
    <td class="px-6 py-4"> 
      <div class="text-center">{{ scanCheck.productId }}</div>
    </td>
    <td class="px-6 py-4">
      <div class="flex items-center">
        {{ productData?.name }}
      </div>
    </td>
    <td class="px-6 py-4">
      <div class="text-center">{{ shelfData?.name }}</div>
    </td>
    <td class="px-6 py-4">
      <div class="text-center">{{ `${employeeData?.firstName} ${employeeData?.lastName}` }}</div>
    </td>
    <td class="px-6 py-4">
      <div class="text-center">{{ scanCheck.quantityConfirmed }}</div>
    </td>
    <td class="px-6 py-4">
      <div class="text-center">{{ productData?.quantity }}</div>
    </td>
    <td class="px-6 py-4 flex items-center">
      <div v-if="checkStatusIsCorrect">
        <div class="rounded-full px-[30px] py-[4px] text-center text-[12px] bg-green-700 font-bold text-white">Khớp</div>
      </div>
      <div v-else><div class="rounded-full px-[10px] py-[4px] text-center text-[12px] bg-red-700 font-bold text-white">Không khớp</div></div>
    </td>
  </tr>
</template>
<script lang="ts" setup>
import type ScanCheck from '~/interfaces/InventoryCheck.interface';
import { useFirebaseDatabase } from "~/composables/useFirebaseDatabase";
import type Employee from '~/interfaces/Employee.interface';
import type Shelves from '~/interfaces/Shelves.interface';
import type Product from '~/interfaces/Product.interface';

const { getOnce } = useFirebaseDatabase();

const props = defineProps<{
  scanCheck: ScanCheck
}>();
const employeeData = ref<Employee | null>(null);
const shelfData = ref<Shelves | null>(null);
const productData = ref<Product | null>(null);

onMounted( async () => {
  employeeData.value = await employee.value;
  shelfData.value = await shelf.value;
  productData.value = await product.value;
})

// Get employee
const employee: ComputedRef<Promise<Employee | null>> = computed(async () => {
  return await getOnce<Employee>(`stockCheck/employees/data/${props.scanCheck.employeeId}`);
})
// Get shelf
const shelf: ComputedRef<Promise<Shelves | null>> = computed(async () => {
  return await getOnce<Shelves>(`stockCheck/shelves/data/${props.scanCheck.shelfId}`);
}) 

// Get product
const product: ComputedRef<Promise<Product | null>> = computed(async () => {
  return await getOnce<Product>(`stockCheck/products/data/${props.scanCheck.productId}`);
})

// Check status of product
const checkStatusIsCorrect: ComputedRef<Boolean> = computed(() => {
  let result: Boolean = false;
  if (props.scanCheck.quantityConfirmed == productData.value?.quantity) {
    result = true;
  }

  return result;
});
</script>

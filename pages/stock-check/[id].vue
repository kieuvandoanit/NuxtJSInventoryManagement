<template>
  <div class="relative shadow rounded overflow-hidden">
    <table class="w-full text-sm text-left rtl:text-right text-white-500">
      <thead class="text-xs text-white-700 uppercase bg-white">
        <tr>
          <th scope="col" class="px-6 py-3"> Date Time </th>
          <th scope="col" class="px-6 py-3 text-center"> Product ID </th>
          <th scope="col" class="px-6 py-3"> Product Name </th>
          <th scope="col" class="px-6 py-3"> Scanned Quantity </th>
          <th scope="col" class="px-6 py-3"> Quantity (Wish Match) </th>
          <th scope="col" class="px-6 py-3"> Location </th>
          <th scope="col" class="px-6 py-3"> Employee </th>
          <th scope="col" class="px-6 py-3"> Status </th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="bg-white border-b bg-white-800 border-white-700 hover:bg-gray-100"
        >
          <th scope="row" class="flex items-center px-6 py-4 whitespace-nowrap text-black">
            <div class="font-normal text-white-500">
              2024/09/01 11:30:22
            </div>
          </th>
          <td class="px-6 py-4"> 
            <div class="text-center">PROD_0001, PROD_0002</div>
          </td>
          <td class="px-6 py-4">
            <div class="flex items-center">
              Tivi Samsung
            </div>
          </td>
          <td class="px-6 py-4">
            <div class="text-center">12</div>
          </td>
          <td class="px-6 py-4">
            <div class="text-center">15</div>
          </td>
          <td class="px-6 py-4">
            <div class="text-center">Shelf 1</div>
          </td>
          <td class="px-6 py-4">
            <div class="text-center">Đoàn, Toàn</div>
          </td>
          <td class="px-6 py-4 flex items-center">
            <div class="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>Inprogress
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type StockChecks from '~/interfaces/StockCheck.interface';

const stockCheck = ref<StockChecks>();

</script>
<style lang='' scoped>
</style>

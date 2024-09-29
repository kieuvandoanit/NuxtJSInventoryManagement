<template>
  <div v-if="!loading" class="container mx-auto p-4 bg-white">
    <!-- Create Button -->
    <div class="flex justify-end mb-4">
      <NuxtLink
        to="/products/create"
        class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
      >
        Thêm mới
      </NuxtLink>
    </div>

    <table class="w-full text-sm text-left rtl:text-right text-white-500">
      <thead class="text-xs text-white-700 uppercase bg-white">
        <tr>
          <th scope="col" class="px-6 py-3 w-[200px]">Tên</th>
          <th scope="col" class="px-6 py-3">Mô tả</th>
          <th scope="col" class="px-6 py-3">Số lượng</th>
          <th scope="col" class="px-6 py-3">Danh mục</th>
          <th scope="col" class="px-6 py-3">Kệ</th>
          <th scope="col" class="px-6 py-3">Trạng thái</th>
          <th scope="col" class="px-6 py-3">QR Code</th>
          <th scope="col" class="px-6 py-3">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in productList"
          :key="item.id"
          class="bg-white border-b bg-white-800 border-white-700 hover:bg-gray-100"
        >
          <th
            scope="row"
            class="flex items-center px-6 py-4 whitespace-nowrap text-black"
          >
            <img
              class="w-10 h-10 rounded-full"
              :src="item.image"
              alt="Avatar"
            />
            <div class="ps-3">
              <div class="text-base font-semibold">
                {{ item.name }}
              </div>
            </div>
          </th>
          <td class="px-6 py-4">
            {{ item.description }}
          </td>
          <td class="px-6 py-4">
            <div class="flex items-center">
              {{ item.quantity }}
            </div>
          </td>
          <td class="px-6 py-4">
            <div class="flex items-center">
              {{ getCategoryName(item.categoryId) }}
            </div>
          </td>
          <td class="px-6 py-4">
            <div class="flex items-center">
              {{ getShelfName(item.shelfId) }}
            </div>
          </td>
          <td class="px-6 py-4">
            <div v-if="item.status == productStatus.ENABLE">
              <div class="rounded-full px-[30px] py-[4px] text-center text-[12px] bg-green-700 font-bold text-white text-nowrap">Hoạt động</div>
            </div>
            <div v-else>
              <div class="rounded-full px-[10px] py-[4px] text-center text-[12px] bg-red-700 font-bold text-white">Lỗi</div>
            </div>
          </td>
          <td class="px-6 py-4">
            <div class="flex items-center" @click="openModal(item.id, item.name)">
              Hiển thị
            </div>
          </td>
          <td class="px-6 py-4">
            <NuxtLink
              :to="`/products/${item.id}`"
              type="button"
              class="font-medium text-blue-600 text-blue-500 hover:underline"
            >
              Sửa
            </NuxtLink>
            <span class="mx-1">|</span>
            <span
              type="button"
              class="font-medium text-red-600 text-red-500 hover:underline"
              @click="deleteProduct(item.id)"
            >
              Xóa
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Component -->
    <UiPagination
      :loading="loading"
      :hasMore="hasMore"
      :currentPage="currentPage"
      @next-page="handleNextPage"
      @previous-page="handlePreviousPage"
    />

    <!-- QRCodeModal component -->
    <UiQrCodeModal 
      v-if="isModalVisible"
      :showModal="isModalVisible"
      :id="selectedProductId"
      :name="selectedProductName"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useFirebaseDatabase } from "~/composables/useFirebaseDatabase";
import type Category from "~/interfaces/Category.interface";
import type Product from "~/interfaces/Product.interface";
import type Shelves from "~/interfaces/Shelves.interface";
import { ProductStatus } from "~/interfaces/Product.interface";

const { getItemsForPage, deleteData, getObjectsByIds } = useFirebaseDatabase();
const productStatus = ProductStatus;
const productList = ref<Product[]>([]);
const categoryList = ref<Category[]>([]);
const shelvesList = ref<Shelves[]>([]);
const loading = ref(false);
const pageLimit = 5;
const currentPage = ref(1);

// Qr Code modal
const isModalVisible = ref(false);
let selectedProductId = '';
let selectedProductName = '';

let nextPageKey: string | number | null | undefined = null;
let firstKeys: number[] = []; // To track keys for each page
const hasMore = ref(true);

// Fetch item for the current page
const fetchItemForTheCurrentPage = async () => {
  loading.value = true;
  try {
    const { items, nextPageKey: newKey } = await getItemsForPage<Product>(
      "stockCheck/products/data",
      "createdAt",
      pageLimit,
      nextPageKey
    );

    productList.value = items;
    nextPageKey = newKey;

    // Update the first keys for previous navigation
    if (currentPage.value > firstKeys.length) {
      firstKeys.push(items[items.length - 1]?.createdAt || 0);
    }

    // Check if there's more data
    hasMore.value = newKey ? true : false;

    // Fetch list category
    let categoryIds = items.map((item) => item.categoryId);
    categoryList.value = await getObjectsByIds<Category>(
      "stockCheck/categories/data",
      categoryIds
    );
    // Fetch list shelves
    let shelfIds = items.map((item) => item.shelfId);
    shelvesList.value = await getObjectsByIds<Shelves>(
      "stockCheck/shelves/data",
      shelfIds
    );
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

const deleteProduct = async (productId: string|undefined) => {
  if (productId) {
    await deleteData(`stockCheck/products/data/${productId}`);
    await fetchItemForTheCurrentPage();
  }
}

function getCategoryName(categoryId: string): string {
  const category = categoryList.value.find((cat) => cat.id === categoryId);
  return category ? category.name : 'Unknown';
}

function getShelfName(shelfId: string): string {
  const shelf = shelvesList.value.find((she) => she.id === shelfId);
  return shelf ? shelf.name : 'Unknown';
}

function openModal(productId: string, productName: string) {
  selectedProductId = productId;
  selectedProductName = productName;
  isModalVisible.value = true;
}
function closeModal() {
  isModalVisible.value = false;
}
</script>

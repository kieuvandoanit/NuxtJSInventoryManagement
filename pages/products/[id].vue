<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4">
      {{ productId ? "Chỉnh sửa" : "Thêm" }} sản phẩm
    </h2>
    <form @submit.prevent="submitForm">
      <div class="relative z-0 w-full mb-5 group">
        <input
          v-model="form.name"
          type="text"
          id="name"
          autocomplete="false"
          class="block py-2.5 px-0 w-full text-sm text-black text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=""
          required
        />
        <label
          for="name"
          class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >Tên</label
        >
      </div>

      <div class="relative z-0 w-full mb-5 group">
        <input
          v-model="form.description"
          type="text"
          id="description"
          autocomplete="false"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
        />
        <label
          for="description"
          class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >Mô tả</label
        >
      </div>

      <div class="relative z-0 w-full mb-5 group">
        <input
          v-model="form.note"
          type="text"
          id="note"
          autocomplete="false"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
        />
        <label
          for="note"
          class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >Ghi chú</label
        >
      </div>

      <div class="relative z-0 w-full mb-5 group">
        <input
          v-model="form.image"
          type="text"
          id="image"
          autocomplete="false"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
        />
        <label
          for="image"
          class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >Hình ảnh</label
        >
      </div>

      <div class="relative z-0 w-full mb-5 group">
        <input
          v-model="form.quantity"
          type="number"
          id="quantity"
          autocomplete="false"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
        />
        <label
          for="quantity"
          class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >Số lượng</label
        >
      </div>

      <div class="relative z-0 w-full mb-6 group">
        <select
          v-model ="form.status"
          id="status"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          required
        >
          <option value="0"> Hoạt động </option>
          <option value="1"> Lỗi </option>
        </select>
        <label
          for="status"
          class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >Trạng thái</label
        >
      </div>

      <div class="relative z-0 w-full mb-6 group">
        <select
          v-model="form.categoryId"
          id="category"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          required
        >
          <option
            v-for="category in categoryList"
            :key="category.id"
            :value="category.id"> {{ category.name }} </option>
        </select>
        <label
          for="category"
          class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >Danh mục</label
        >
      </div>

      <div class="relative z-0 w-full mb-6 group">
        <select
          v-model="form.shelfId"
          id="shelf"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          required
        >
          <option
            v-for="shelf in shelfList"
            :key="shelf.id"
            :value="shelf.id"
          > {{ shelf.name }} </option>
        </select>
        <label
          for="shelf"
          class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >Kệ hàng</label
        >
      </div>

      <div class="flex items-center justify-center">
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Xác nhận
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

import { reactive } from "vue";
import { v4 as uuidv4 } from "uuid";
import { useFirebaseDatabase } from "~/composables/useFirebaseDatabase";
import { getCurrentUser } from "~/utils/index";
import type Product from "~/interfaces/Product.interface";
import type Category from "~/interfaces/Category.interface";
import type Shelves from "~/interfaces/Shelves.interface";

const { $toast } = useNuxtApp();
const { create, getAndListen, updateData, getOnce } = useFirebaseDatabase();
const route = useRoute();

// Declare state
const productId = ref<string>("");
const product = ref<Product | null>(null);

const categoryList = ref<Category[] | null>(null);
const shelfList = ref<Shelves[] | null>(null);

const form = reactive<Product>({
  id: "",
  name: "",
  description: "",
  note: "",
  image: "",
  quantity: 0,
  status: 0,
  categoryId: "",
  shelfId: "",
});

// Function to fetch data and populate the form
const populateForm = (data: Product | null) => {
  if (data) {
    Object.assign(form, data);
  }
};

onMounted(async () => {
  if (route.params.id && route.params.id !== "create") {
    productId.value = route.params.id as string;
  }

  // Case edit product
  if (productId.value) {
    // fetch current product value
    getAndListen<Product>(`stockCheck/products/data/${productId.value}`, (fetchedData) => {
      product.value = fetchedData;
      populateForm(fetchedData);
    });
  }

  await getListCategory();
  await getListShelves();
});

// Function to handle form submission
const submitForm = async () => {
  const id = productId.value ? productId.value : `PROD_${uuidv4()}`; // Generate UUID
  const currentUser = getCurrentUser();

  let newProduct: Product = {
    id: id,
    name: form.name,
    description: form.description,
    note: form.note,
    quantity: form.quantity,
    shelfId: form.shelfId,
    categoryId: form.categoryId,
    image: form.image,
    status: form.status,
    createdAt: product.value
      ? product.value?.createdAt
      : currentUnixTimestamp(),
    createdBy: product.value ? product.value?.createdBy : currentUser?.id,
    updatedAt: currentUnixTimestamp(),
    updatedBy: currentUser?.id,
  };

  // Create/update product
  let result: boolean = false;
  if (productId.value) {
    result = await updateData(`stockCheck/products/data/${id}`, newProduct);
  } else {
    result = await create(`stockCheck/products/data/${id}`, newProduct);
  }
  if (result) {
    let resultMessage = productId.value ? "Chỉnh sửa" : "Tạo mới";
    $toast.success(`${resultMessage} sản phẩm thành công!`);
    navigateTo("/products");
  }
};

// Get list category
const getListCategory = async () => {
  let result = await getOnce<Category>("stockCheck/categories/data");
  if (result) {
    categoryList.value = Object.values(result) as Category[];
  }
}

// Get list shelves
const getListShelves = async () => {
  let result = await getOnce<Shelves>("stockCheck/shelves/data");
  if (result) {
    shelfList.value = Object.values(result) as Shelves[];
  }
}
</script>

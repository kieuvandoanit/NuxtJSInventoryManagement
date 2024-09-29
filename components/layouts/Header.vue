
<template>
  <nav class="flex items-center justify-between flex-wrap bg-teal-500 p-6">
    <div class="flex items-center flex-shrink-0 text-white mr-6">
      <svg
        class="fill-current h-8 w-8 mr-2"
        width="54"
        height="54"
        viewBox="0 0 54 54"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"
        />
      </svg>
      <span class="font-semibold text-xl tracking-tight"
        >Quản lý tồn kho</span
      >
    </div>
    <div class="block lg:hidden">
      <button
        class="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white"
      >
        <svg
          class="fill-current h-3 w-3"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Lựa chọn</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </button>
    </div>
    <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
      <div class="text-sm lg:flex-grow">
        <NuxtLink to="/employee" class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
          Nhân viên
        </NuxtLink>
        <NuxtLink to="/category" class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
          Danh mục
        </NuxtLink>
        <NuxtLink to="/shelves" class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
          Kệ hàng
        </NuxtLink>
        <NuxtLink to="/products" class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
          Sản phẩm
        </NuxtLink>
        <NuxtLink to="/cycles" class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
          Chiến dịch
        </NuxtLink>
        <NuxtLink to="/stock-check" class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
          Kiểm tra hàng hóa
        </NuxtLink>
      </div>
      <div v-if="!user">
        <NuxtLink to="/login" class="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">
          Đăng nhập
        </NuxtLink>
      </div>
      <div v-else class="flex gap-[15px] text-white">
        <div class="text-white">
          <span class="text-[13px]">Xin chào,</span>
          <span class="font-bold"> {{ `${user.firstName} ${user.lastName}` }}</span>
        </div>
        <button @click="logout" class="text-orange-900 hover:font-bold px-[10px]">
          Đăng xuất
        </button>
      </div>
    </div>
  </nav>
</template>
<script lang="ts" setup>
const { user, clearUser } = useUser();

const logout = async () => {
  clearUser();
  // Redirect to the login page
  navigateTo('/login');
}
</script>

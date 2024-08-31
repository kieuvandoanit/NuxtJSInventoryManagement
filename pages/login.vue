<template>
  <div class="flex flex-col px-6 py-12 bg-white rounded-lg">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company">
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="handleLogin" method="POST">
        <div>
          <label for="loginCode" class="block text-sm font-medium leading-6 text-gray-900">Login Code</label>
          <div class="mt-2">
            <input id="loginCode" v-model="form.loginCode" name="login_code" type="text" autocomplete="false" required class="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          </div>
        </div>

        <div>
          <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Login</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useFirebaseDatabase  } from "~/composables/useFirebaseDatabase";
const { setUser } = useUser();

const { findEmployeeByLoginCode } = useFirebaseDatabase();

const form = reactive<any>({
  loginCode: "",
});
const handleLogin = async () => {
  if (form.loginCode) {
    // Get user from database
    const userInfo = await findEmployeeByLoginCode(form.loginCode);

    if (userInfo) {
      setUser(userInfo)
      // Redirect to the home page or another protected page
      navigateTo('/')
    } else {
      alert('Invalid login code!');
    }
  }
}
</script>

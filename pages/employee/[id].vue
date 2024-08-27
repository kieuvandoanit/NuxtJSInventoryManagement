<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4">
      {{ employeeId ? "Edit" : "Create" }} Employee
    </h2>
    <form @submit.prevent="submitForm">
      <div class="relative z-0 w-full mb-5 group">
        <input
          v-model="form.firstName"
          type="text"
          id="firstName"
          autocomplete="false"
          class="block py-2.5 px-0 w-full text-sm text-black text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=""
          required
        />
        <label
          for="firstName"
          class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >First Name</label
        >
      </div>

      <div class="relative z-0 w-full mb-5 group">
        <input
          v-model="form.lastName"
          type="text"
          id="lastName"
          autocomplete="false"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
        />
        <label
          for="lastName"
          class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >Last Name</label
        >
      </div>

      <div class="relative z-0 w-full mb-5 group">
        <input
          v-model="form.email"
          type="email"
          id="email"
          autocomplete="false"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
        />
        <label
          for="email"
          class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >Email Address</label
        >
      </div>

      <div class="relative z-0 w-full mb-5 group">
        <input
          v-model="form.password"
          type="password"
          id="password"
          autocomplete="false"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
        />
        <label
          for="password"
          class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >Password</label
        >
      </div>

      <div class="relative z-0 w-full mb-5 group">
        <input
          v-model="form.avatar"
          type="text"
          id="avatar"
          autocomplete="false"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
        />
        <label
          for="avatar"
          class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >Avatar</label
        >
      </div>

      <div class="relative z-0 w-full mb-5 group">
        <input
          v-model="form.phone"
          type="tel"
          id="phone"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
        />
        <label
          for="phone"
          class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >Phone</label
        >
      </div>

      <div class="relative z-0 w-full mb-6 group">
        <select
          v-model.number="form.role"
          id="role"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          required
        >
          <option
            v-for="option in employeeRoleOption"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
        <label
          for="role"
          class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >Role</label
        >
      </div>

      <div class="relative z-0 w-full mb-6 group">
        <select
          v-model.number="form.status"
          id="status"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          required
        >
          <option
            v-for="option in employeeStatusOption"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
        <label
          for="status"
          class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >Status</label
        >
      </div>
      <div class="flex items-center justify-between">
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { EmployeeStatus, EmployeeRole } from "@/interfaces";
import { v4 as uuidv4 } from "uuid";
import type Employee from "~/interfaces/Employee.interface";
import { useFirebaseDatabase } from "~/composables/useFirebaseDatabase";

const { $toast } = useNuxtApp();
const { create, getAndListen, updateData } = useFirebaseDatabase();
const route = useRoute();

// Declare state
const employeeId = ref<string>("");
const employee = ref<Employee | null>(null);

const form = reactive<Employee>({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  avatar: "",
  phone: "",
  role: EmployeeRole.Staff,
  status: EmployeeStatus.Active,
});

// Function to fetch data and populate the form
const populateForm = (data: Employee | null) => {
  if (data) {
    Object.assign(form, data);
  }
};

const employeeStatusOption = [
  { value: EmployeeStatus.Active, label: "Active" },
  { value: EmployeeStatus.Inactive, label: "Inactive" },
];

const employeeRoleOption = [
  { value: EmployeeRole.Manager, label: "Manager" },
  { value: EmployeeRole.Staff, label: "Staff" },
];

onMounted(async () => {
  if (route.params.id && route.params.id !== "create") {
    employeeId.value = route.params.id as string;
  }

  // Case edit employee
  if (employeeId.value) {
    // fetch current employee value
    getAndListen<Employee>(`employees/${employeeId.value}`, (fetchedData) => {
      employee.value = fetchedData;
      populateForm(fetchedData);
    });
  }
});

// Function to handle form submission
const submitForm = async () => {
  const id = employeeId.value ? employeeId.value : `EMPL_${uuidv4()}`; // Generate UUID
  let newEmployee: Employee = {
    id: id,
    firstName: form.firstName,
    lastName: form.lastName,
    email: form.email,
    password: form.password,
    avatar: form.avatar,
    phone: form.phone,
    role: form.role,
    status: form.status,
    createdAt: employee.value
      ? employee.value?.createdAt
      : currentUnixTimestamp(),
    createdBy: employee.value ? employee.value?.createdBy : "1",
    updatedAt: currentUnixTimestamp(),
    updatedBy: "1",
  };

  // Create/update employee
  let result: boolean = false;
  if (employeeId.value) {
    result = await updateData(`employees/${id}`, newEmployee);
  } else {
    result = await create(`employees/${id}`, newEmployee);
  }
  if (result) {
    let resultMessage = employeeId.value ? "Edit" : "Create";
    $toast.success(`${resultMessage} employee successful!`);
    navigateTo("/employee");
  }
};
</script>

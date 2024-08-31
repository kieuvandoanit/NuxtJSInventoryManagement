<template>
  <div class="default-content">
    <h4 class="bg-green-700">HOME PAGE</h4>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: 'auth' // this should match the name of the file inside the middleware directory 
})
  onMounted(async () => {
    await navigateTo('/employee');
  });
</script>

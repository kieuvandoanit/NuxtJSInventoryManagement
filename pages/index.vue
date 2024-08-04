<template>
  <div class="default-content">
    <h4 class="bg-green-700">HOME PAGE</h4>
  </div>
</template>

<script setup lang="ts">
  onMounted(async () => {
    await navigateTo('/employee');
  });
</script>

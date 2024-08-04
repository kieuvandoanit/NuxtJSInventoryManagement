<template>
  <div class="wrapper">
    <LayoutsHeader/>
    <div class="page_content">
      <slot />
    </div>
    <LayoutsFooter />
  </div>
</template>

<script setup lang="ts">

</script>
<style scoped lang="scss">
.page_content {
  min-height: calc(100vh - 205px);
  width: 1400px;
  margin: 35px auto;
}
</style>

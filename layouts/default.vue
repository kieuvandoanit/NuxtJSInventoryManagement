<template>
  <div class="wrapper">
    <LayoutsHeader/>
    <div class="page_content min-h-80">
      <slot />
    </div>
    <LayoutsFooter/>
  </div>
</template>

<script setup lang="ts">
// import type { Note } from '@/types/note.type';
import useFetchApi from '~/composables/useFetchApi';

// const { signal } = useReloadSignal()

const noteId = 1;

// const { data, refresh } = await useFetchApi<Note[]>('/api/v1/notes');

// if (!data.value) {
//   throw createError({
//     status: 500,
//     statusText: 'Something went wrong!'
//   });
// }

// const notes = ref<Note[]>(data.value.data);

// watch

</script>

<template>
  <div class="flex items-center justify-end border-t border-gray-200 bg-white px-4 py-3">
    <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
      <li
        class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 rounded-l-md"
        :class="{ disabled: currentPage === 1 || loading}"
        @click.prevent="previousPage()"
      >
        Previous
      </li>
      <li
        class="relative z-10 inline-flex items-center px-4 py-2 ring-1 ring-inset bg-indigo-600 ring-gray-300 text-white text-sm font-semibold"
      >
        {{ currentPage }}
      </li>
      <li
        :class="{ disabled: !hasMore || loading}"
        @click.prevent="nextPage()"
        class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 rounded-r-md"
      >
        Next
      </li>
    </nav>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  loading: { type: Boolean, required: true },
  hasMore: { type: Boolean, required: true },
  currentPage: { type: Number, required: true },
});

const emit = defineEmits(['next-page', 'previous-page']);

const nextPage = () => {
  if (props.hasMore && !props.loading) {
    emit('next-page');
  }
};

const previousPage = () => {
  if (props.currentPage !== 1 && !props.loading) {
    emit('previous-page');
  }
};
</script>

<template>
  <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
    <div class="bg-white p-6 rounded-lg shadow-lg relative">
      <button class="absolute top-2 right-2 text-gray-500 hover:text-gray-700" @click="closeModal">
        &times;
      </button>
      <h2 class="text-xl text-center font-semibold mb-4">Mã QR</h2>
      <div class="flex justify-center">
        <qrcode-vue :value="qrValue" :size="200" />
      </div>
      <p class="text-center mt-3">{{ $props.name }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import QrcodeVue from 'qrcode.vue';

export default defineComponent({
  components: {
    QrcodeVue
  },
  props: {
    showModal: {
      type: Boolean,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    qrValue(): string {
      // Tạo QR code từ id
      return `${this.id}`;
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    }
  }
});
</script>

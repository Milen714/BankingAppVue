<script setup>
defineProps({
  currentPage: {
    type: Number,
    default: 0,
  },
  totalPages: {
    type: Number,
    default: 1,
  },
  totalElements: {
    type: Number,
    default: 0,
  },
  pageSize: {
    type: Number,
    default: 20,
  },
  itemLabel: {
    type: String,
    default: 'items',
  },
})

const emit = defineEmits(['page-changed', 'size-changed'])

function goToPage(page) {
  if (page >= 0 && page < props.totalPages) {
    emit('page-changed', page)
  }
}

function handlePageSizeChange(event) {
  emit('size-changed', Number(event.target.value))
}
</script>

<template>
  <div class="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <!-- Items per page -->
    <div class="flex items-center gap-2 text-sm">
      <span class="text-gray-600">Show</span>
      <select
        :value="pageSize"
        @change="handlePageSizeChange"
        class="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        <option :value="10">10</option>
        <option :value="20">20</option>
        <option :value="50">50</option>
      </select>
      <span class="text-gray-600">per page</span>
    </div>

    <!-- Pagination Info -->
    <div class="text-sm text-gray-600 order-3 md:order-2">
      Page {{ currentPage + 1 }} of {{ totalPages }} • Total: {{ totalElements }} {{ itemLabel }}
    </div>

    <!-- Pagination Controls -->
    <div class="flex items-center justify-center gap-2 order-2 md:order-3">
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 0"
        class="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <i class="pi pi-chevron-left text-sm"></i>
      </button>

      <!-- Page Numbers -->
      <div class="flex gap-1">
        <button
          v-for="page in Math.min(5, totalPages)"
          :key="page"
          @click="goToPage(page - 1)"
          :class="[
            'px-3 py-1 rounded text-sm font-medium transition-colors',
            currentPage === page - 1
              ? 'bg-orange-600 text-white'
              : 'border border-gray-300 text-gray-700 hover:bg-gray-100',
          ]"
        >
          {{ page }}
        </button>
      </div>

      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage >= totalPages - 1"
        class="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <i class="pi pi-chevron-right text-sm"></i>
      </button>
    </div>
  </div>
</template>

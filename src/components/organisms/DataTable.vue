<script setup>
import { computed } from 'vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true,
    // Each column: { key, label, sortable }
  },
  data: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  currentSort: {
    type: String,
    default: 'id,asc',
  },
})

const emit = defineEmits(['sort'])

const sortConfig = computed(() => {
  const [field, direction] = props.currentSort.split(',')
  return { field, direction }
})

function handleSort(column) {
  if (!column.sortable) return

  const currentField = sortConfig.value.field
  const currentDirection = sortConfig.value.direction

  let newDirection = 'asc'
  if (currentField === column.key && currentDirection === 'asc') {
    newDirection = 'desc'
  }

  emit('sort', `${column.key},${newDirection}`)
}

function getSortIcon(column) {
  if (!column.sortable) return ''
  if (sortConfig.value.field !== column.key) return 'pi-sort'
  return sortConfig.value.direction === 'asc' ? 'pi-sort-up' : 'pi-sort-down'
}
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <i class="pi pi-spin pi-spinner text-3xl text-gray-400"></i>
    </div>

    <!-- Table -->
    <div v-else>
      <table class="w-full">
        <thead class="bg-[#fef4f0] border-b border-gray-200">
          <tr>
            <th v-for="column in columns" :key="column.key" class="px-4 py-4 text-left">
              <button
                v-if="column.sortable"
                @click="handleSort(column)"
                class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-900 hover:text-orange-600 transition-colors"
              >
                {{ column.label }}
                <i :class="['pi text-xs', getSortIcon(column)]"></i>
              </button>
              <span v-else class="text-xs font-bold uppercase tracking-wider text-gray-900">
                {{ column.label }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <slot></slot>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="data.length === 0" class="flex flex-col items-center justify-center py-12">
        <i class="pi pi-inbox text-4xl text-gray-300 mb-2"></i>
        <p class="text-gray-600 text-sm">No data found</p>
      </div>
    </div>
  </div>
</template>

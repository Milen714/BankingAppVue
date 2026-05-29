<script setup>
defineProps({
  summary: {
    type: [Object, null],
    default: null,
  },
})
</script>

<template>
  <div
    v-if="summary"
    class="bg-gradient-to-r to-orange-400 from-orange-600 rounded-lg shadow-md p-6 mb-6 text-white"
  >
    <div class="flex justify-between items-start">
      <div>
        <p class="text-sm font-medium opacity-90">Total Balance</p>
        <h2 class="text-4xl font-bold mt-2">
          {{ summary.totalBalance?.toFixed(2) || '0.00' }}
        </h2>
        <p class="text-xs opacity-75 mt-1">Across all accounts</p>
      </div>
      <div class="text-right">
        <i class="pi pi-wallet text-5xl opacity-80"></i>
      </div>
    </div>
  </div>
</template>

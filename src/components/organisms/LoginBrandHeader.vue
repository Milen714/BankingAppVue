<script setup>
const props = defineProps({
  brandName: {
    type: String,
    default: 'EuroBank',
  },
})
</script>

<template>
  <div class="flex items-center justify-center gap-2">
    <span
      class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-700 text-white"
    >
      <i class="pi pi-building text-sm"></i>
    </span>
    <span class="text-4xl font-semibold text-slate-900">{{ props.brandName }}</span>
  </div>
</template>

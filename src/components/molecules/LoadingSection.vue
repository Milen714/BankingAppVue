<script setup>
const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: 'pi pi-info-circle',
  },
})
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#e7c9bd] bg-white p-6 text-center"
  >
    <i :class="[props.icon, 'text-3xl text-[#cc570f]']"></i>
    <p class="text-sm text-slate-600">{{ props.message }}</p>
  </div>
</template>

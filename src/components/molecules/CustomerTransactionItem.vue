<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  positive: {
    type: Boolean,
    default: false,
  },
  pending: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: 'pi pi-shopping-bag',
  },
})
</script>

<template>
  <li class="flex items-center justify-between border-b border-[#edd8cf] px-5 py-4 last:border-b-0">
    <div class="flex items-center gap-4">
      <span class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f9e9e2] text-slate-700">
        <i :class="icon"></i>
      </span>
      <div>
        <p class="text-lg font-medium text-slate-900">{{ title }}</p>
        <p class="text-sm text-slate-500">{{ subtitle }}</p>
      </div>
    </div>

    <div class="text-right">
      <p class="text-xl font-medium" :class="positive ? 'text-emerald-700' : 'text-slate-900'">{{ amount }}</p>
      <p class="mt-1 text-sm" :class="pending ? 'text-orange-600' : 'text-emerald-700'">
        <i class="pi mr-1" :class="pending ? 'pi-circle-fill' : 'pi-check-circle'"></i>
        {{ pending ? 'Pending' : 'Completed' }}
      </p>
    </div>
  </li>
</template>

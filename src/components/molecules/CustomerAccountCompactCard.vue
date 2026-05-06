<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  iban: {
    type: String,
    required: true,
  },
  balance: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'APPROVED',
  },
  icon: {
    type: String,
    default: 'pi pi-wallet',
  },
  pending: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="p-4">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <div class="flex items-center gap-3">
          <span class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f8e6de] text-[#b04a12]">
            <i :class="icon"></i>
          </span>
          <div>
            <h4 class="font-semibold text-slate-900">{{ title }}</h4>
            <p class="mt-0.5 text-xs text-slate-500">{{ iban }}</p>
          </div>
        </div>
      </div>

      <div class="text-right">
        <p class="text-lg font-bold text-slate-900">{{ balance }}</p>
        <p
          class="mt-1 inline-flex items-center gap-1 text-xs font-medium"
          :class="pending ? 'text-orange-600' : 'text-emerald-700'"
        >
          <span
            class="h-1.5 w-1.5 rounded-full"
            :class="pending ? 'bg-orange-500' : 'bg-emerald-500'"
          ></span>
          {{ status }}
        </p>
      </div>
    </div>
  </div>
</template>

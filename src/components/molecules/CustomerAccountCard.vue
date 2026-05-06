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
  accent: {
    type: String,
    default: 'bg-rose-50',
  },
})
</script>

<template>
  <article
    class="relative overflow-hidden rounded-2xl border border-[#e7c9bd] bg-white p-5"
    :class="pending ? 'border-dashed bg-[#fff8f5]' : ''"
  >
    <div class="absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-60" :class="accent"></div>

    <div class="relative">
      <div class="flex items-start justify-between">
        <div>
          <h3 class="text-xl font-semibold text-slate-900">{{ title }}</h3>
          <p class="mt-1 font-mono text-xs tracking-[0.18em] text-slate-600">{{ iban }}</p>
        </div>
        <span class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#f8e6de] text-[#b04a12]">
          <i :class="icon"></i>
        </span>
      </div>

      <p class="mt-6 text-4xl font-semibold text-slate-900">{{ balance }}</p>
      <p class="mt-2 inline-flex items-center gap-1 text-xs font-medium" :class="pending ? 'text-orange-600' : 'text-emerald-700'">
        <span class="h-1.5 w-1.5 rounded-full" :class="pending ? 'bg-orange-500' : 'bg-emerald-500'"></span>
        {{ status }}
      </p>
    </div>
  </article>
</template>

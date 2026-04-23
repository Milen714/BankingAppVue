<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  iconBg: {
    type: String,
    default: 'bg-sky-100',
  },
})
</script>

<template>
  <article class="rounded-lg border border-slate-300 bg-white px-4 py-4 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
    <div class="flex items-start gap-4">
      <div :class="[props.iconBg, 'flex h-18 w-18 shrink-0 items-center justify-center rounded-2xl']">
        <i :class="[props.icon, 'text-3xl text-slate-700']"></i>
      </div>

      <div>
        <h3 class="text-3xl font-semibold text-slate-900">{{ props.title }}</h3>
        <p class="mt-1 text-lg leading-8 text-slate-700">{{ props.description }}</p>
      </div>
    </div>
  </article>
</template>

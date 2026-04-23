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
})
</script>

<template>
  <section class="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div class="grid md:grid-cols-[1fr_1fr]">
      <div class="relative min-h-[220px] bg-slate-200">
        <div class="absolute inset-0 bg-[linear-gradient(135deg,#94a3b8_0%,#64748b_55%,#475569_100%)]"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <p class="rounded-lg bg-white/80 px-3 py-1 text-xs font-semibold tracking-wide text-slate-700">
            Hero image placeholder
          </p>
        </div>
      </div>

      <div class="flex flex-col justify-center gap-4 px-5 py-6 sm:px-7">
        <h2 class="inline-block w-fit rounded-md bg-orange-500 px-3 py-1 text-3xl font-bold leading-tight text-white">
          {{ props.title }}
        </h2>
        <p class="max-w-md text-lg leading-8 text-slate-700">
          {{ props.description }}
        </p>
        <button
          type="button"
          class="w-fit rounded-lg bg-indigo-700 px-6 py-2.5 text-lg font-semibold text-white transition-colors hover:bg-indigo-800"
        >
          Create now
        </button>
      </div>
    </div>
  </section>
</template>

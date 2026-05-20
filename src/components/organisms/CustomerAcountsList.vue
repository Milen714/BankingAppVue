<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>
<template>
  <section class="">
    <h2 class="mb-3 mt-3 text-4xl font-semibold text-slate-900 border w-full">{{ props.title }}</h2>
    <div class="grid gap-4 lg:grid-cols-3">
      <slot></slot>
    </div>
  </section>
</template>

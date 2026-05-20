<script setup>
import { RouterLink } from 'vue-router'
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  buttons: {
    type: Array,
    required: true,
  },
})
</script>
<template>
  <header class="flex flex-col gap-4">
    <h2 class="mb-3 mt-3 text-4xl font-semibold text-slate-900">{{ props.title }}</h2>
    <slot></slot>

    <div class="flex flex-wrap gap-5">
      <RouterLink
        :to="button.linkTo"
        v-for="(button, index) in props.buttons"
        :key="index"
        :class="'flex flex-col items-center font-medium w-24 h-28'"
      >
        <span class="flex justify-center rounded-[200px] p-5 bg-[#b54d08] text-white flex-shrink-0">
          <i :class="[button.icon, 'text-2xl text-white']"></i>
        </span>
        <span class="text-center text-sm line-clamp-2 mt-2">{{ button.label }}</span>
      </RouterLink>
    </div>
  </header>
</template>

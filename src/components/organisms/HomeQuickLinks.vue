<script setup>
const props = defineProps({
  links: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <ul class="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
    <li v-for="link in props.links" :key="link.label">
      <a
        :href="link.href || '#'"
        class="inline-flex items-center gap-2 border-b border-slate-300 pb-0.5 font-medium text-slate-700 transition-colors hover:text-orange-600"
      >
        <i :class="[link.icon, 'text-orange-600']"></i>
        <span>{{ link.label }}</span>
      </a>
    </li>
  </ul>
</template>

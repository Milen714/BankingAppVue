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
    
        <div class="flex flex-wrap gap-2">
            <RouterLink
            :to="button.linkTo"
            v-for="(button, index) in props.buttons"
            :key="index"
            :class="[
                'inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-150',
                button.type === 'primary'
                ? 'bg-[#b54d08] text-white hover:bg-[#a74407]'
                : 'bg-[#f7e7e0] text-slate-900 hover:bg-[#f1dbd1]',
            ]"
            >
            <i :class="[button.icon, 'mr-1.5']"></i>
            {{ button.label }}
            </RouterLink>
        </div>
	</header>
</template>
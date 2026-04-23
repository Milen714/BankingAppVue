<script setup>
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()

const props = defineProps({
  to: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: false,
    default: ''
  },
  isActive: {
    type: Boolean,
    required: false,
    default: false
  }
})

const handleClick = () => {
  if (uiStore.isNavMenuOpen) {
    uiStore.toggleNavMenu()
  }
}
</script>

<template>
  <RouterLink
    :to="props.to"
    class="inline-flex items-center rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-150"
    :class="props.isActive ? 'text-blue-700 md:border-b-2 md:border-blue-700' : 'text-slate-600 hover:text-slate-900'"
    :aria-current="props.isActive ? 'page' : undefined"
    @click="handleClick"
  >
    <i v-if="props.icon" :class="props.icon" class="mr-2"></i>
    {{ props.label }}
  </RouterLink>
</template>

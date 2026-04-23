<script setup>
import HomeServiceCard from '@/components/molecules/HomeServiceCard.vue'

const props = defineProps({
  services: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <section class="mt-5 grid gap-3 md:grid-cols-2">
    <HomeServiceCard
      v-for="service in props.services"
      :key="service.title"
      :title="service.title"
      :description="service.description"
      :icon="service.icon"
      :icon-bg="service.iconBg"
    />
  </section>
</template>

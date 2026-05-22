<script setup>
import { computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const props = defineProps({
  type: {
    type: String,
    default: 'accountRequests',
    validator: value => ['accountRequests', 'registrationRequests'].includes(value),
  },
})

const getTitle = () => {
  return props.type === 'accountRequests'
    ? 'PENDING ACCOUNT REQUESTS'
    : 'PENDING REGISTRATION REQUESTS'
}

// Computed properties to reactively update based on userStore
const totalCount = computed(() => userStore.users.length)
const urgentCount = computed(
  () => userStore.users.filter(user => user.urgentReview === true).length
)
const loading = computed(() => userStore.loading)
const error = computed(() => userStore.error)

onMounted(async () => {
  if (props.type === 'accountRequests') {
    await userStore.fetchUsers({ role: 'ROLE_CUSTOMER', isApproved: false })
  } else {
    // Fetch pending registrations when implemented
    await userStore.fetchUsers({ role: 'ROLE_CUSTOMER', isApproved: false })
  }
})
</script>

<template>
  <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
    <!-- Title -->
    <p class="mb-4 text-xs font-bold uppercase tracking-wider text-amber-900">
      {{ getTitle() }}
    </p>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <i class="pi pi-spin pi-spinner text-2xl text-gray-400"></i>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="py-8 text-center text-sm text-red-600">
      {{ error }}
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Large Number -->
      <div class="mb-4">
        <p class="text-5xl font-bold text-gray-900">{{ totalCount }}</p>
      </div>

      <!-- Urgent Count -->
      <div v-if="urgentCount > 0" class="flex items-center gap-2">
        <i class="pi pi-arrow-up text-xs text-orange-600"></i>
        <p class="text-sm font-medium text-orange-600">
          {{ urgentCount }} {{ urgentCount === 1 ? 'need' : 'need' }} urgent review
        </p>
      </div>

      <!-- No Urgent -->
      <div v-else class="text-sm text-gray-600">
        <p>No urgent reviews needed</p>
      </div>
    </div>
  </div>
</template>

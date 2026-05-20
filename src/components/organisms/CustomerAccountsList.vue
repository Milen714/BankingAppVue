<script setup>
import CustomerAccountsCompact from '@/components/organisms/CustomerAccountsCompact.vue'
import EmptySection from '@/components/molecules/EmptySection.vue'
import LoadingSection from '@/components/molecules/LoadingSection.vue'

const props = defineProps({
  currentAccounts: {
    type: Array,
    required: true,
  },
  savingsAccounts: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <!-- Compact Accounts Layout -->
  <section
    v-if="!isLoading"
    class="mt-4 rounded-2xl border border-[#e7c9bd] bg-white p-6 text-center"
  >
    <CustomerAccountsCompact :title="'Current Accounts'" :accounts="currentAccounts" />
    <CustomerAccountsCompact :title="'Savings Accounts'" :accounts="savingsAccounts" />
  </section>

  <!-- Loading State -->
  <LoadingSection v-else message="Loading accounts..." />
  <!-- Empty State -->
  <EmptySection
    v-if="!isLoading && currentAccounts.length === 0 && savingsAccounts.length === 0"
    message="No accounts to display."
  />
</template>

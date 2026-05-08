<script setup>
import CustomerAccountCompactCard from '@/components/molecules/CustomerAccountCompactCard.vue'
import { computed } from 'vue'
import { RouterLink } from 'vue-router';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  accounts: {
    type: Array,
    required: true,
  },
})

/**
 * Get icon and accent color based on account type
 */
function getAccountTypeStyle(type) {
  switch (type) {
    case 'SAVINGS':
      return {
        icon: 'pi pi-star-fill',
        accent: 'bg-sky-100'
      };
    case 'CHECKING':
    default:
      return {
        icon: 'pi pi-credit-card',
        accent: 'bg-orange-100'
      };
  }
}

/**
 * Map account data for display
 */
function mapAccountForDisplay(account) {
  const { icon, accent } = getAccountTypeStyle(account.type);
  return {
    id: account.id,
    title: account.title ?? 'My Account',
    iban: account.iban,
    balance: `EUR ${account.balance.toFixed(2)}`,
    status: account.status,
    icon: icon,
    pending: account.status === 'PENDING_APPROVAL',
    accent: account.status === 'PENDING_APPROVAL' ? 'bg-slate-100' : accent,
  };
}

// Map accounts for display
const mappedAccounts = computed(() => props.accounts.map(mapAccountForDisplay))
</script>

<template>
  <section class="mb-6">
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <i class="pi pi-inbox text-lg text-[#cc570f]"></i>
        <h3 class="text-lg font-semibold text-slate-900">{{ title }}</h3>
      </div>
      <button class="text-slate-400 hover:text-slate-600">
        <i class="pi pi-plus text-lg"></i>
      </button>
    </div>

    <div class="space-y-3">
      <div
        v-for="(account, index) in mappedAccounts"
        :key="account.id"
        class="rounded-xl border border-[#e7c9bd] bg-white transition-all hover:shadow-md"
        :class="account.accent"
      >
        <!-- Compact Account Header -->
        <Router-link :to="`/customer/accounts/${account.iban}`">
          <CustomerAccountCompactCard
            :title="account.title"
            :iban="account.iban"
            :balance="account.balance"
            :status="account.status"
            :icon="account.icon"
            :pending="account.pending"
            :is-expanded="false"
          />
        </Router-link>
      </div>
    </div>
  </section>
</template>

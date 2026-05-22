<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  account: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['approve', 'deny'])

const getStatusClass = () => {
  const statusMap = {
    APPROVED: 'bg-emerald-100 text-emerald-800',
    PENDING: 'bg-orange-100 text-orange-800',
    PENDING_APPROVAL: 'bg-orange-100 text-orange-800',
    REJECTED: 'bg-red-100 text-red-800',
    SUSPENDED: 'bg-gray-100 text-gray-800',
  }
  return statusMap[props.account.status] || 'bg-gray-100 text-gray-800'
}

const getStatusIcon = () => {
  const iconMap = {
    APPROVED: 'pi-check-circle',
    PENDING: 'pi-clock',
    PENDING_APPROVAL: 'pi-clock',
    REJECTED: 'pi-times-circle',
    SUSPENDED: 'pi-ban',
  }
  return iconMap[props.account.status] || 'pi-info-circle'
}

const getTypeLabel = type => {
  const typeMap = {
    CHECKING: 'Checking',
    SAVINGS: 'Savings',
    INVESTMENT: 'Investment',
  }
  return typeMap[type] || type
}

const formatCurrency = value => {
  return new Intl.NumberFormat('en-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
}
const handleAccountClick = () => {
  // Placeholder for future functionality (e.g., view account details)
  router.push(`/employee/account-management/${props.account.iban}`)
}
</script>

<template>
  <tr
    class="border-b border-gray-200 hover:bg-gray-50 transition-colors"
    @click="handleAccountClick"
  >
    <!-- IBAN -->
    <td class="px-4 py-4 text-sm text-gray-900 font-mono">
      {{ account.iban }}
    </td>

    <!-- Owner -->
    <td class="px-4 py-4 text-sm text-gray-900">
      <span v-if="account.owner">{{ account.owner.firstName }} {{ account.owner.lastName }}</span>
      <span v-else class="text-gray-400">-</span>
    </td>

    <!-- Title -->
    <td class="px-4 py-4 text-sm text-gray-900 font-medium">
      <span class="text-orange-600">{{ account.title }}</span>
    </td>

    <!-- Type -->
    <td class="px-4 py-4 text-sm text-gray-600">
      <span
        class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
      >
        {{ getTypeLabel(account.type) }}
      </span>
    </td>

    <!-- Balance -->
    <td class="px-4 py-4 text-sm text-gray-900">
      {{ formatCurrency(account.balance) }}
    </td>

    <!-- Absolute Limit -->
    <td class="px-4 py-4 text-sm text-gray-600">
      {{ formatCurrency(account.absoluteLimit) }}
    </td>

    <!-- Daily Limit -->
    <td class="px-4 py-4 text-sm text-gray-600">
      {{ formatCurrency(account.dailyLimit) }}
    </td>

    <!-- Status -->
    <td class="px-4 py-4 text-sm">
      <span
        :class="[
          'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold',
          getStatusClass(),
        ]"
      >
        <i :class="['pi', getStatusIcon()]"></i>
        {{ account.status }}
      </span>
    </td>

    <!-- Actions -->
    <td class="px-4 py-4 text-sm text-right space-x-2">
      <button
        v-if="account.status === 'PENDING' || account.status === 'PENDING_APPROVAL'"
        @click="emit('approve', account)"
        class="inline-flex items-center px-4 py-2 bg-orange-700 text-white text-xs font-medium rounded hover:bg-orange-800 transition-colors"
      >
        <i class="pi pi-check mr-1"></i>
        Approve
      </button>
      <button
        v-if="account.status === 'PENDING' || account.status === 'PENDING_APPROVAL'"
        @click="emit('deny', account)"
        class="inline-flex items-center px-4 py-2 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors"
      >
        <i class="pi pi-times mr-1"></i>
        Deny
      </button>
      <span v-else class="text-gray-400 text-xs">No actions available</span>
    </td>
  </tr>
</template>

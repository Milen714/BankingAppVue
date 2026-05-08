<script setup>
import CustomerTransactionItem from '@/components/molecules/CustomerTransactionItem.vue'
import { computed } from 'vue'
import { useBankAccountStore } from '@/stores/bankAccount'
import EmptySection from '@/components/molecules/EmptySection.vue'
import LoadingSection from '@/components/molecules/LoadingSection.vue'

const bankAccountStore = useBankAccountStore()

const props = defineProps({
    title: {
      type: String,
      required: true,
    },
  transactions: {
    type: Array,
    required: true,
  },
})

/**
 * Map transaction data for display based on transaction type
 */
function mapTransactionForDisplay(transaction) {
  let title = ''
  let subtitle = ''
  let icon = 'pi pi-arrow-right-arrow-left'

  if (transaction.type === 'DEPOSIT') {
    // DEPOSIT: Show "Deposit to {account}"
    title = `Deposit to ${transaction.toAccount.ownerName}`
    subtitle = `${transaction.toAccount.iban}`
    icon = 'pi pi-plus-circle'
  } else if (transaction.type === 'WITHDRAWAL') {
    // WITHDRAWAL: Show "Withdrawal from {account}"
    title = `Withdrawal from ${transaction.fromAccount.ownerName}`
    subtitle = `${transaction.fromAccount.iban}`
    icon = 'pi pi-minus-circle'
  } else if (transaction.type === 'TRANSFER') {
    // TRANSFER: Show "Transfer to {recipient}"
    title = `Transfer to ${transaction.toAccount.ownerName}`
    subtitle = `${transaction.toAccount.iban}`
    icon = 'pi pi-arrow-right-arrow-left'
  }

  // Add timestamp to subtitle
  const dateStr = new Date(transaction.timestamp).toLocaleDateString()
  const timeStr = new Date(transaction.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  subtitle += ` - ${dateStr} at ${timeStr}`

  return {
    id: transaction.id,
    title,
    subtitle,
    amount: `EUR ${transaction.amount.toFixed(2)}`,
    positive: false,
    pending: false,
    icon,
  }
}

// Map transactions for display
const mappedTransactions = computed(() => props.transactions.map(mapTransactionForDisplay))
</script>

<template>
  <section class="mt-8">
    <div class="mb-3 flex items-center justify-between">
      <h2 class="text-4xl font-semibold text-slate-900">{{ title }}</h2>
      <button type="button" class="text-sm font-medium text-[#cc570f] hover:text-[#b14c0d]">View all</button>
    </div>
    <ul v-if="bankAccountStore.recentTransactions.length > 0"
     class="overflow-hidden rounded-2xl border border-[#e7c9bd] bg-white">
      <CustomerTransactionItem
        v-for="item in mappedTransactions"
        :key="item.id"
        :title="item.title"
        :subtitle="item.subtitle"
        :amount="item.amount"
        :positive="item.positive"
        :pending="item.pending"
        :icon="item.icon"
      />
    </ul>
    <EmptySection v-else 
      message="No recent transactions to display."
      icon="pi pi-inbox"
    />
    <LoadingSection v-if="bankAccountStore.loading" 
      message="Loading transactions..."
    />

  </section>
</template>

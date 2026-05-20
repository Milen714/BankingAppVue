<script setup>
import CustomerSidebarNav from '@/components/organisms/CustomerSidebarNav.vue'
import CustomerBottomNav from '@/components/organisms/CustomerBottomNav.vue'
import PortalHeader from '@/components/organisms/PortalHeader.vue'
import CustomerTransactionItem from '@/components/molecules/CustomerTransactionItem.vue'
import TransactionsList from '@/components/organisms/TransactionsList.vue'
import { useBankAccountStore } from '@/stores/bankAccount'
import { onMounted } from 'vue'

const bankAccountStore = useBankAccountStore()

onMounted(async () => {
  await bankAccountStore.fetchRecentTransactions()
})
</script>

<template>
  <section class="bg-[#f6efec]">
    <div class="mx-auto flex min-h-[calc(100vh-60px)]">
      <CustomerSidebarNav />

      <div class="w-full px-4 pb-24 pt-6 md:px-8 md:pb-8">
        <PortalHeader
          :title="'Recent Transactions'"
          :buttons="[
            {
              label: 'Transfer',
              icon: 'pi pi-arrow-up',
              type: 'primary',
              linkTo: '/customer/transfer',
            },
            {
              label: 'Deposit',
              icon: 'pi pi-arrow-down',
              type: 'primary',
              linkTo: '/customer/deposit',
            },
            {
              label: 'Withdraw Funds',
              icon: 'pi pi-money-bill',
              type: 'primary',
              linkTo: '/customer/withdraw',
            },
            {
              label: 'Request New Account',
              icon: 'pi pi-plus-circle',
              type: 'secondary',
              linkTo: '/customer/request-account',
            },
          ]"
        />

        <!-- Transactions Section -->
        <section class="mt-8">
          <TransactionsList
            :title="'Recent Transactions'"
            :transactions="bankAccountStore.recentTransactions"
          />
        </section>
      </div>
    </div>

    <CustomerBottomNav />
  </section>
</template>

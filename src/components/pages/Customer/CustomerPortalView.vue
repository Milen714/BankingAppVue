<script setup>
import CustomerSidebarNav from '@/components/organisms/SidebarNav.vue'
import CustomerBottomNav from '@/components/organisms/CustomerBottomNav.vue'
import PortalHeader from '@/components/organisms/PortalHeader.vue'
import CustomerAccountsList from '@/components/organisms/CustomerAccountsList.vue'
import TransactionsList from '@/components/organisms/TransactionsList.vue'
import { useBankAccountStore } from '@/stores/bankAccount'
import { useTransactionStore } from '@/stores/transaction'
import { onMounted, computed } from 'vue'

const bankAccountStore = useBankAccountStore()
const transactionStore = useTransactionStore()

onMounted(async () => {
  console.log('Portal mounted, fetching accounts...')
  await bankAccountStore.fetchMyBankAccounts()
  await transactionStore.fetchRecentTransactions()
})

const currentAccounts = computed(() => bankAccountStore.myCurrentAccounts)

const savingsAccounts = computed(() => bankAccountStore.mySavingsAccounts)
</script>

<template>
  <!-- <i  class="pi pi-spin pi-spinner  mr-2"></i> -->
  <section class="bg-[#f6efec]">
    <div class="mx-auto flex min-h-[calc(100vh-60px)]">
      <CustomerSidebarNav />

      <div class="w-full px-4 pb-24 pt-6 md:px-8 md:pb-8">
        <PortalHeader
          :title="'Overview'"
          :buttons="[
            {
              label: 'Transfer',
              icon: 'pi pi-arrow-up',
              type: 'primary',
              linkTo: '/customer/transfer',
            },
            {
              label: 'Deposit ATM',
              icon: 'pi pi-arrow-down',
              type: 'primary',
              linkTo: '/customer/deposit',
            },
            {
              label: 'Withdraw ATM',
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

        <!-- Error Message -->
        <section
          v-if="bankAccountStore.error"
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
        >
          {{ bankAccountStore.error }}
        </section>

        <!-- Accounts Section -->
        <CustomerAccountsList
          :current-accounts="currentAccounts"
          :savings-accounts="savingsAccounts"
          :is-loading="bankAccountStore.loading"
        />

        <!-- Transactions Section -->
        <section class="mt-8">
          <TransactionsList
            :title="'Recent Transactions'"
            :transactions="transactionStore.recentTransactions"
          />
        </section>
      </div>
    </div>

    <CustomerBottomNav />
  </section>
</template>

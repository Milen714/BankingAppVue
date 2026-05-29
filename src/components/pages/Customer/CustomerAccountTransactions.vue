<script setup>
import CustomerSidebarNav from '@/components/organisms/SidebarNav.vue'
import CustomerBottomNav from '@/components/organisms/CustomerBottomNav.vue'
import PortalHeader from '@/components/organisms/PortalHeader.vue'
import CustomerTransactionItem from '@/components/molecules/CustomerTransactionItem.vue'
import PaginationControls from '@/components/organisms/PaginationControls.vue'
import TransactionFilterSection from '@/components/molecules/TransactionFilterSection.vue'
import TransactionsList from '@/components/organisms/TransactionsList.vue'
import { useTransactionStore } from '@/stores/transaction'
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'
import { useTransactionFilters } from '@/composables/useTransactionFilters'

const authStore = useAuthStore()
const transactionStore = useTransactionStore()
const {
  ibanSearch,
  startDateFilter,
  endDateFilter,
  typeFilter,
  amountComparisonType,
  amountValue,
  handleSearch,
  goToPage,
  handlePageSizeChange,
} = useTransactionFilters(authStore.user.id)

// Initialize on mount
onMounted(async () => {
  await transactionStore.fetchAllTransactions({
    ownerId: authStore.user.id,
    page: 0,
    pageSize: 20,
    sort: 'timestamp,desc',
  })
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

        <!-- Transactions Section -->
        <section class="mt-8">
          <!-- Filter & Search Section -->
          <TransactionFilterSection
            v-model:ibanSearch="ibanSearch"
            v-model:startDateFilter="startDateFilter"
            v-model:endDateFilter="endDateFilter"
            v-model:typeFilter="typeFilter"
            v-model:amountComparisonType="amountComparisonType"
            v-model:amountValue="amountValue"
            @search="handleSearch"
          />
          <!-- <TransactionsList
            :title="'Recent Transactions'"
            :transactions="transactionStore.recentTransactions"
          /> -->
          <TransactionsList
            :title="'Recent Transactions'"
            :transactions="transactionStore.transactions"
          />
        </section>
        <!-- Pagination Section using PaginationControls Component -->
        <PaginationControls
          :current-page="transactionStore.currentPage"
          :total-pages="transactionStore.totalPages"
          :total-elements="transactionStore.totalElements"
          :page-size="transactionStore.pageSize"
          item-label="transactions"
          @page-changed="goToPage"
          @size-changed="handlePageSizeChange"
        />
      </div>
    </div>

    <CustomerBottomNav />
  </section>
</template>

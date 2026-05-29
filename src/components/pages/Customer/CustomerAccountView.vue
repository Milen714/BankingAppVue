<script setup>
import CustomerSidebarNav from '@/components/organisms/SidebarNav.vue'
import CustomerBottomNav from '@/components/organisms/CustomerBottomNav.vue'
import PortalHeader from '@/components/organisms/PortalHeader.vue'
import TransactionsList from '@/components/organisms/TransactionsList.vue'
import TransactionFilterSection from '@/components/molecules/TransactionFilterSection.vue'
import PaginationControls from '@/components/organisms/PaginationControls.vue'
import BankAccountInfoCard from '@/components/molecules/BankAccountInfoCard.vue'
import { useBankAccountStore } from '@/stores/bankAccount'
import { useTransactionStore } from '@/stores/transaction'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTransactionFilters } from '@/composables/useTransactionFilters'

const route = useRoute()
const iban = route.params.iban
const bankAccountStore = useBankAccountStore()
const transactionStore = useTransactionStore()
const bankAccount = ref(null)

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
} = useTransactionFilters()

onMounted(async () => {
  await bankAccountStore.fetchMyBankAccounts()
  await bankAccountStore.fetchBankAccountByIban(iban)
  bankAccount.value = bankAccountStore.selectedAccount

  // Set IBAN to the selected account
  ibanSearch.value = iban

  // Fetch transactions with pagination
  await handleSearch()
})
</script>

<template>
  <section class="bg-[#f6efec]">
    <div class="mx-auto flex min-h-[calc(100vh-60px)]">
      <CustomerSidebarNav />

      <div class="w-full px-4 pb-24 pt-6 md:px-8 md:pb-8">
        <PortalHeader
          :title="bankAccount ? bankAccount.title : 'Account Details'"
          :buttons="[
            {
              label: 'Transfer',
              icon: 'pi pi-arrow-up',
              type: 'primary',
              linkTo: `/customer/transfer?fromIban=${bankAccount?.iban}`,
            },
            {
              label: 'Deposit ATM',
              icon: 'pi pi-arrow-down',
              type: 'primary',
              linkTo: `/customer/deposit?iban=${bankAccount?.iban}`,
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
            {
              label: 'Settings',
              icon: 'pi pi-cog',
              type: 'secondary',
              linkTo: `/customer/accounts/settings/${bankAccount?.iban}`,
            },
          ]"
        />

        <BankAccountInfoCard v-if="bankAccount" :bankAccount="bankAccount" class="mb-8" />

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
            :hideIbanField="true"
            @search="handleSearch"
          />

          <TransactionsList
            :title="'Account Transactions'"
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

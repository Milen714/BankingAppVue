<script setup>
import CustomerSidebarNav from '@/components/organisms/SidebarNav.vue'
import CustomerBottomNav from '@/components/organisms/CustomerBottomNav.vue'
import PortalHeader from '@/components/organisms/PortalHeader.vue'
import TransactionsList from '@/components/organisms/TransactionsList.vue'
import BankAccountInfoCard from '@/components/molecules/BankAccountInfoCard.vue'
import { useBankAccountStore } from '@/stores/bankAccount'
import { useTransactionStore } from '@/stores/transaction'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const iban = route.params.iban
const bankAccountStore = useBankAccountStore()
const transactionStore = useTransactionStore()
const bankAccount = ref(null)

onMounted(async () => {
  await bankAccountStore.fetchMyBankAccounts()
  await bankAccountStore.fetchBankAccountByIban(iban)
  await transactionStore.fetchAccountTransactions(iban)
  bankAccount.value = bankAccountStore.selectedAccount
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
              label: 'Deposit',
              icon: 'pi pi-arrow-down',
              type: 'primary',
              linkTo: `/customer/deposit?iban=${bankAccount?.iban}`,
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
